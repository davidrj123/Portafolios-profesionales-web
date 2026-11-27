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
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("is-active",
      (name === "comparison" && link.hasAttribute("data-comparison"))
      || (name === "selection" && link.hasAttribute("data-home")));
  });
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
  const menu = document.querySelector(".mobile-menu");
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      menuToggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    }
  });

  const profileLinks = [...document.querySelectorAll(".profile-nav a")];
  const observedSections = profileLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (!visible) return;
      profileLinks.forEach(link => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.25] });
    observedSections.forEach(section => observer.observe(section));
  }
  profileLinks.forEach(link => {
    link.addEventListener("click", () => {
      profileLinks.forEach(item => item.classList.toggle("is-active", item === link));
    });
  });
}
