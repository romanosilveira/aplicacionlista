// src/utils/api.js

const API_URL = "http://10.123.2.15:8000"; // cambia si usas localhost:8000

export async function fetchTasks(token) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
}

export async function addTask(token, task) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
}

export async function deleteTask(token, taskId) {
  const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al eliminar tarea");
}
