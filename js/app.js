const input = document.getElementById("username");
const button = document.getElementById("checkBtn");
const result = document.getElementById("result");

const CACHE_TTL = 86400000;
const RATE_LIMIT = 800;
let lastCall = 0;

function normalize(name) {
  return name.trim().replace(/\s+/g, "").slice(0, 20);
}

function getCache(name) {
  const c = JSON.parse(localStorage.getItem("cache") || "{}");
  if (!c[name]) return null;
  if (Date.now() - c[name].t > CACHE_TTL) return null;
  return c[name].s;
}

function setCache(name, s) {
  const c = JSON.parse(localStorage.getItem("cache") || "{}");
  c[name] = { s, t: Date.now() };
  localStorage.setItem("cache", JSON.stringify(c));
}

function track(k) {
  const a = JSON.parse(localStorage.getItem("analytics") || "{}");
  a[k] = (a[k] || 0) + 1;
  localStorage.setItem("analytics", JSON.stringify(a));
}

async function check(name) {
  const cached = getCache(name);
  if (cached) return cached;

  if (!navigator.onLine) return "taken";

  const wait = RATE_LIMIT - (Date.now() - lastCall);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCall = Date.now();

  try {
    const r = await fetch("https://auth.roblox.com/v1/usernames/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name, birthday: "2000-01-01" })
    });

    const d = await r.json();
    const s = d.code === 0 ? "available" : "taken";
    setCache(name, s);
    return s;
  } catch {
    return "taken";
  }
}

button.onclick = async () => {
  const name = normalize(input.value);
  if (!name) return;
  result.textContent = "Checking...";
  track("single");
  const s = await check(name);
  result.innerHTML = `<span class="${s}">${s === "available" ? "Available." : "Taken."}</span>`;
};
