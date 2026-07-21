'use client';

import { Newspaper, AlertCircle } from 'lucide-react';
import type { NoticiaData } from '@/lib/noticia-types';
import NewsCard from './news-card';
import { useState } from 'react';

interface NewsGridProps {
  noticias: NoticiaData[];
  total: number;
  totalGeneral: number;
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function NewsGrid({ noticias, total, totalGeneral, loading, onLoadMore, hasMore }: NewsGridProps) {
  return (
    <div>
      {/* Counter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-amber-300" />
          <h3 className="font-display font-semibold text-sm text-slate-100">Noticias</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-amber-300/10 text-amber-300 font-mono font-bold">
            {total ?? 0} filtradas
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-700/30 text-slate-200 font-mono">
            {totalGeneral ?? 0} total
          </span>
        </div>
      </div>

      {loading && (noticias ?? []).length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (noticias ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-300">
          <AlertCircle className="w-10 h-10 mb-3 opacity-60" />
          <p className="text-sm">No se encontraron noticias</p>
          <p className="text-xs mt-1 text-slate-400">Intenta ajustar los filtros o agregar noticias</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(noticias ?? []).map((n: NoticiaData, i: number) => (
              // SOLUCIÓN: Usamos un key que combina el id con el índice para garantizar unicidad
              <NewsCard key={`${n?.id ?? 'news'}-${i}`} noticia={n} index={i} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => onLoadMore?.()}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-amber-300/10 text-amber-300 border border-amber-300/20 text-sm font-medium transition-all disabled:opacity-50 hover:bg-amber-300/20"
              >
                {loading ? 'Cargando...' : 'Cargar más'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}