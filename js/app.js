const input = document.getElementById("username");
const button = document.getElementById("checkBtn");
const result = document.getElementById("result");

async function validateUsername(name) {
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
  return res.json();
}

button.addEventListener("click", async () => {
  const username = input.value.trim();
  if (!username) return;

  result.textContent = "Checking...";
  plausible("SingleCheck");

  try {
    const data = await validateUsername(username);

    if (data.code === 0) {
      result.innerHTML = `<span class="available">${username} is available</span>`;
    } else {
      result.innerHTML = `<span class="taken">${username} is taken</span>`;
    }
  } catch {
    result.textContent = "Error checking username.";
  }
});
