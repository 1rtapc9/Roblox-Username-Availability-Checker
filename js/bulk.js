const bulkBtn = document.getElementById("bulkBtn");
const bulkInput = document.getElementById("bulkInput");
const bulkResult = document.getElementById("bulkResult");

bulkBtn.addEventListener("click", async () => {
  const names = bulkInput.value
    .split("\n")
    .map(n => n.trim())
    .filter(Boolean)
    .slice(0, 10);

  bulkResult.innerHTML = "";
  plausible("BulkCheck");

  for (const name of names) {
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
      const cls = data.status === "available" ? "available" : "taken";

      bulkResult.innerHTML += `<div class="${cls}">${name}</div>`;

      // rate-limit safety
      await new Promise(r => setTimeout(r, 400));
    } catch {}
  }
});
