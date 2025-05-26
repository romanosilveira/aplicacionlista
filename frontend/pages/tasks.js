import { useState } from "react";
import TaskList from "../components/TaskList";

export default function TasksPage({ initialTasks }) {


  return (
    <>
      <TasksForm initialTasks={initialTasks} />
      <TaskList />

    </>


  );
}

// SSR: carga tareas desde backend
export async function getServerSideProps(context) {
  try {
    const res = await fetch("http://localhost:8000/api/tasks", {
      headers: {
        // Aquí también la cookie o token si hace falta
        // cookie: context.req.headers.cookie || "",
      },
    });
    const initialTasks = await res.json();

    return {
      props: {
        initialTasks,
      },
    };
  } catch (error) {
    return {
      props: {
        initialTasks: [],
      },
    };
  }
}
