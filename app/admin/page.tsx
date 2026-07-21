'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  approved: boolean;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const callerId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || '' : '';

  // Redirect if not logged or not admin
  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;

    if (!userId) {
      router.push('/login');
      return;
    }
    if (role !== 'admin') {
      router.push('/');
      return;
    }
    // otherwise load users
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'x-user-id': callerId || '' },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error('Error fetching users', body);
        toast.error(body.error || 'Error cargando usuarios');
        setUsers([]);
        return;
      }

      const data = await res.json();
      setUsers(data.users ?? []);
    } catch (err) {
      console.error('Fetch users exception', err);
      toast.error('Error de conexión al obtener usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [callerId]);

  const setUserActionLoading = (id: string, v: boolean) =>
    setActionLoading(prev => ({ ...prev, [id]: v }));

  async function handleApprove(userId: string) {
    if (!confirm('¿Aprobar este usuario?')) return;
    setUserActionLoading(userId, true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': callerId || '',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('Approve failed', data);
        toast.error(data.error || 'No se pudo aprobar el usuario');
        return;
      }

      toast.success('Usuario aprobado');
      await fetchUsers();
    } catch (err) {
      console.error('Approve exception', err);
      toast.error('Error de conexión al aprobar');
    } finally {
      setUserActionLoading(userId, false);
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm('Eliminar usuario: esta acción es irreversible. ¿Continuar?')) return;
    setUserActionLoading(userId, true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': callerId || '',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('Delete failed', data);
        toast.error(data.error || 'No se pudo eliminar el usuario');
        return;
      }

      toast.success('Usuario eliminado');
      await fetchUsers();
    } catch (err) {
      console.error('Delete exception', err);
      toast.error('Error de conexión al eliminar');
    } finally {
      setUserActionLoading(userId, false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel de Control: Acceso Usuarios</h1>
            <p className="text-sm text-gray-400">Aprobar o eliminar usuarios registrados</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
            >
              Volver al Dashboard
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('user_id');
                localStorage.removeItem('user_role');
                window.location.href = '/login';
              }}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-300">Cargando usuarios...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t border-gray-700">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      {u.role}
                      {u.role === 'admin' && (
                        <span className="ml-2 inline-block text-xs bg-blue-600 px-2 py-0.5 rounded">ADMIN</span>
                      )}
                    </td>
                    <td className="p-4">
                      {u.approved ? (
                        <span className="text-green-400 text-sm">● Aprobado</span>
                      ) : (
                        <span className="text-yellow-400 text-sm">● Pendiente</span>
                      )}
                    </td>
                    <td className="p-4 flex gap-2">
                      {!u.approved && (
                        <button
                          onClick={() => handleApprove(u.id)}
                          disabled={!!actionLoading[u.id]}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm disabled:opacity-50"
                        >
                          {actionLoading[u.id] ? '...' : 'Aprobar'}
                        </button>
                      )}

                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={!!actionLoading[u.id]}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm disabled:opacity-50"
                        >
                          {actionLoading[u.id] ? '...' : 'Eliminar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && users.length === 0 && (
            <p className="p-8 text-center text-gray-400">No hay usuarios registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}