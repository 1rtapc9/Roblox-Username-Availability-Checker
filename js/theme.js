const btn = document.getElementById("themeToggle");
const theme = localStorage.getItem("theme") || "light";
document.documentElement.dataset.theme = theme;

btn.onclick = () => {
  const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = t;
  localStorage.setItem("theme", t);
};
