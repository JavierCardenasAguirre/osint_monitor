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

    // Parse the date - handle both "2026-05-26" and "2026-05-26T00:00:00+00:00" formats
    let dateStr = fecha;
    if (dateStr.includes('T')) {
        dateStr = dateStr.split('T')[0];
    }

    const parts = dateStr.split('-');
    if (parts.length !== 3) return fecha;

    const [year, month, day] = parts;

    // Check if today or yesterday
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
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                className="bg-card rounded-xl border border-border/50 overflow-hidden hover:border-border transition-all group"
                style={{ boxShadow: 'var(--shadow-sm)' }}
            >
                {/* Tipología badge */}
                <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                    <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                        style={{ backgroundColor: color }}
                    >
                        {noticia?.tipologia ?? 'GENERAL'}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatFecha(noticia?.fecha_publicacion ?? null)}
                    </span>
                </div>

                {/* Content */}
                <div className="px-4 pb-3">
                    <h4 className="font-medium text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {noticia?.titulo ?? 'Sin título'}
                    </h4>

                    {noticia?.resumen && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{noticia.resumen}</p>
                    )}

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
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
                                            ? 'text-yellow-200'  // 👈 Color para El Tiempo
                                            : 'text-orange-400'   // 👈 Color para otras fuentes RSS
                                        }`} />
                                )}
                                {noticia.fuente}
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
                        className="flex items-center justify-center gap-1.5 py-2 border-t border-border/50 text-xs text-primary hover:bg-primary/5 transition-colors"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Ver noticia completa
                    </a>
                ) : (
                    <button
                        onClick={() => setShowDetail(true)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-border/50 text-xs text-primary hover:bg-primary/5 transition-colors"
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
                        className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
                            <div className="flex items-center gap-2">
                                <span
                                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                                    style={{ backgroundColor: color }}
                                >
                                    {noticia?.tipologia ?? 'GENERAL'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatFecha(noticia?.fecha_publicacion ?? null)}
                                </span>
                            </div>
                            <button onClick={() => setShowDetail(false)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-3">
                            <h3 className="font-display font-bold text-base leading-snug">
                                {noticia?.titulo}
                            </h3>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                    {noticia.texto_completo}
                                </p>
                            ) : noticia?.resumen ? (
                                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                    {noticia.resumen}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No hay contenido adicional disponible.</p>
                            )}

                            {isFb && noticia?.url && noticia.url.startsWith('http') && (
                                <div className="pt-2 border-t border-border/50">
                                    <p className="text-[10px] text-muted-foreground mb-1.5">
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
