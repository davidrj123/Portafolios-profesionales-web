import { getTaskStats } from "./tasks.js";
import { setStudentName } from "./students.js";

export function renderComparison(students, portfolios) {
  const entries = Object.values(students).map(student => ({
    student,
    total: getTaskStats(portfolios[student.id]?.tasks ?? []).total
  }));
  const maxTotal = Math.max(0, ...entries.map(entry => entry.total));

  for (const { student, total } of entries) {
    const card = document.querySelector(`[data-comparison-student="${student.id}"]`);
    card.querySelector("[data-comparison-label]").textContent =
      `${student.number} / ${student.firstName.toUpperCase()}`;
    card.querySelector("[data-comparison-initial]").textContent = student.initial;
    setStudentName(card.querySelector("[data-comparison-name]"), student.name);
    card.querySelector("[data-comparison-career]").textContent = student.career;
    card.querySelector("[data-comparison-count]").textContent = String(total).padStart(2, "0");
    card.querySelector("[data-comparison-bar]").style.width =
      maxTotal === 0 ? "0%" : `${(total / maxTotal) * 100}%`;
  }
}
