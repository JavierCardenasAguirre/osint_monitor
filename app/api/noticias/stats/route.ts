export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLE } from '@/lib/supabase';
import { TIPOLOGIAS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const departamento = params.get('departamento') ?? '';
    const municipio = params.get('municipio') ?? '';
    const tipologias = params.get('tipologias') ?? '';
    const fechaInicio = params.get('fechaInicio') ?? '';
    const fechaFin = params.get('fechaFin') ?? '';
    const busqueda = params.get('busqueda') ?? '';

    // ── Tipología counts ──
    let countQuery = supabase
      .from(TABLE)
      .select('tipologia', { count: 'exact' })
      .neq('titulo', 'TEST_DELETE_ME');

    if (departamento) countQuery = countQuery.ilike('departamento', departamento);
    if (municipio) countQuery = countQuery.ilike('municipio', municipio);
    if (tipologias) {
      const tipoArr = tipologias.split(',').map(t => t.trim()).filter(Boolean);
      if (tipoArr.length > 0) countQuery = countQuery.in('tipologia', tipoArr);
    }
    if (fechaInicio) countQuery = countQuery.gte('fecha_publicacion', fechaInicio);
    if (fechaFin) {
      const endDate = new Date(fechaFin);
      endDate.setDate(endDate.getDate() + 1);
      countQuery = countQuery.lt('fecha_publicacion', endDate.toISOString().split('T')[0]);
    }
    if (busqueda) {
      countQuery = countQuery.or(`titulo.ilike.%${busqueda}%,resumen.ilike.%${busqueda}%`);
    }

    const { data: allRows, error: rowsError } = await countQuery;

    if (rowsError) {
      console.error('[Stats] Error fetching rows:', rowsError);
      return NextResponse.json({ error: rowsError.message }, { status: 500 });
    }

    // Count tipologías
    const tipoCounts: Record<string, number> = {};
    for (const row of allRows ?? []) {
      const t = row.tipologia ?? 'GENERAL';
      tipoCounts[t] = (tipoCounts[t] ?? 0) + 1;
    }

    const tipologiaCounts = Object.entries(tipoCounts)
      .map(([tipologia, count]) => ({ tipologia, count }))
      .sort((a, b) => b.count - a.count);

    // ── Timeline (last 7 days or filtered range) ──
    let timelineStart: Date;
    let timelineEnd: Date;

    if (fechaInicio) {
      timelineStart = new Date(fechaInicio);
    } else {
      timelineStart = new Date();
      timelineStart.setDate(timelineStart.getDate() - 6);
    }

    if (fechaFin) {
      timelineEnd = new Date(fechaFin);
    } else {
      timelineEnd = new Date();
    }

    // Cap at 30 days
    const daysDiff = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const cappedDays = Math.min(daysDiff + 1, 30);

    let timelineQuery = supabase
      .from(TABLE)
      .select('tipologia, fecha_publicacion')
      .neq('titulo', 'TEST_DELETE_ME')
      .gte('fecha_publicacion', timelineStart.toISOString().split('T')[0])
      .lte('fecha_publicacion', timelineEnd.toISOString().split('T')[0]);

    if (departamento) timelineQuery = timelineQuery.ilike('departamento', departamento);
    if (municipio) timelineQuery = timelineQuery.ilike('municipio', municipio);
    if (busqueda) {
      timelineQuery = timelineQuery.or(`titulo.ilike.%${busqueda}%,resumen.ilike.%${busqueda}%`);
    }

    const { data: timelineRows, error: tlError } = await timelineQuery;

    if (tlError) {
      console.error('[Stats] Timeline error:', tlError);
    }

    // Build timeline map
    const timeline: Record<string, Record<string, number>> = {};

    // Initialize all days
    for (let i = 0; i < cappedDays; i++) {
      const d = new Date(timelineStart);
      d.setDate(d.getDate() + i);
      const dateKey = d.toISOString().split('T')[0];
      timeline[dateKey] = {};
    }

    // Fill with data
    for (const row of timelineRows ?? []) {
      if (!row.fecha_publicacion) continue;
      const dateKey = String(row.fecha_publicacion).split('T')[0];
      if (!timeline[dateKey]) timeline[dateKey] = {};
      const tipo = row.tipologia ?? 'GENERAL';
      timeline[dateKey][tipo] = (timeline[dateKey][tipo] ?? 0) + 1;
    }

    return NextResponse.json({ tipologiaCounts, timeline });
  } catch (error: any) {
    console.error('[Stats] Error:', error);
    return NextResponse.json({ error: error?.message ?? 'Error interno' }, { status: 500 });
  }
}
