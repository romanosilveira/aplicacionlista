import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState(() => {
    // Carga tareas guardadas en localStorage para este usuario
    const saved = localStorage.getItem(`tasks_${user?.username}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    // Guarda tareas cada vez que cambian, asociadas al usuario
    if (user) {
      localStorage.setItem(`tasks_${user.username}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? {...task, done: !task.done} : task
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  if (!user) return <p>No estás logueado.</p>;

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Bienvenido, {user.username}</h2>
      <button onClick={logout}>Cerrar sesión</button>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => { if(e.key === 'Enter') addTask(); }}
          style={{ width: '70%', marginRight: 10 }}
        />
        <button onClick={addTask}>Agregar</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              style={{ marginRight: 10 }}
            />
            <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            <button
              onClick={() => removeTask(task.id)}
              style={{ marginLeft: 10, color: 'red' }}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
