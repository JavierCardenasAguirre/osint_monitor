'use client';

import { useState, useCallback, useEffect } from 'react';
import { Filter, Search, RefreshCw, ChevronDown, X, Calendar } from 'lucide-react';
import { TIPOLOGIAS, COLORES, getMunicipiosPorDepto } from '@/lib/constants';
import type { FiltrosState } from '@/lib/noticia-types';

interface FiltrosProps {
  filtros: FiltrosState;
  onFiltrosChange: (f: FiltrosState) => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function Filtros({ filtros, onFiltrosChange, onRefresh, loading }: FiltrosProps) {
  const [showTipologias, setShowTipologias] = useState(false);
  const municipios = getMunicipiosPorDepto(filtros?.departamento ?? '');

  const update = useCallback((patch: Partial<FiltrosState>) => {
    onFiltrosChange?.({ ...(filtros ?? {} as FiltrosState), ...patch });
  }, [filtros, onFiltrosChange]);

  const toggleTipologia = useCallback((t: string) => {
    const current = filtros?.tipologias ?? [];
    if (current?.includes(t)) {
      update({ tipologias: current.filter((x: string) => x !== t) });
    } else {
      update({ tipologias: [...current, t] });
    }
  }, [filtros?.tipologias, update]);

  useEffect(() => {
    if (filtros?.departamento && filtros?.municipio) {
      const validMunis = getMunicipiosPorDepto(filtros.departamento);
      if (!validMunis?.includes(filtros.municipio)) {
        update({ municipio: '' });
      }
    }
  }, [filtros?.departamento]);

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 space-y-4" style={{ boxShadow: 'var(--shadow-md)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">Filtros</h3>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar noticias..."
          value={filtros?.busqueda ?? ''}
          onChange={(e: any) => update({ busqueda: e?.target?.value ?? '' })}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Departamento tabs */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        {['', 'Cordoba', 'Antioquia'].map((dep: string) => (
          <button
            key={dep}
            onClick={() => update({ departamento: dep, municipio: '' })}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              filtros?.departamento === dep
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {dep || 'Todos'}
          </button>
        ))}
      </div>

      {/* Municipio */}
      {filtros?.departamento && (
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Municipio</label>
          <select
            value={filtros?.municipio ?? ''}
            onChange={(e: any) => update({ municipio: e?.target?.value ?? '' })}
            className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
          >
            <option value="">Todos los municipios</option>
            {(municipios ?? []).map((m: string) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      )}

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Desde
          </label>
          <input
            type="date"
            value={filtros?.fechaInicio ?? ''}
            onChange={(e: any) => update({ fechaInicio: e?.target?.value ?? '' })}
            className="w-full py-2 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Hasta
          </label>
          <input
            type="date"
            value={filtros?.fechaFin ?? ''}
            onChange={(e: any) => update({ fechaFin: e?.target?.value ?? '' })}
            className="w-full py-2 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Tipologías */}
      <div>
        <button
          onClick={() => setShowTipologias(!showTipologias)}
          className="flex items-center justify-between w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Tipologías ({(filtros?.tipologias ?? []).length > 0 ? (filtros?.tipologias ?? []).length : 'Todas'})</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showTipologias ? 'rotate-180' : ''}`} />
        </button>
        {showTipologias && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(TIPOLOGIAS ?? []).map((t: string) => {
              const selected = (filtros?.tipologias ?? []).includes(t);
              const color = COLORES?.[t] ?? '#6b7280';
              return (
                <button
                  key={t}
                  onClick={() => toggleTipologia(t)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border ${
                    selected
                      ? 'text-white border-transparent'
                      : 'border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                  style={selected ? { backgroundColor: color, borderColor: color } : {}}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}
        {(filtros?.tipologias ?? []).length > 0 && (
          <button
            onClick={() => update({ tipologias: [] })}
            className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Limpiar tipologías
          </button>
        )}
      </div>

      {/* Refresh */}
      <button
        onClick={() => onRefresh?.()}
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        Refrescar
      </button>
    </div>
  );
}
