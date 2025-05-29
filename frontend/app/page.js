'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';  // Ajusta la ruta si es necesario
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('token');

    fetch('http://localhost:8000/api/tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener tareas');
        return res.json();
      })
      .then((data) => {
        const normalized = data.map((t) => ({
          id: t.id ?? t._id,
          title: t.title,
          description: t.description,
        }));
        setTasks(normalized);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [user, router]);

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar tarea');
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la tarea');
    }
  };

  if (!user) return null;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tareas de {user.username}</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
        <button
          onClick={() => router.push('/anadirtarea')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Añadir nueva tarea
        </button>
      </div>

      {loading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p>No hay tareas.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow overflow-x-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left py-2 px-4">Título</th>
              <th className="text-left py-2 px-4">Descripción</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(({ id, title, description }) => (
              <tr key={id} className="border-t">
                <td className="py-2 px-4">{title}</td>
                <td className="py-2 px-4">{description || '-'}</td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleDeleteTask(id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
