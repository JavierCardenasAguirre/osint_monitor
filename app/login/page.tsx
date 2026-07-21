'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                setError(data.error || 'Error al iniciar sesión');
                return;
            }

            if (data.user) {
                localStorage.setItem('user_id', data.user.id);
                localStorage.setItem('user_role', data.user.role);
            }

            // Forzar navegación completa para evitar problemas de estado
            window.location.href = '/';

        } catch (err) {
            setLoading(false);
            setError('Ocurrió un error de conexión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
                <h1 className="text-2xl font-bold text-white mb-4">Iniciar sesión</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button type="submit" disabled={loading} className="w-full p-2 bg-green-600 rounded text-white">
                        {loading ? 'Verificando...' : 'Entrar'}
                    </button>
                </form>

                {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}

                <p className="mt-6 text-center text-sm text-gray-400">
                    ¿No tienes cuenta? <Link href="/register" className="text-blue-400">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}