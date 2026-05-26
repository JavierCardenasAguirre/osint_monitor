export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLE, getSourceType } from '@/lib/supabase';
import { clasificarTipologia, normalizarMunicipio, coordenadasMunicipios } from '@/lib/constants';
import type { NoticiaData } from '@/lib/noticia-types';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const departamento = params.get('departamento') ?? '';
    const municipio = params.get('municipio') ?? '';
    const tipologias = params.get('tipologias') ?? '';
    const fechaInicio = params.get('fechaInicio') ?? '';
    const fechaFin = params.get('fechaFin') ?? '';
    const busqueda = params.get('busqueda') ?? '';
    const page = parseInt(params.get('page') ?? '1', 10);
    const limit = Math.min(parseInt(params.get('limit') ?? '50', 10), 100);
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from(TABLE)
      .select('*', { count: 'exact' })
      .neq('titulo', 'TEST_DELETE_ME')
      .order('fecha_publicacion', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (departamento) {
      query = query.ilike('departamento', departamento);
    }
    if (municipio) {
      query = query.ilike('municipio', municipio);
    }
    if (tipologias) {
      const tipoArr = tipologias.split(',').map(t => t.trim()).filter(Boolean);
      if (tipoArr.length > 0) {
        query = query.in('tipologia', tipoArr);
      }
    }
    if (fechaInicio) {
      query = query.gte('fecha_publicacion', fechaInicio);
    }
    if (fechaFin) {
      const endDate = new Date(fechaFin);
      endDate.setDate(endDate.getDate() + 1);
      query = query.lt('fecha_publicacion', endDate.toISOString().split('T')[0]);
    }
    if (busqueda) {
      query = query.or(`titulo.ilike.%${busqueda}%,resumen.ilike.%${busqueda}%,texto_completo.ilike.%${busqueda}%`);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('[Noticias GET] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get total general (unfiltered)
    const { count: totalGeneral } = await supabase
      .from(TABLE)
      .select('id', { count: 'exact', head: true })
      .neq('titulo', 'TEST_DELETE_ME');

    const noticias: NoticiaData[] = (data ?? []).map((row: any) => ({
      id: row.id,
      created_at: row.created_at,
      titulo: row.titulo,
      url: row.url,
      fuente: row.fuente,
      timestamp_original: row.timestamp_original,
      departamento: row.departamento,
      municipio: row.municipio,
      tipologia: row.tipologia,
      resumen: row.resumen,
      texto_completo: row.texto_completo,
      fecha_publicacion: row.fecha_publicacion,
      source_type: getSourceType(row.fuente),
      categoria: row.categoria,
      criticidad: row.criticidad,
      prospectiva: row.prospectiva,
    }));

    return NextResponse.json({
      noticias,
      total: count ?? 0,
      totalGeneral: totalGeneral ?? 0,
      page,
      limit,
    });
  } catch (error: any) {
    console.error('[Noticias GET] Error:', error);
    return NextResponse.json({ error: error?.message ?? 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, url, fuente, departamento, municipio, tipologia, resumen, texto_completo, fecha_publicacion } = body ?? {};

    if (!titulo || titulo.trim().length < 5) {
      return NextResponse.json({ error: 'Título requerido (mínimo 5 caracteres)' }, { status: 400 });
    }

    const textoCompleto = `${titulo} ${resumen ?? ''} ${texto_completo ?? ''}`;
    const autoTipo = clasificarTipologia(textoCompleto);
    const finalTipo = tipologia || autoTipo || 'GENERAL';

    let finalMunicipio = municipio ?? '';
    if (finalMunicipio) {
      finalMunicipio = finalMunicipio.toUpperCase().trim();
    }

    const insertData: any = {
      titulo: titulo.trim(),
      url: url || null,
      fuente: fuente || 'Manual',
      departamento: departamento || 'Cordoba',
      municipio: finalMunicipio || null,
      tipologia: finalTipo,
      categoria: finalTipo === 'HOMICIDIOS' || finalTipo === 'ORDEN PÚBLICO' || finalTipo === 'NARCOTRÁFICO' ? 'SEGURIDAD' : finalTipo === 'SISTEMA JUDICIAL' ? 'JUSTICIA' : 'GENERAL',
      resumen: resumen || titulo.substring(0, 500),
      texto_completo: texto_completo || null,
      fecha_publicacion: fecha_publicacion || new Date().toISOString().split('T')[0],
      criticidad: 1,
    };

    const { data, error } = await supabase
      .from(TABLE)
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[Noticias POST] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      noticia: {
        ...data,
        source_type: 'manual',
      },
    });
  } catch (error: any) {
    console.error('[Noticias POST] Error:', error);
    return NextResponse.json({ error: error?.message ?? 'Error interno' }, { status: 500 });
  }
}
