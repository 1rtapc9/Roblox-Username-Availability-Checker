const bulkBtn = document.getElementById("bulkBtn");
const bulkInput = document.getElementById("bulkInput");
const bulkResults = document.getElementById("bulkResults");

bulkBtn.onclick = async () => {
  bulkResults.innerHTML = "";
  const names = [...new Set(
    bulkInput.value.split("\n").map(n => n.trim()).filter(Boolean)
  )].slice(0, 10);

  for (const name of names) {
    const li = document.createElement("li");
    li.textContent = `${name}: checking…`;
    bulkResults.appendChild(li);

    const status = await check(name);
    li.textContent = `${name}: ${status === "available" ? "Available." : "Taken."}`;
  }

  const a = JSON.parse(localStorage.getItem("analytics") || "{}");
  a.bulk = (a.bulk || 0) + 1;
  localStorage.setItem("analytics", JSON.stringify(a));
};
