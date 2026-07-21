'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus, Rss, Loader2, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import type { FiltrosState, NoticiaData } from '@/lib/noticia-types';
import Header from './header';
import Filtros from './filtros';
import NewsGrid from './news-grid';
import OsintMap from './osint-map';
import ChartView from './radar-chart';
import TimelineView from './timeline-view';
import AddNoticiaModal from './add-noticia-modal';
import FbImportModal from './fb-import-modal';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();

    const [filtros, setFiltros] = useState<FiltrosState>({
        departamento: '',
        municipio: '',
        tipologias: [],
        fechaInicio: '',
        fechaFin: '',
        busqueda: '',
    });

    const [noticias, setNoticias] = useState<NoticiaData[]>([]);
    const [total, setTotal] = useState(0);
    const [totalGeneral, setTotalGeneral] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const [tipologiaCounts, setTipologiaCounts] = useState<any[]>([]);
    const [timeline, setTimeline] = useState<Record<string, Record<string, number>>>({});

    const [showAddModal, setShowAddModal] = useState(false);
    const [showFbModal, setShowFbModal] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
        setIsAdmin(role === 'admin');
    }, []);

    const fetchNoticias = useCallback(async (pageNum: number, append: boolean) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtros?.departamento) params.set('departamento', filtros.departamento);
            if (filtros?.municipio) params.set('municipio', filtros.municipio);
            if ((filtros?.tipologias ?? []).length > 0) params.set('tipologias', (filtros?.tipologias ?? []).join(','));
            if (filtros?.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
            if (filtros?.fechaFin) params.set('fechaFin', filtros.fechaFin);
            if (filtros?.busqueda) params.set('busqueda', filtros.busqueda);
            params.set('page', String(pageNum));
            params.set('limit', '50');

            const res = await fetch(`/api/noticias?${params.toString()}`);
            const data = await res?.json?.().catch(() => ({}));

            if (append) {
                setNoticias((prev: NoticiaData[]) => [...(prev ?? []), ...(data?.noticias ?? [])]);
            } else {
                setNoticias(data?.noticias ?? []);
            }
            setTotal(data?.total ?? 0);
            setTotalGeneral(data?.totalGeneral ?? 0);
            setHasMore(((data?.noticias ?? []).length + (append ? (noticias ?? []).length : 0)) < (data?.total ?? 0));
        } catch (err: any) {
            console.error('Fetch noticias error:', err);
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    const fetchStats = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filtros?.departamento) params.set('departamento', filtros.departamento);
            if (filtros?.municipio) params.set('municipio', filtros.municipio);
            if ((filtros?.tipologias ?? []).length > 0) params.set('tipologias', (filtros?.tipologias ?? []).join(','));
            if (filtros?.fechaInicio) params.set('fechaInicio', filtros.fechaInicio);
            if (filtros?.fechaFin) params.set('fechaFin', filtros.fechaFin);
            if (filtros?.busqueda) params.set('busqueda', filtros.busqueda);

            const res = await fetch(`/api/noticias/stats?${params.toString()}`);
            const data = await res?.json?.().catch(() => ({}));
            setTipologiaCounts(data?.tipologiaCounts ?? []);
            setTimeline(data?.timeline ?? {});
        } catch (err: any) {
            console.error('Fetch stats error:', err);
        }
    }, [filtros]);

    const refresh = useCallback(() => {
        setPage(1);
        fetchNoticias(1, false);
        fetchStats();
    }, [fetchNoticias, fetchStats]);

    const syncRSS = useCallback(async () => {
        setSyncing(true);
        try {
            const res = await fetch('/api/rss/fetch', { method: 'POST' });
            const data = await res?.json?.().catch(() => ({}));
            if (data?.success) {
                toast.success(`RSS: ${data.nuevas} noticias nuevas, ${data.duplicadas} duplicadas`);
                if (data.nuevas > 0) refresh();
            } else {
                toast.error(data?.error ?? 'Error al sincronizar feeds RSS');
            }
        } catch (err: any) {
            toast.error('Error de conexión al sincronizar RSS');
        } finally {
            setSyncing(false);
        }
    }, [refresh]);

    const loadMore = useCallback(() => {
        const next = (page ?? 1) + 1;
        setPage(next);
        fetchNoticias(next, true);
    }, [page, fetchNoticias]);

    // Fetch on filtros change
    useEffect(() => {
        setPage(1);
        fetchNoticias(1, false);
        fetchStats();
    }, [filtros]);

    // Auto-sync RSS on first load if DB is empty
    const [autoSynced, setAutoSynced] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined' && !autoSynced && totalGeneral === 0 && !loading && !syncing) {
            const t = setTimeout(() => {
                setAutoSynced(true);
                syncRSS();
            }, 2000);
            return () => clearTimeout(t);
        }
    }, [totalGeneral, loading, syncing, autoSynced, syncRSS]);

    return (
        <div className="min-h-screen bg-slate-800 text-slate-100 antialiased">
            <Header />

            <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-50">
                            Panel de <span className="text-amber-300">Monitoreo Noticias</span>
                        </h1>
                        <div className="flex flex-col mt-0.5">
                            <p className="text-sm text-slate-300">
                                Inteligencia de fuentes abiertas
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono mt-1">
                                Autor: <span className="text-slate-400">Ing Javier Cárdenas</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={syncRSS}
                            disabled={syncing}
                            className="px-3 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 disabled:opacity-60"
                        >
                            {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rss className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{syncing ? 'Sincronizando...' : 'Sincronizar RSS'}</span>
                        </button>

                        <button
                            onClick={() => setShowFbModal(true)}
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition-all flex items-center gap-1.5"
                            title="Importar publicaciones de Facebook"
                        >
                            <Facebook className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Facebook</span>
                        </button>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-3 py-2 rounded-lg bg-slate-700/80 text-white font-medium text-xs hover:bg-slate-700 transition-all flex items-center gap-1.5"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Agregar</span>
                        </button>

                        {isAdmin && (
                            <button
                                onClick={() => router.push('/admin')}
                                className="px-3 py-2 rounded-lg bg-sky-600 text-white font-medium text-xs hover:bg-sky-500 transition-all"
                            >
                                Admin
                            </button>
                        )}

                        <button
                            onClick={() => {
                                localStorage.removeItem('user_id');
                                localStorage.removeItem('user_role');
                                window.location.href = '/login';
                            }}
                            className="px-3 py-2 rounded-lg bg-rose-600 text-white font-medium text-xs hover:bg-rose-500 transition-all"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>

                {/* Main layout: sidebar + content */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                    {/* Sidebar */}
                    <aside className="space-y-4">
                        <div className="rounded-2xl bg-slate-700/60 border border-slate-600/40 p-4">
                            <h3 className="text-sm font-semibold text-slate-200 mb-3">Filtros</h3>
                            <Filtros
                                filtros={filtros}
                                onFiltrosChange={setFiltros}
                                onRefresh={refresh}
                                loading={loading}
                            />
                        </div>

                        <div className="rounded-2xl bg-slate-700/60 border border-slate-600/30 p-4">
                            <h3 className="text-sm font-semibold text-slate-200 mb-3">Distribución</h3>
                            <ChartView data={tipologiaCounts} />
                        </div>

                        <div className="rounded-2xl bg-slate-700/60 border border-slate-600/30 p-4">
                            <h3 className="text-sm font-semibold text-slate-200 mb-3">Cronología</h3>
                            <TimelineView timeline={timeline} />
                        </div>
                    </aside>

                    {/* Content */}
                    <section className="space-y-6">
                        <div className="rounded-2xl overflow-hidden border border-slate-600/30 shadow-sm bg-slate-700/50">
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-slate-200 mb-2">Mapa</h3>
                                <div className="h-[420px] rounded-md overflow-hidden">
                                    {/* Envuelve el mapa en un panel con padding si el mapa ya tiene su propio estilo */}
                                    <OsintMap noticias={noticias} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-600/30 bg-slate-700/50 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-100">Noticias</h3>
                                    <p className="text-xs text-slate-300">Mostrando {total} resultados (General: {totalGeneral})</p>
                                </div>
                                <div className="text-xs text-slate-300">Página {page}</div>
                            </div>

                            <NewsGrid
                                noticias={noticias}
                                total={total}
                                totalGeneral={totalGeneral}
                                loading={loading}
                                onLoadMore={loadMore}
                                hasMore={hasMore}
                            />
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-700/30 mt-12">
                <div className="max-w-[1200px] mx-auto px-4 py-6 flex items-center justify-between text-xs text-slate-300">
                    <span>OSINT Monitor &copy; 2026</span>
                    <span>Córdoba &bull; Antioquia &bull; Colombia</span>
                </div>
            </footer>

            <AddNoticiaModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={refresh}
            />
            <FbImportModal
                open={showFbModal}
                onClose={() => setShowFbModal(false)}
                onSuccess={refresh}
            />
        </div>
    );
}