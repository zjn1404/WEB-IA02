document.addEventListener("DOMContentLoaded", () => {
  const darkModeButton = document.getElementById("dark-mode-button");
  const darkModeLabel = document.getElementById("dark-mode-label");
  const app = document.getElementById("app");

  darkModeButton.addEventListener("change", () => {
    if (darkModeButton.checked) {
      app.setAttribute("data-bs-theme", "dark");
      darkModeLabel.innerHTML = '<p class="fa-solid fa-moon mb-0"></p>';
    } else {
      app.setAttribute("data-bs-theme", "light");
      darkModeLabel.innerHTML = '<p class="fa-regular fa-sun mb-0"></p>';
    }
  });
});
