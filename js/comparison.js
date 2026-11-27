import { getPortfolioStats } from "./tasks.js";
import { setStudentName } from "./students.js";

export function renderComparison(students, portfolios) {
  const entries = Object.values(students).map(student => {
    const portfolio = portfolios[student.id] ?? { tasks: [], projects: [], evidence: [] };
    return {
      student,
      stats: getPortfolioStats(portfolio, student.subject)
    };
  });
  const totals = entries.map(entry => entry.stats.total);
  const maxTotal = Math.max(0, ...totals);

  for (const { student, stats } of entries) {
    const card = document.querySelector(`[data-comparison-student="${student.id}"]`);
    card.querySelector("[data-comparison-label]").textContent =
      `${student.number} / ${student.firstName.toUpperCase()}`;
    card.querySelector("[data-comparison-initial]").textContent = student.initial;
    setStudentName(card.querySelector("[data-comparison-name]"), student.name);
    card.querySelector("[data-comparison-career]").textContent = student.career;
    card.querySelector("[data-comparison-count]").textContent = String(stats.total).padStart(2, "0");
    card.querySelector("[data-comparison-projects]").textContent = String(stats.projects).padStart(2, "0");
    card.querySelector("[data-comparison-individual]").textContent = String(stats.individual).padStart(2, "0");
    card.querySelector("[data-comparison-group]").textContent = String(stats.group).padStart(2, "0");
    card.querySelector("[data-comparison-subjects]").textContent = String(stats.subjects).padStart(2, "0");
    card.querySelector("[data-comparison-categories]").textContent = String(stats.categories).padStart(2, "0");
    card.querySelector("[data-comparison-technologies]").textContent = String(stats.technologies).padStart(2, "0");
    renderTags(card.querySelector("[data-comparison-category-list]"), stats.categoryNames);
    renderTags(card.querySelector("[data-comparison-tech-list]"), stats.technologyNames);
    card.querySelector("[data-comparison-bar]").style.width =
      maxTotal === 0 ? "0%" : `${(stats.total / maxTotal) * 100}%`;
  }
}

function renderTags(container, names) {
  container.replaceChildren();
  if (!names.length) {
    const empty = document.createElement("span");
    empty.className = "comparison-tag comparison-tag--empty";
    empty.textContent = "Sin datos";
    container.append(empty);
    return;
  }
  for (const name of names) {
    const tag = document.createElement("span");
    tag.className = "comparison-tag";
    tag.textContent = name;
    container.append(tag);
  }
}
