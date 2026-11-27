import { runScreenTransition } from "./animations.js";

const screens = {
  selection: document.querySelector("#selection-screen"),
  profile: document.querySelector("#profile-screen"),
  comparison: document.querySelector("#comparison-screen")
};

export function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle("is-visible", key === name);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  document.querySelector(".mobile-menu").classList.remove("is-open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
}

export function initNavigation({ onOpenStudent, onOpenComparison }) {
  document.querySelectorAll("[data-open-student]").forEach(button => {
    button.addEventListener("click", () => onOpenStudent(button.dataset.openStudent));
  });
  document.querySelectorAll("[data-home]").forEach(button => {
    button.addEventListener("click", event => {
      if (button.tagName === "A") event.preventDefault();
      runScreenTransition(() => showScreen("selection"));
    });
  });
  document.querySelectorAll("[data-comparison]").forEach(button => {
    button.addEventListener("click", onOpenComparison);
  });

  const menuToggle = document.querySelector(".menu-toggle");
  menuToggle.addEventListener("click", () => {
    const menu = document.querySelector(".mobile-menu");
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
