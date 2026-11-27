import { students } from "./students.js";
import { loadTasks, getTaskStats } from "./tasks.js";
import { initEntranceAnimations, runScreenTransition } from "./animations.js";

const screens = {
  selection: document.querySelector("#selection-screen"),
  profile: document.querySelector("#profile-screen"),
  comparison: document.querySelector("#comparison-screen")
};

let currentStudent = null;
let taskData = { guillermo: [], eduardo: [] };

function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle("is-visible", key === name);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  document.querySelector(".mobile-menu").classList.remove("is-open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
}

function updateProfile(student) {
  currentStudent = student;
  const profile = screens.profile;
  profile.classList.toggle("profile--violet", student.color === "violet");
  document.querySelector("#profile-number").textContent = student.number;
  document.querySelector("#profile-name").innerHTML = student.name.replace(" Jimenez", "<br>Jimenez").replace(" Zamorano", "<br>Zamorano");
  document.querySelector("#profile-eyebrow").textContent = `STUDENT ${student.number} · ${student.identity}`;
  document.querySelector("#profile-initial").textContent = student.initial;
  document.querySelector("#profile-hero").style.setProperty("--profile-accent", student.color === "violet" ? "#c16aff" : "#35baff");

  const stats = getTaskStats(taskData[student.id] || []);
  document.querySelector('[data-stat="tasks"]').textContent = String(stats.total).padStart(2, "0");
  document.querySelector('[data-stat="subjects"]').textContent = "01";
  document.querySelector('[data-stat="individual"]').textContent = String(stats.individual).padStart(2, "0");
  document.querySelector('[data-stat="group"]').textContent = String(stats.group).padStart(2, "0");
  document.querySelector(".profile-kicker b").style.color = student.color === "violet" ? "#c16aff" : "#35baff";
  document.querySelector(".profile-glow").style.background = student.color === "violet"
    ? "radial-gradient(ellipse, rgba(193,106,255,.2), transparent 70%)"
    : "radial-gradient(ellipse, rgba(35,160,255,.18), transparent 70%)";
}

function openStudent(id) {
  const student = students[id];
  if (!student) return;
  runScreenTransition(() => {
    updateProfile(student);
    showScreen("profile");
  }, student.color === "violet" ? "#241333" : "#0b2942");
}

function openComparison() {
  runScreenTransition(() => showScreen("comparison"), "#111426");
}

document.querySelectorAll("[data-open-student]").forEach(button => {
  button.addEventListener("click", () => openStudent(button.dataset.openStudent));
});
document.querySelectorAll("[data-home]").forEach(button => {
  button.addEventListener("click", () => runScreenTransition(() => showScreen("selection")));
});
document.querySelectorAll("[data-comparison]").forEach(button => {
  button.addEventListener("click", openComparison);
});

const themeToggle = document.querySelector(".theme-toggle");
function toggleTheme() {
  document.body.classList.toggle("light-theme");
  localStorage.setItem("academic-showcase-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
}
themeToggle.addEventListener("click", toggleTheme);
document.querySelector(".mobile-theme").addEventListener("click", toggleTheme);
if (localStorage.getItem("academic-showcase-theme") === "light") document.body.classList.add("light-theme");

const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const menu = document.querySelector(".mobile-menu");
  const isOpen = menu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

async function init() {
  taskData = await loadTasks();
  initEntranceAnimations();
}
init();