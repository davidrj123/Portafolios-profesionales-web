import { loadStudents, setStudentName } from "./students.js";
import { getTaskStats } from "./tasks.js";
import { loadPortfolios, renderPortfolio } from "./portfolio.js";
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
  document.querySelector("#profile-initial").textContent = student.initial;
  document.querySelector("#profile-description").textContent = `${student.career} · ${student.semester}`;
  document.querySelector("#profile-hero").style.setProperty("--profile-accent", student.color === "violet" ? "#c16aff" : "#35baff");

  const portfolio = portfolios[student.id];
  const stats = getTaskStats(portfolio.tasks);
  document.querySelector('[data-stat="tasks"]').textContent = String(stats.total).padStart(2, "0");
  document.querySelector('[data-stat="subjects"]').textContent = student.subject ? "01" : "00";
  document.querySelector('[data-stat="individual"]').textContent = String(stats.individual).padStart(2, "0");
  document.querySelector('[data-stat="group"]').textContent = String(stats.group).padStart(2, "0");
  document.querySelector(".profile-kicker b").style.color = student.color === "violet" ? "#c16aff" : "#35baff";
  document.querySelector(".profile-glow").style.background = student.color === "violet"
    ? "radial-gradient(ellipse, rgba(193,106,255,.2), transparent 70%)"
    : "radial-gradient(ellipse, rgba(35,160,255,.18), transparent 70%)";
  renderPortfolio(portfolio);
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
  localStorage.setItem("academic-showcase-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
}
themeToggle.addEventListener("click", toggleTheme);
document.querySelector(".mobile-theme").addEventListener("click", toggleTheme);
if (localStorage.getItem("academic-showcase-theme") === "light") document.body.classList.add("light-theme");

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