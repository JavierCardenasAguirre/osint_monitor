'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(data.error || 'Error en el registro');
        return;
      }

      setMessage(data.message || 'Registro exitoso');
      // Opcional: redirigir al login
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setLoading(false);
      setMessage('Error de conexión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-4">Registro</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <button type="submit" disabled={loading} className="w-full p-2 bg-blue-600 rounded text-white">
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-gray-300">{message}</p>}

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta? <Link href="/login" className="text-blue-400">Entrar</Link>
        </p>
      </div>
    </div>
  );
}