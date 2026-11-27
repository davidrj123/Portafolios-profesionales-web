import { filterAndSortWorks, normalizeText } from "./filters.js";
import { openWorkDetail } from "./project-detail.js";

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
    && (work.description === undefined || typeof work.description === "string")
    && (work.fullDescription === undefined || typeof work.fullDescription === "string")
    && (work.subject === undefined || typeof work.subject === "string")
    && (work.date === undefined || typeof work.date === "string")
    && (work.category === undefined || typeof work.category === "string")
    && (work.activityType === undefined || typeof work.activityType === "string")
    && (work.coverImage === undefined || typeof work.coverImage === "string")
    && (work.technologies === undefined || (Array.isArray(work.technologies) && work.technologies.every(item => typeof item === "string")))
    && (work.reflection === undefined || typeof work.reflection === "string")
    && (work.learnings === undefined || typeof work.learnings === "string");
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
      || typeof item.workId !== "string"
      || !["task", "project"].includes(item.workType)) return false;
    if (item.url !== undefined && typeof item.url !== "string") return false;
    if (item.path !== undefined && typeof item.path !== "string") return false;
    if (!item.url && !item.path) return false;
    if (item.type !== undefined && typeof item.type !== "string") return false;
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

function isSafeEvidenceUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value, window.location.href).protocol);
  } catch {
    return false;
  }
}

function getSafeAssetTarget(value) {
  if (typeof value !== "string") return null;
  if (isSafeEvidenceUrl(value)) return value;
  if (/^(?:[A-Za-z]:[\\/]|\\\\|\/)/.test(value) || value.split(/[\\/]/).includes("..")) return null;
  try {
    const url = new URL(value, window.location.href);
    return url.origin === window.location.origin ? url.href : null;
  } catch {
    return null;
  }
}

