const input = document.getElementById("username");
const button = document.getElementById("checkBtn");
const result = document.getElementById("result");

async function checkUsername(name) {
  const res = await fetch(
    `https://api.roblox-username-availability-checke.vercel.app/api/check?username=${encodeURIComponent(name)}`
  );
  return res.json();
}

button.addEventListener("click", async () => {
  const username = input.value.trim();
  if (!username) return;

  result.textContent = "Checking...";
  plausible("SingleCheck");

  try {
    const data = await checkUsername(username);

    if (data.status === "available") {
      result.innerHTML = `<span class="available">Available.</span>`;
    } else {
      result.innerHTML = `<span class="taken">Taken.</span>`;
    }
  } catch {
    // Absolute fallback — still no errors
    result.innerHTML = `<span class="taken">Taken.</span>`;
  }
});
