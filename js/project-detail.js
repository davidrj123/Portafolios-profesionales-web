function appendDetailSection(container, title, content) {
  if (content == null || content === "" || (Array.isArray(content) && content.length === 0)) return;
  const section = document.createElement("section");
  section.className = "detail-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading);

  if (Array.isArray(content)) {
    const list = document.createElement("ul");
    for (const item of content) {
      const listItem = document.createElement("li");
      listItem.textContent = item.title || item;
      list.append(listItem);
    }
    section.append(list);
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    section.append(paragraph);
  }
  container.append(section);
}

function isSafeUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value, window.location.href).protocol);
  } catch {
    return false;
  }
}

function isValidDate(value) {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function openWorkDetail(work, evidence, portfolioSubject) {
  const dialog = document.querySelector("[data-work-detail]");
  const content = dialog.querySelector("[data-detail-content]");
  content.replaceChildren();

  const header = document.createElement("header");
  header.className = "detail-header";
  if (work.category) {
    const category = document.createElement("span");
    category.className = "detail-category";
    category.textContent = work.category;
    header.append(category);
  }
  const title = document.createElement("h2");
  title.id = "work-detail-title";
  title.textContent = work.title;
  header.append(title);
  content.append(header);

  appendDetailSection(content, "Descripción", work.fullDescription || work.description);

  const metadata = document.createElement("dl");
  metadata.className = "detail-meta";
  const fields = [
    ["Materia", work.subject || portfolioSubject],
    ["Fecha", isValidDate(work.date) ? work.date : null],
    ["Tipo", work.kind === "project"
      ? "Proyecto"
      : work.type === "individual"
        ? "Individual"
        : work.type === "grupal"
          ? "Grupal"
          : null],
    ["Categoría", work.category],
    ["Actividad", work.activityType]
  ];
  for (const [label, value] of fields) {
    if (!value) continue;
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value;
    metadata.append(term, description);
  }
  if (metadata.childElementCount) content.append(metadata);

  appendDetailSection(content, "Tecnologías", Array.isArray(work.technologies) ? work.technologies : null);
  appendDetailSection(content, "Aprendizajes", work.learnings);
  appendDetailSection(content, "Reflexión", work.reflection);

  const workEvidence = evidence.filter(item =>
    item.workId === work.id && item.workType === work.kind);
  const validEvidence = workEvidence.filter(item => isSafeUrl(item.url));
  if (validEvidence.length) {
    const section = document.createElement("section");
    section.className = "detail-section";
    const heading = document.createElement("h3");
    heading.textContent = "Evidencias";
    const list = document.createElement("ul");
    list.className = "detail-evidence";
    for (const item of validEvidence) {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = item.title;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      listItem.append(link);
      list.append(listItem);
    }
    section.append(heading, list);
    content.append(section);
  }

  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

export function initWorkDetail() {
  const dialog = document.querySelector("[data-work-detail]");
  const closeButton = dialog.querySelector("[data-detail-close]");
  const closeDialog = () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  };
  closeButton.addEventListener("click", () => {
    closeDialog();
  });
  dialog.addEventListener("click", event => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
    }
  });
}
