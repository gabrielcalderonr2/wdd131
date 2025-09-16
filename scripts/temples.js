document.addEventListener("DOMContentLoaded", () => {
  // footer dynamic year and last modified
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = document.lastModified;

  // hamburger menu toggle
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  menuBtn.addEventListener("click", () => {
    if (menu.style.display === "flex") {
      menu.style.display = "none";
      menuBtn.textContent = "☰";
    } else {
      menu.style.display = "flex";
      menuBtn.textContent = "✖";
    }
  });
});
