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
          <Newspaper className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm">Noticias</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono font-bold">
            {total ?? 0} filtradas
          </span>
          <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-mono">
            {totalGeneral ?? 0} total
          </span>
        </div>
      </div>

      {loading && (noticias ?? []).length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (noticias ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
          <p className="text-sm">No se encontraron noticias</p>
          <p className="text-xs mt-1">Intenta ajustar los filtros o agregar noticias</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {(noticias ?? []).map((n: NoticiaData, i: number) => (
              <NewsCard key={n?.id ?? i} noticia={n} index={i} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => onLoadMore?.()}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-all disabled:opacity-50"
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
