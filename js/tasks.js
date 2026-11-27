// Los trabajos reales se incorporarán más adelante en data/tasks.json.
export async function loadTasks() {
  try {
    const response = await fetch("./data/tasks.json");
    if (!response.ok) throw new Error("No se pudo cargar tasks.json");
    return await response.json();
  } catch (error) {
    console.warn(error.message);
    return { guillermo: [], eduardo: [] };
  }
}

export function getTaskStats(tasks = []) {
  return {
    total: tasks.length,
    individual: tasks.filter(task => task.type === "individual").length,
    group: tasks.filter(task => task.type === "grupal").length
  };
}