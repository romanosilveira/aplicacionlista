import { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function TasksPage({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks || []);

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Puedes eliminar esta línea si no usas autenticación aún
        },
      });

      if (!res.ok) throw new Error("No se pudo eliminar la tarea");

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Mis Tareas</h1>
      <TaskForm tasks={tasks} setTasks={setTasks} />
      <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const res = await fetch("http://localhost:8000/api/tasks", {
      headers: {
        Authorization: context.req.headers.authorization || "",
      },
    });

    const initialTasks = await res.json();
    return { props: { initialTasks } };
  } catch (error) {
    return { props: { initialTasks: [] } };
  }
}
