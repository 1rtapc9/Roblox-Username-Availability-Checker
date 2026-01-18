const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
}

function updateIcon() {
  toggle.textContent =
    root.getAttribute("data-theme") === "light" ? "☀️" : "🌙";
}

updateIcon();

toggle.addEventListener("click", () => {
  const newTheme =
    root.getAttribute("data-theme") === "light" ? "dark" : "light";

  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateIcon();
});
