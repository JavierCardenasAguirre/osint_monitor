export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLE } from '@/lib/supabase';
import { clasificarTipologia, coordenadasMunicipios, normalizarMunicipio } from '@/lib/constants';

const FB_GROUPS = [
    { value: 'ORGANIS', label: 'ORGANIS', depto: 'Cordoba' },
    { value: 'RADAR CARIBE', label: ' CARIBE', depto: 'Cordoba' },
    { value: 'JA-NOTICIAS', label: 'JA-NOTICIAS', depto: 'Cordoba' },
    { value: 'GQ-NOTICIAS', label: 'GQ-NOTICIAS', depto: 'Cordoba' },
    { value: 'NOTICIASRCN', label: 'Noticias RCN', depto: 'Bogota' },
];

const MUNICIPIOS_MAP: Record<string, { nombre: string; depto: string }> = {};
for (const [name, data] of Object.entries(coordenadasMunicipios)) {
    const norm = normalizarMunicipio(name);
    if (!MUNICIPIOS_MAP[norm]) {
        MUNICIPIOS_MAP[norm] = { nombre: name, depto: data.d };
    }
}

function detectarMunicipio(texto: string, defaultDepto: string): { municipio: string; departamento: string } {
    const upper = (texto ?? '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const sortedNames = Object.keys(MUNICIPIOS_MAP).sort((a, b) => b.length - a.length);
    for (const norm of sortedNames) {
        if (norm.length < 4) continue;
        if (upper.includes(norm)) {
            return { municipio: MUNICIPIOS_MAP[norm].nombre, departamento: MUNICIPIOS_MAP[norm].depto };
        }
    }
    return { municipio: '', departamento: defaultDepto };
}

/**
 * POST /api/facebook/fetch
 * Manual import of Facebook posts.
 * Body: { posts: Array<{ text: string; group: string; url?: string }> }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const posts: Array<{ text: string; group: string; url?: string }> = body?.posts ?? [];

        if (!posts.length) {
            return NextResponse.json({
                success: false,
                error: 'No se enviaron publicaciones.',
                nuevas: 0,
                duplicadas: 0,
            });
        }

        let totalNew = 0;
        let totalSkipped = 0;

        for (const post of posts) {
            if (!post.text || post.text.trim().length < 10) continue;

            const texto = post.text.trim();
            const titulo = texto.substring(0, 150).trim() + (texto.length > 150 ? '...' : '');
            const url = post.url || null;

            const groupConfig = FB_GROUPS.find(g =>
                g.value.toLowerCase() === (post.group ?? '').toLowerCase()
            ) ?? FB_GROUPS[0];

            // Check duplicate
            const titleSearch = titulo.substring(0, 60);
            const { data: existing } = await supabase
                .from(TABLE)
                .select('id')
                .ilike('titulo', `%${titleSearch}%`)
                .eq('fuente', `FB: ${groupConfig.value}`)
                .limit(1);

            if (existing && existing.length > 0) {
                totalSkipped++;
                continue;
            }

            const { municipio, departamento } = detectarMunicipio(texto, groupConfig.depto);
            const tipologia = clasificarTipologia(texto) || 'GENERAL';
            const categoria = tipologia === 'HOMICIDIOS' || tipologia === 'ORDEN PÚBLICO' || tipologia === 'NARCOTRÁFICO' ? 'SEGURIDAD' : tipologia === 'SISTEMA JUDICIAL' ? 'JUSTICIA' : 'GENERAL';

            const { error } = await supabase
                .from(TABLE)
                .insert({
                    titulo,
                    url,
                    fuente: `FB: ${groupConfig.value}`,
                    departamento,
                    municipio: municipio ? municipio.toUpperCase() : null,
                    tipologia,
                    categoria,
                    resumen: texto.substring(0, 500) || null,
                    texto_completo: texto || null,
                    fecha_publicacion: new Date().toISOString().split('T')[0],
                    criticidad: 1,
                });

            if (error) {
                console.error('[FB Import] Insert error:', error.message);
                continue;
            }
            totalNew++;
        }

        const { count: totalNoticias } = await supabase
            .from(TABLE)
            .select('id', { count: 'exact', head: true })
            .neq('titulo', 'TEST_DELETE_ME');

        return NextResponse.json({
            success: true,
            nuevas: totalNew,
            duplicadas: totalSkipped,
            totalEnBD: totalNoticias ?? 0,
        });
    } catch (error: any) {
        console.error('[FB Import] Error:', error);
        return NextResponse.json({ error: error?.message ?? 'Error interno' }, { status: 500 });
    }
}
