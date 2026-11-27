export async function loadStudents() {
  const response = await fetch("./data/students.json");
  if (!response.ok) throw new Error("No se pudo cargar students.json");

  const students = await response.json();
  if (!students || Array.isArray(students) || typeof students !== "object") {
    throw new TypeError("students.json debe contener un objeto de estudiantes");
  }

  for (const [id, student] of Object.entries(students)) {
    if (student.id !== id || typeof student.name !== "string") {
      throw new TypeError(`El registro del estudiante "${id}" no es válido`);
    }
  }
  return students;
}

export function setStudentName(element, name) {
  const words = name.trim().split(/\s+/);
  const breakAt = Math.ceil(words.length / 2);
  element.replaceChildren(
    document.createTextNode(words.slice(0, breakAt).join(" ")),
    document.createElement("br"),
    document.createTextNode(words.slice(breakAt).join(" "))
  );
}