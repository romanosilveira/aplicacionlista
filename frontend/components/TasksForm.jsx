import { useState } from "react";

export default function TasksPage({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Si usas auth por token en header, aquí lo pones
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
        credentials: "include", // para cookies, si usas
      });

      if (!res.ok) throw new Error("Error creando la tarea");

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Mis Tareas</h1>

      {/* Formulario */}
      <form
        onSubmit={handleAddTask}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md mb-8"
      >
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded transition"
        >
          {loading ? "Añadiendo..." : "Añadir Tarea"}
        </button>
      </form>
    </div>

    )
}

