'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from './components/dashboard';

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Verificar sesión en localStorage
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('user_role');

    if (!userId) {
      // Si no hay sesión, redirigir al login inmediatamente
      router.push('/login');
    } else {
      // Opcional: Podrías añadir aquí un fetch a /api/auth/validate 
      // para confirmar que el admin no haya revocado el acceso del usuario.
      setIsAuthorized(true);
    }
  }, [router]);

  // Mientras verifica la sesión, mostramos un estado de carga
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Verificando acceso al monitor...</p>
        </div>
      </div>
    );
  }

  // Si está autorizado, cargamos tu Dashboard original de noticias_datacore
  return <Dashboard />;
}