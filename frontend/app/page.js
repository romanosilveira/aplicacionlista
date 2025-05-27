'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:8000/api/tasks';

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inputs para nueva tarea
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('token');

    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener tareas');
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [user, router]);
console.log('user', tasks);
  if (!user) return null;

  const handleAddTask = () => {
    if (!title.trim()) return alert('El título es obligatorio');

    const token = localStorage.getItem('token');
    const newTask = {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || null,
    };

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al crear tarea');
        return res.json();
      })
      .then((createdTask) => {
        setTasks((prev) => [...prev, createdTask]);
        setTitle('');
        setDescription('');
        setDueDate('');
      })
      .catch(console.error);
  };

  const handleDeleteTask = (id) => {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar tarea');
        setTasks((prev) => prev.filter((task) => task.id !== id));
      })
      .catch(console.error);
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
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
          {tasks.length === 0 ? (
            <p>No hay tareas.</p>
          ) : (
            <table className="min-w-full bg-white rounded shadow overflow-x-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left py-2 px-4">Título</th>
                  <th className="text-left py-2 px-4">Descripción</th>
                  <th className="text-left py-2 px-4">Fecha de ejecución</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(({ id, title, description, due_date }) => (
                  <tr key={id} className="border-t">
                    <td className="py-2 px-4">{title}</td>
                    <td className="py-2 px-4">{description || '-'}</td>
                    <td className="py-2 px-4">
                      {due_date ? new Date(due_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => handleDeleteTask(id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
            className="mt-6 flex flex-col gap-3"
          >
            <input
              type="text"
              placeholder="Título *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Añadir Tarea
            </button>
          </form>
        </>
      )}
    </main>
  );
}
