export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getWorkSearchText(work) {
  return normalizeText([
    work.title,
    work.description,
    work.fullDescription,
    work.subject,
    work.category,
    ...(Array.isArray(work.technologies) ? work.technologies : [])
  ].join(" "));
}

export function filterAndSortWorks(works, { query = "", filter = "all", category = "", sort = "recent" }) {
  const normalizedQuery = normalizeText(query);
  const normalizedCategory = normalizeText(category);
  const filtered = works.filter(work => {
    const matchesQuery = !normalizedQuery || getWorkSearchText(work).includes(normalizedQuery);
    const matchesCategory = !normalizedCategory
      || normalizeText(work.category) === normalizedCategory;
    let matchesFilter = true;

    if (filter === "individual") matchesFilter = work.kind === "task" && work.type === "individual";
    if (filter === "grupal") matchesFilter = work.kind === "task" && work.type === "grupal";
    if (filter === "project") matchesFilter = work.kind === "project";
    if (filter === "practice") matchesFilter = normalizeText(work.activityType) === "practica";
    if (filter === "investigation") matchesFilter = normalizeText(work.activityType) === "investigacion";

    return matchesQuery && matchesCategory && matchesFilter;
  });

  return [...filtered].sort((left, right) => {
    if (sort === "alphabetical") {
      return String(left.title ?? "").localeCompare(String(right.title ?? ""), "es", { sensitivity: "base" });
    }
    const leftDate = Date.parse(left.date) || 0;
    const rightDate = Date.parse(right.date) || 0;
    return sort === "oldest" ? leftDate - rightDate : rightDate - leftDate;
  });
}