function isValidDate(value) {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function renderPortfolio(portfolio) {
  const emptyState = document.querySelector("[data-empty-work]");
  const browser = document.querySelector("[data-work-browser]");
  const workList = document.querySelector("[data-work-list]");
  const noResults = document.querySelector("[data-work-no-results]");
  const resultsLabel = document.querySelector("[data-work-results]");
  const works = [
    ...portfolio.tasks.map(task => ({ ...task, kind: "task" })),
    ...portfolio.projects.map(project => ({ ...project, kind: "project" }))
  ];

  emptyState.hidden = works.length > 0;
  browser.hidden = works.length === 0;
  if (works.length === 0) return;

  const search = browser.querySelector("[data-work-search]");
  const sort = browser.querySelector("[data-work-sort]");
  const filterButtons = [...browser.querySelectorAll("[data-filter]")];
  const categoryFilters = browser.querySelector("[data-category-filters]");
  let activeFilter = "all";
  let activeCategory = "";

  search.value = "";
  sort.value = "recent";
  for (const button of filterButtons) {
    const active = button.dataset.filter === "all";
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  }

  const categories = [...new Set(
    works.map(work => work.category).filter(category => typeof category === "string" && category.trim())
  )].sort((left, right) => left.localeCompare(right, "es"));
  categoryFilters.replaceChildren();
  if (categories.length) {
    const allCategory = document.createElement("button");
    allCategory.type = "button";
    allCategory.className = "category-filter is-active";
    allCategory.dataset.category = "";
    allCategory.textContent = "Todas las categorías";
    allCategory.setAttribute("aria-pressed", "true");
    categoryFilters.append(allCategory);
  }
  for (const category of categories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-filter";
    button.dataset.category = category;
    button.textContent = category;
    button.setAttribute("aria-pressed", "false");
    categoryFilters.append(button);
  }

  for (const button of filterButtons) {
    const visible = button.dataset.filter === "all"
      || button.dataset.filter === "individual"
      || button.dataset.filter === "grupal"
      || (button.dataset.filter === "project" && works.some(work => work.kind === "project"))
      || (button.dataset.filter === "practice" && works.some(work => normalizeText(work.activityType) === "practica"))
      || (button.dataset.filter === "investigation" && works.some(work => normalizeText(work.activityType) === "investigacion"));
    button.hidden = !visible;
  }

  const update = () => {
    const filtered = filterAndSortWorks(works, {
      query: search.value,
      filter: activeFilter,
      category: activeCategory,
      sort: sort.value
    });
    workList.replaceChildren();
    noResults.hidden = filtered.length > 0;
    workList.hidden = filtered.length === 0;
    resultsLabel.textContent = `${filtered.length} ${filtered.length === 1 ? "trabajo" : "trabajos"} encontrado${filtered.length === 1 ? "" : "s"}`;

    for (const work of filtered) {
      const card = document.createElement("article");
      card.className = "work-card";

      if (work.coverImage) {
        const coverTarget = getSafeAssetTarget(work.coverImage);
        if (coverTarget) {
          const image = document.createElement("img");
          image.className = "work-cover";
          image.src = coverTarget;
          image.alt = "";
          image.loading = "lazy";
          card.append(image);
        } else {
          console.warn(`Se omitió una imagen de portada no válida: ${work.coverImage}`);
        }
      }

      const body = document.createElement("div");
      body.className = "work-card-body";
      if (work.category) appendText(body, "span", work.category, "work-category");
      appendText(body, "h3", work.title);
      if (work.description) appendText(body, "p", work.description, "work-description");

      const metadata = document.createElement("div");
      metadata.className = "work-meta";
      const metaItems = [
        work.subject,
        isValidDate(work.date) ? work.date : null,
        work.kind === "project"
          ? "Proyecto"
          : work.type === "individual"
            ? "Individual"
            : work.type === "grupal"
              ? "Grupal"
              : null,
        work.activityType
      ].filter(Boolean);
      for (const item of metaItems) appendText(metadata, "span", item);
      if (metadata.childElementCount) body.append(metadata);

      if (Array.isArray(work.technologies) && work.technologies.length) {
        const technologyList = document.createElement("div");
        technologyList.className = "work-technologies";
        for (const technology of work.technologies) appendText(technologyList, "span", technology);
        body.append(technologyList);
      }

      const detailButton = document.createElement("button");
      detailButton.type = "button";
      detailButton.className = "work-detail-button";
      detailButton.textContent = "Consultar detalles";
      detailButton.addEventListener("click", () =>
        openWorkDetail(work, portfolio.evidence, portfolio.subject));
      body.append(detailButton);
      card.append(body);
      workList.append(card);
    }
  };

  search.oninput = update;
  sort.onchange = update;
  for (const button of filterButtons) {
    button.onclick = () => {
      activeFilter = button.dataset.filter;
      for (const item of filterButtons) {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      }
      update();
    };
  }
  for (const button of categoryFilters.querySelectorAll("button")) {
    button.onclick = () => {
      activeCategory = button.dataset.category;
      for (const item of categoryFilters.querySelectorAll("button")) {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      }
      update();
    };
  }
  update();
}

export function renderTimeline(portfolio) {
  const emptyState = document.querySelector("[data-timeline-empty]");
  const list = document.querySelector("[data-timeline-list]");
  const works = [
    ...portfolio.tasks.map(task => ({ ...task, kind: "task" })),
    ...portfolio.projects.map(project => ({ ...project, kind: "project" }))
  ];
  const datedWorks = works
    .filter(work => isValidDate(work.date))
    .sort((left, right) => left.date.localeCompare(right.date));

  list.replaceChildren();
  emptyState.hidden = datedWorks.length > 0;
  list.hidden = datedWorks.length === 0;

  for (const work of datedWorks) {
    const item = document.createElement("li");
    item.className = "timeline-item";

    const marker = document.createElement("div");
    marker.className = "timeline-marker";
    marker.setAttribute("aria-hidden", "true");

    const content = document.createElement("article");
    content.className = "timeline-card";

    const date = document.createElement("time");
    date.className = "timeline-date";
    date.dateTime = work.date;
    date.textContent = work.date;
    content.append(date);

    appendText(content, "h3", work.title);
    const type = work.kind === "project"
      ? "Proyecto"
      : work.type === "individual"
        ? "Individual"
        : work.type === "grupal"
          ? "Grupal"
          : null;
    const metadata = [work.subject, type].filter(Boolean);
    if (metadata.length) {
      const meta = document.createElement("p");
      meta.className = "timeline-meta";
      meta.textContent = metadata.join(" · ");
      content.append(meta);
    }
    if (work.description) appendText(content, "p", work.description, "timeline-description");

    item.append(marker, content);
    list.append(item);
  }
}
