'use client'

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:8000/api/tasks';  // URL completa backend

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('jwtToken');
    
    fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener tareas');
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [user, router]);

  if (!user) return null;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const token = localStorage.getItem('jwtToken');
    const newTask = { title: newTaskTitle.trim(), description: '' };

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newTask)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al crear tarea');
        return res.json();
      })
      .then(createdTask => {
        setTasks(prev => [...prev, createdTask]);
        setNewTaskTitle('');
      })
      .catch(console.error);
  };

  const handleDeleteTask = (id) => {
    const token = localStorage.getItem('jwtToken');

    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar tarea');
        setTasks(prev => prev.filter(task => task.id !== id));
      })
      .catch(console.error);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tareas de {user.username}</h1>

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-6"
      >
        Cerrar sesión
      </button>

      {loading ? (
        <p>Cargando tareas...</p>
      ) : (
        <>
          <ul className="mb-4">
            {tasks.length === 0 && <p>No hay tareas.</p>}
            {tasks.map(task => (
              <li
                key={task.id}
                className="flex justify-between items-center mb-2 border p-2 rounded"
              >
                <span>{task.title}</span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nueva tarea"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              className="border p-2 rounded flex-grow"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Añadir
            </button>
          </div>
        </>
      )}
    </main>
  );
}
