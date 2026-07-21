'use client';

import { Radar as RadarIcon } from 'lucide-react';
import { COLORES, TIPOLOGIAS } from '@/lib/constants';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface TipologiaCount {
  tipologia: string;
  count: number;
}

interface RadarChartViewProps {
  data: TipologiaCount[];
}

export default function RadarChartView({ data }: RadarChartViewProps) {
  const chartData = (TIPOLOGIAS ?? []).map((t: string) => {
    const found = (data ?? []).find((d: TipologiaCount) => d?.tipologia === t);
    return {
      tipologia: t?.replace?.('/', '/\n') ?? t,
      fullName: t,
      count: found?.count ?? 0,
    };
  }).filter((d: any) => (d?.count ?? 0) > 0);

  const sortedData = [...(chartData ?? [])].sort((a: any, b: any) => (b?.count ?? 0) - (a?.count ?? 0)).slice(0, 10);

  return (
    <div className="bg-slate-700/60 rounded-xl border border-slate-600/30 overflow-hidden shadow-lg">
      <div className="px-4 py-3 border-b border-slate-600/30 flex items-center gap-2">
        <RadarIcon className="w-4 h-4 text-amber-300" />
        <h3 className="font-display font-semibold text-sm text-slate-100">Radar de Tipologías</h3>
      </div>

      <div className="p-2 h-[400px]">
        {(sortedData ?? []).length === 0 ? (
          <div className="flex items-center justify-center h-full text-red-400 text-sm italic">
            Sin datos para mostrar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={sortedData} cx="50%" cy="50%" outerRadius="75%">
              {/* PolarGrid: Ahora con un color más claro y visible */}
              <PolarGrid stroke="#eb610c" strokeOpacity={4} />

              <PolarAngleAxis
                dataKey="tipologia"
                tick={{ fontSize: 10, fill: '#e2e8f0', fontWeight: 500 }}
                tickLine={false}
              />
              
              {/* PolarRadiusAxis: Ocultamos los números centrales para que no se amontonen */}
              <PolarRadiusAxis
                tick={false}
                axisLine={false}
              />

              <Radar
                name="Noticias"
                dataKey="count"
                stroke="#fbbf24"
                fill="#fbbf24"
                fillOpacity={0.3}
                strokeWidth={2}
              />

              <Tooltip
                wrapperStyle={{ outline: 'none' }}
                contentStyle={{
                  fontSize: 12,
                  backgroundColor: '#1e293b', // slate-800
                  border: '1px solid #475569', // slate-600
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
                itemStyle={{ color: '#fbbf24' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}