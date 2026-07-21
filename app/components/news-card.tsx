'use client';

import { useState } from 'react';
import { ExternalLink, MapPin, Clock, Newspaper, Rss, Facebook, X, Eye } from 'lucide-react';
import { COLORES } from '@/lib/constants';
import type { NoticiaData } from '@/lib/noticia-types';
import { motion } from 'framer-motion';

interface NewsCardProps {
    noticia: NoticiaData;
    index: number;
}

function formatFecha(fecha: string | null): string {
    if (!fecha) return 'Sin fecha';
    let dateStr = fecha;
    if (dateStr.includes('T')) {
        dateStr = dateStr.split('T')[0];
    }
    const parts = dateStr.split('-');
    if (parts.length !== 3) return fecha;
    const [year, month, day] = parts;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    if (dateStr === todayStr) return 'Hoy';
    if (dateStr === yesterdayStr) return 'Ayer';
    return `${day}/${month}/${year}`;
}

function isFacebookUrl(url: string | null): boolean {
    if (!url) return false;
    return url.includes('facebook.com') || url.includes('fb.com') || url.startsWith('fb://');
}

export default function NewsCard({ noticia, index }: NewsCardProps) {
    const color = COLORES?.[noticia?.tipologia ?? ''] ?? '#6b7280';
    const [showDetail, setShowDetail] = useState(false);
    const isFb = isFacebookUrl(noticia?.url);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.5) }}
                className="bg-slate-700/60 rounded-xl border border-slate-600/40 overflow-hidden hover:shadow-lg transition-all group"
                style={{ boxShadow: '0 6px 18px rgba(2,6,23,0.45)' }}
            >
                {/* Tipología badge */}
                <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                    <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                        style={{ backgroundColor: color }}
                    >
                        {noticia?.tipologia ?? 'GENERAL'}
                    </span>
                    <span className="text-[10px] text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatFecha(noticia?.fecha_publicacion ?? null)}
                    </span>
                </div>

                {/* Content */}
                <div className="px-4 pb-3">
                    <h4 className="font-medium text-sm leading-snug line-clamp-2 mb-2 text-slate-100 group-hover:text-amber-300 transition-colors">
                        {noticia?.titulo ?? 'Sin título'}
                    </h4>

                    {noticia?.resumen && (
                        <p className="text-xs text-slate-300 line-clamp-2 mb-2">{noticia.resumen}</p>
                    )}

                    <div className="flex items-center gap-3 text-[10px] text-slate-300">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {noticia?.municipio ?? '?'}, {noticia?.departamento ?? '?'}
                        </span>
                        {noticia?.fuente && (
                            <span className="flex items-center gap-1">
                                {noticia?.source_type === 'facebook' ? (
                                    <Facebook className="w-3 h-3 text-[#1877F2]" />
                                ) : (
                                    <Rss className={`w-3 h-3 ${noticia.fuente.includes('El Tiempo')
                                            ? 'text-yellow-400'
                                            : 'text-rose-400'
                                        }`} />
                                )}
                                <span className="text-slate-300 text-[10px]">{noticia.fuente}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer link */}
                {noticia?.url && !isFb ? (
                    <a
                        href={noticia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 border-t border-slate-600/40 text-xs text-amber-300 hover:bg-amber-300/6 transition-colors"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Ver noticia completa
                    </a>
                ) : (
                    <button
                        onClick={() => setShowDetail(true)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-slate-600/40 text-xs text-amber-300 hover:bg-amber-300/6 transition-colors"
                    >
                        <Eye className="w-3 h-3" />
                        Ver detalle
                    </button>
                )}
            </motion.div>

            {/* Detail modal for Facebook posts or posts without external URL */}
            {showDetail && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setShowDetail(false)}
                >
                    <div
                        className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
                            <div className="flex items-center gap-2">
                                <span
                                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                                    style={{ backgroundColor: color }}
                                >
                                    {noticia?.tipologia ?? 'GENERAL'}
                                </span>
                                <span className="text-xs text-slate-300">
                                    {formatFecha(noticia?.fecha_publicacion ?? null)}
                                </span>
                            </div>
                            <button onClick={() => setShowDetail(false)} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                                <X className="w-4 h-4 text-slate-200" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-3">
                            <h3 className="font-display font-bold text-base leading-snug text-slate-100">
                                {noticia?.titulo}
                            </h3>

                            <div className="flex items-center gap-3 text-xs text-slate-300">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {noticia?.municipio ?? '?'}, {noticia?.departamento ?? '?'}
                                </span>
                                <span className="flex items-center gap-1">
                                    {noticia?.source_type === 'facebook' ? (
                                        <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                                    ) : (
                                        <Rss className="w-3.5 h-3.5 text-orange-400" />
                                    )}
                                    {noticia?.fuente}
                                </span>
                            </div>

                            {noticia?.texto_completo ? (
                                <p className="text-sm leading-relaxed text-slate-200/90 whitespace-pre-wrap">
                                    {noticia.texto_completo}
                                </p>
                            ) : noticia?.resumen ? (
                                <p className="text-sm leading-relaxed text-slate-200/90 whitespace-pre-wrap">
                                    {noticia.resumen}
                                </p>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No hay contenido adicional disponible.</p>
                            )}

                            {isFb && noticia?.url && noticia.url.startsWith('http') && (
                                <div className="pt-2 border-t border-slate-700/40">
                                    <p className="text-[10px] text-slate-400 mb-1.5">
                                        El enlace directo a Facebook puede no funcionar desde algunos navegadores.
                                    </p>
                                    <a
                                        href={noticia.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-[#1877F2] hover:underline"
                                    >
                                        <Facebook className="w-3 h-3" />
                                        Intentar abrir en Facebook
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}