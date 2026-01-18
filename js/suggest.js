const suggestBtn = document.getElementById("suggestBtn");
const baseName = document.getElementById("baseName");
const suggestions = document.getElementById("suggestions");

suggestBtn.addEventListener("click", () => {
  const base = baseName.value || "Player";

  const generated = Array.from({ length: 6 }, () =>
    base + Math.floor(Math.random() * 9000 + 1000)
  );

  suggestions.innerHTML = generated
    .map(name => `<div>${name}</div>`)
    .join("");

  plausible("Suggestions");
});
