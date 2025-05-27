// components/TaskList.jsx
import React from 'react';

export default function TaskList({ tasks, onDeleteTask }) {
  return (
    <div className="w-full max-w-3xl overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow-md">
        <thead>
          <tr>
            <th className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300 uppercase text-sm">Título</th>
            <th className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300 uppercase text-sm">Descripción</th>
            <th className="py-3 px-6 bg-gray-200 dark:bg-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-6 text-gray-500 dark:text-gray-400">
                No hay tareas
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="py-4 px-6 text-gray-900 dark:text-white">{task.title}</td>
                <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{task.description}</td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
