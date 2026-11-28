import { loadStudents, setStudentName } from "./students.js";
import { getPortfolioStats } from "./tasks.js";
import { loadPortfolios, renderPortfolio, renderTimeline } from "./portfolio.js";
import { renderComparison } from "./comparison.js";
import { initNavigation, showScreen } from "./navigation.js";
import { initEntranceAnimations, runScreenTransition } from "./animations.js";
import { initWorkDetail } from "./project-detail.js";

let students = {};
let portfolios = {};

function updateProfile(student) {
  const profile = document.querySelector("#profile-screen");
  profile.classList.toggle("profile--violet", student.color === "violet");
  document.querySelector("#profile-number").textContent = student.number;
  setStudentName(document.querySelector("#profile-name"), student.name);
  document.querySelector("#profile-eyebrow").textContent = `STUDENT ${student.number} · ${student.identity}`;
  document.querySelector("#profile-description").textContent = `${student.career} · ${student.semester}`;
  document.querySelector("#profile-hero").style.setProperty("--profile-accent", student.color === "violet" ? "#c16aff" : "#35baff");

  const portfolio = portfolios[student.id];
  const stats = getPortfolioStats(portfolio, student.subject);
  document.querySelector('[data-stat="tasks"]').textContent = String(stats.total).padStart(2, "0");
  document.querySelector('[data-stat="subjects"]').textContent = String(stats.subjects).padStart(2, "0");
  document.querySelector('[data-stat="individual"]').textContent = String(stats.individual).padStart(2, "0");
  document.querySelector('[data-stat="group"]').textContent = String(stats.group).padStart(2, "0");
  document.querySelector('[data-stat="projects"]').textContent = String(stats.projects).padStart(2, "0");
  document.querySelector('[data-stat="categories"]').textContent = String(stats.categories).padStart(2, "0");
  document.querySelector('[data-stat="technologies"]').textContent = String(stats.technologies).padStart(2, "0");
  document.querySelector(".profile-kicker b").style.color = student.color === "violet" ? "#c16aff" : "#35baff";
  document.querySelector(".profile-glow").style.background = student.color === "violet"
    ? "radial-gradient(ellipse, rgba(193,106,255,.2), transparent 70%)"
    : "radial-gradient(ellipse, rgba(35,160,255,.18), transparent 70%)";
  const portrait = document.querySelector("#profile-portrait");
  const photography = portfolio.profile?.photography;
  portrait.replaceChildren();
  if (photography) {
    const image = document.createElement("img");
    image.src = photography;
    image.alt = `Fotografía de ${student.name}`;
    portrait.append(image);
  } else {
    const initial = document.createElement("span");
    initial.id = "profile-initial";
    initial.textContent = student.initial;
    const caption = document.createElement("small");
    caption.innerHTML = "FOTOGRAFÍA<br>PRÓXIMAMENTE";
    portrait.append(initial, caption);
  }
  const objectiveCard = document.querySelector("[data-profile-objective]");
  const objectives = portfolio.profile?.objectives;
  objectiveCard.hidden = !objectives;
  if (objectives) {
    objectiveCard.querySelector("p").textContent = objectives;
  }
  renderPortfolio(portfolio);
  renderTimeline(portfolio);
  document.querySelectorAll("[data-profile-switch]").forEach(button => {
    const active = button.dataset.profileSwitch === student.id;
    button.hidden = active;
  });
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
  renderComparison(students, portfolios);
  runScreenTransition(() => showScreen("comparison"), "#111426");
}

function updateStudentCards() {
  for (const student of Object.values(students)) {
    const card = document.querySelector(`[data-student-card="${student.id}"]`);
    setStudentName(card.querySelector("[data-student-name]"), student.name);
    card.querySelector("[data-student-meta]").textContent = `${student.number} — ${student.identity}`;
    card.querySelector("[data-student-initial]").textContent = student.initial;
    card.querySelector("[data-student-career]").textContent = student.career.toUpperCase();
  }
}

const themeToggle = document.querySelector(".theme-toggle");
function toggleTheme() {
  document.body.classList.toggle("light-theme");
  const theme = document.body.classList.contains("light-theme") ? "light" : "dark";
  localStorage.setItem("academic-showcase-theme", theme);
  syncThemeControls(theme);
}
function syncThemeControls(theme) {
  const isLight = theme === "light";
  document.querySelector(".theme-icon").textContent = isLight ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
  themeToggle.setAttribute("title", isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
  document.querySelector(".mobile-theme").textContent = isLight ? "Usar modo oscuro" : "Usar modo claro";
  document.querySelector('meta[name="theme-color"]').setAttribute("content", isLight ? "#f3f5fa" : "#080d18");
}
themeToggle.addEventListener("click", toggleTheme);
document.querySelector(".mobile-theme").addEventListener("click", toggleTheme);
const savedTheme = localStorage.getItem("academic-showcase-theme");
if (savedTheme === "light") document.body.classList.add("light-theme");
syncThemeControls(savedTheme === "light" ? "light" : "dark");

async function init() {
  students = await loadStudents();
  portfolios = await loadPortfolios(students);
  updateStudentCards();
  renderComparison(students, portfolios);
  initWorkDetail();
  initNavigation({ onOpenStudent: openStudent, onOpenComparison: openComparison });
  initEntranceAnimations();
}
init().catch(error => console.error("No se pudo iniciar Academic Showcase.", error));