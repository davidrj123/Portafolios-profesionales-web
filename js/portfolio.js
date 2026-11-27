function emptyPortfolio() {
  return { tasks: [], projects: [], evidence: [] };
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasWorkFields(work) {
  return isRecord(work)
    && typeof work.id === "string"
    && typeof work.title === "string"
    && work.title.trim().length > 0
    && (work.description === undefined || typeof work.description === "string");
}

function isPortfolio(value) {
  if (!isRecord(value)
    || !Array.isArray(value.tasks)
    || !Array.isArray(value.projects)
    || !Array.isArray(value.evidence)
    || !value.tasks.every(task => hasWorkFields(task) && ["individual", "grupal"].includes(task.type))
    || !value.projects.every(hasWorkFields)) return false;

  return value.evidence.every(item => {
    if (!isRecord(item)
      || typeof item.id !== "string"
      || typeof item.title !== "string"
      || typeof item.url !== "string"
      || typeof item.workId !== "string"
      || !["task", "project"].includes(item.workType)) return false;
    const works = item.workType === "task" ? value.tasks : value.projects;
    return works.some(work => work.id === item.workId);
  });
}

export async function loadPortfolios(students) {
  const entries = await Promise.all(Object.values(students).map(async student => {
    try {
      const response = await fetch(`./data/${encodeURIComponent(student.id)}/portfolio.json`);
      if (!response.ok) throw new Error(`No se pudo cargar el portafolio de ${student.id}`);
      const portfolio = await response.json();
      if (!isPortfolio(portfolio)) throw new TypeError(`El portafolio de ${student.id} no tiene un formato válido`);
      return [student.id, portfolio];
    } catch (error) {
      console.warn(error.message);
      return [student.id, emptyPortfolio()];
    }
  }));
  return Object.fromEntries(entries);
}

function appendText(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

function evidenceForWork(evidence, work) {
  return evidence.filter(item => item.workId === work.id && item.workType === work.kind);
}

function isSafeEvidenceUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value, window.location.href).protocol);
  } catch {
    return false;
  }
}

export function renderPortfolio(portfolio) {
  const emptyState = document.querySelector("[data-empty-work]");
  const workList = document.querySelector("[data-work-list]");
  const works = [
    ...portfolio.tasks.map(task => ({ ...task, kind: "task" })),
    ...portfolio.projects.map(project => ({ ...project, kind: "project" }))
  ];

  workList.replaceChildren();
  emptyState.hidden = works.length > 0;
  workList.hidden = works.length === 0;

  for (const work of works) {
    const card = document.createElement("article");
    card.className = "stat-card work-card";
    appendText(card, "span", work.kind === "project" ? "PROYECTO" : "TRABAJO", "eyebrow");
    appendText(card, "h3", work.title);
    if (work.description) appendText(card, "p", work.description);
    if (work.kind === "task" && work.type) {
      appendText(card, "span", work.type === "individual" ? "Individual" : "Grupal", "work-type");
    }

    const workEvidence = evidenceForWork(portfolio.evidence, work);
    if (workEvidence.length) {
      const links = document.createElement("ul");
      links.className = "work-evidence";
      for (const item of workEvidence) {
        if (!isSafeEvidenceUrl(item.url)) {
          console.warn(`Se omitió una URL de evidencia no válida: ${item.url}`);
          continue;
        }
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = item.title;
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        listItem.append(link);
        links.append(listItem);
      }
      card.append(links);
    }
    workList.append(card);
  }
}
