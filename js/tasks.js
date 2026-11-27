export function getTaskStats(tasks = []) {
  return {
    total: tasks.length,
    individual: tasks.filter(task => task.type === "individual").length,
    group: tasks.filter(task => task.type === "grupal").length
  };
}