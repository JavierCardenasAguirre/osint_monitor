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
  Legend,
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
      fill: COLORES?.[t] ?? '#6b7280',
    };
  }).filter((d: any) => (d?.count ?? 0) > 0);

  const sortedData = [...(chartData ?? [])].sort((a: any, b: any) => (b?.count ?? 0) - (a?.count ?? 0)).slice(0, 10);

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden" style={{ boxShadow: 'var(--shadow-md)' }}>
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
        <RadarIcon className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">Radar de Tipologías</h3>
      </div>
      <div className="p-2 h-[350px]">
        {(sortedData ?? []).length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Sin datos para mostrar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={sortedData} cx="50%" cy="50%" outerRadius="65%">
              <PolarGrid stroke="#ff0000" />
              <PolarAngleAxis
                dataKey="tipologia"
                tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
              />
              <PolarRadiusAxis
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <Radar
                name="Noticias"
                dataKey="count"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
