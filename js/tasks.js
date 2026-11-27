export function getTaskStats(tasks = []) {
  return {
    total: tasks.length,
    individual: tasks.filter(task => task.type === "individual").length,
    group: tasks.filter(task => task.type === "grupal").length
  };
}

function uniqueValues(values) {
  return [...new Set(values.filter(value => typeof value === "string" && value.trim()))];
}

export function getPortfolioStats(portfolio = {}, fallbackSubject = "") {
  const tasks = Array.isArray(portfolio.tasks) ? portfolio.tasks : [];
  const projects = Array.isArray(portfolio.projects) ? portfolio.projects : [];
  const works = [...tasks, ...projects];
  const taskStats = getTaskStats(tasks);

  const subjects = works.length
    ? uniqueValues([
        ...(fallbackSubject ? [fallbackSubject] : []),
        ...works.map(work => work.subject)
      ])
    : [];
  const categories = uniqueValues(works.map(work => work.category));
  const technologies = uniqueValues(
    works.flatMap(work => Array.isArray(work.technologies) ? work.technologies : [])
  );

  return {
    total: taskStats.total,
    individual: taskStats.individual,
    group: taskStats.group,
    projects: projects.length,
    subjects: subjects.length,
    subjectNames: subjects,
    categories: categories.length,
    categoryNames: categories,
    technologies: technologies.length,
    technologyNames: technologies
  };
}