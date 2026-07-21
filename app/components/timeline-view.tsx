'use client';

import { Clock, TrendingUp } from 'lucide-react';
import { COLORES } from '@/lib/constants';
import { motion } from 'framer-motion';

interface TimelineViewProps {
  timeline: Record<string, Record<string, number>>;
}

function formatDayLabel(dateStr: string): string {
  if (!dateStr) return '';
  const today = new Date();
  const todayStr = today?.toISOString?.()?.split?.('T')?.[0] ?? '';
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday?.toISOString?.()?.split?.('T')?.[0] ?? '';

  if (dateStr === todayStr) return 'Hoy';
  if (dateStr === yesterdayStr) return 'Ayer';

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const d = new Date(dateStr + 'T12:00:00');
  const dayName = days[d?.getDay?.() ?? 0] ?? '';
  const parts = dateStr?.split?.('-') ?? [];
  return `${dayName} ${parts?.[2] ?? ''}/${parts?.[1] ?? ''}`;
}

export default function TimelineView({ timeline }: TimelineViewProps) {
  const days = Object.keys(timeline ?? {}).sort().reverse();

  return (
    <div className="bg-slate-700/60 rounded-xl border border-slate-600/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-600/30 flex items-center gap-2">
        <Clock className="w-4 h-4 text-amber-300" />
        <h3 className="font-display font-semibold text-sm text-slate-100">Últimos 7 Días</h3>
      </div>

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {(days ?? []).length === 0 ? (
          <div className="text-center text-slate-300 text-sm py-8">
            Sin actividad reciente
          </div>
        ) : (
          (days ?? []).map((day: string, idx: number) => {
            const tipos = timeline?.[day] ?? {};
            const totalDay = Object.values(tipos ?? {}).reduce((a: number, b: number) => a + (b ?? 0), 0);
            const sorted = Object.entries(tipos ?? {}).sort((a: any, b: any) => (b?.[1] ?? 0) - (a?.[1] ?? 0));

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: idx * 0.045 }}
                className="flex gap-3"
              >
                {/* Day indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${totalDay > 0 ? 'bg-amber-300' : 'bg-slate-500'}`} />
                  {idx < (days ?? []).length - 1 && (
                    <div className="w-px flex-1 bg-slate-600/40 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-100">{formatDayLabel(day)}</span>
                    <span className="text-xs font-mono text-slate-300 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-slate-300" />
                      {totalDay}
                    </span>
                  </div>
                  {totalDay > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(sorted ?? []).slice(0, 5).map(([tipo, count]: any) => (
                        <span
                          key={tipo}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                          style={{ backgroundColor: COLORES?.[tipo] ?? '#6b7280' }}
                        >
                          {tipo}: {count}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Sin actividad</span>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}