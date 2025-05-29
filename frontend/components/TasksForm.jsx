'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:8000/api/tasks';

export default function TaskForm() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Título y descripción son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) throw new Error('Error al crear la tarea');

      // Redirigir al home tras crear
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddTask} className="max-w-xl mx-auto p-6 space-y-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Añadir nueva tarea</h2>

      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Agregar tarea'}
      </button>
    </form>
  );
}
