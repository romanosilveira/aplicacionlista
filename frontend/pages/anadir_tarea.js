// pages/anadir-tarea.js

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import TaskForm from '../components/TasksForm';



export default function AddTaskPage() {
  const  { user }  = useContext(AuthContext);
  const router = useRouter();
console.log(user);
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Añadir nueva tarea</h1>
      <TaskForm />
    </main>
  );
}
