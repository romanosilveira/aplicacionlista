'use client';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await login(username, password);

    setLoading(false);

    if (success) {
      router.push('/');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-sm mx-auto">
      {error && <p className="text-red-500">{error}</p>}

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
        required
        className="border p-2 rounded"
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        type="password"
        required
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Ingresando...' : 'Entrar'}
      </button>
    </form>
  );
}
