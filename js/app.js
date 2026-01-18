const input = document.getElementById("username");
const button = document.getElementById("checkBtn");
const result = document.getElementById("result");

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const RATE_LIMIT_MS = 800;

let lastRequestTime = 0;

/* ---------- Utilities ---------- */

function now() {
  return Date.now();
}

function normalizeUsername(name) {
  return name
    .trim()
    .replace(/\s+/g, "")
    .slice(0, 20);
}

function getCache(name) {
  const cache = JSON.parse(localStorage.getItem("usernameCache") || "{}");
  const entry = cache[name];
  if (!entry) return null;
  if (now() - entry.time > CACHE_TTL) return null;
  return entry.status;
}

function setCache(name, status) {
  const cache = JSON.parse(localStorage.getItem("usernameCache") || "{}");
  cache[name] = { status, time: now() };
  localStorage.setItem("usernameCache", JSON.stringify(cache));
}

function track(event) {
  const stats = JSON.parse(localStorage.getItem("analytics") || "{}");
  stats[event] = (stats[event] || 0) + 1;
  localStorage.setItem("analytics", JSON.stringify(stats));
}

/* ---------- Core Check ---------- */

async function checkUsername(name) {
  const cached = getCache(name);
  if (cached) return cached;

  if (!navigator.onLine) return "taken";

  const elapsed = now() - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise(r => setTimeout(r, RATE_LIMIT_MS - elapsed));
  }

  lastRequestTime = now();

  try {
    const res = await fetch(
      "https://auth.roblox.com/v1/usernames/validate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          birthday: "2000-01-01"
        })
      }
    );

    const data = await res.json();
    const status = data.code === 0 ? "available" : "taken";

    setCache(name, status);
    return status;
  } catch {
    return "taken";
  }
}

/* ---------- UI ---------- */

button.addEventListener("click", async () => {
  let name = normalizeUsername(input.value);
  if (!name) return;

  result.textContent = "Checking...";
  track("singleCheck");

  const status = await checkUsername(name);

  if (status === "available") {
    result.innerHTML = `<span class="available">Available.</span>`;
  } else {
    result.innerHTML = `<span class="taken">Taken.</span>`;
  }
});
