import { useState } from "react";

export default function TaskForm({ tasks, setTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Título y descripción son obligatorios");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://10.123.2.15:8000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      // ... resto del código
    } catch (error) {
      // manejo del error
    }
    
      if (!res.ok) throw new Error("Error al crear la tarea");

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded"
      >
        {loading ? "Añadiendo..." : "Añadir Tarea"}
      </button>
    </form>
  );
}
