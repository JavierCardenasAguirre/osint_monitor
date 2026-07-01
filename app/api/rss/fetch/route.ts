export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLE } from '@/lib/supabase';
import { clasificarTipologia, coordenadasMunicipios, normalizarMunicipio } from '@/lib/constants';
import Parser from 'rss-parser';

const RSS_FEEDS = [
  { url: 'https://larazon.co/feed/', fuente: 'La Razón', depto: 'Cordoba' },
  { url: 'https://www.lalenguacaribe.co/feed/', fuente: 'La Lengua Caribe', depto: 'Cordoba' },
  { url: 'https://www.chicanoticias.com/feed/', fuente: 'Chica Noticias', depto: 'Cordoba' },
  { url: 'https://www.elcolombiano.com/rss', fuente: 'El Colombiano', depto: 'Antioquia' },
  { url: 'https://h13n.com/feed/', fuente: 'H13N', depto: 'Cordoba' },
  { url: 'https://www.eltiempo.com/rss/justicia.xml', fuente: 'El Tiempo - Justicia', depto: 'Bogota' },
  { url: 'https://www.eltiempo.com/rss/justicia_conflicto-y-narcotrafico.xml', fuente: 'El Tiempo - Conflicto y Narcotráfico', depto: 'Bogota' },
  { url: 'https://www.eltiempo.com/rss/justicia_delitos.xml', fuente: 'El Tiempo - Delitos', depto: 'Bogota' },
  { url: 'https://www.eltiempo.com/rss/economia_sector-financiero.xml', fuente: 'El Tiempo - Sector Financiero', depto: 'Bogota' },
  { url: 'https://www.eltiempo.com/rss/tecnosfera_novedades-tecnologia.xml', fuente: 'El Tiempo - Tecnología', depto: 'Bogota' },
  { url: 'https://www.eltiempo.com/rss/mundo_latinoamerica.xml', fuente: 'El Tiempo - Latinoamérica', depto: 'Bogota' },
  { url: 'https://www.eltiempo.com/rss/politica_gobierno.xml', fuente: 'El Tiempo - Gobierno', depto: 'Bogota' },
  { url: 'https://news.google.com/rss/search?q=RCN+Radio+Colombia&hl=es&gl=CO&ceid=CO:es', fuente: 'Google News - RCN', depto: 'Bogota' }
];


const MUNICIPIOS_MAP: Record<string, { nombre: string; depto: string }> = {};
for (const [name, data] of Object.entries(coordenadasMunicipios)) {
  const norm = normalizarMunicipio(name);
  if (!MUNICIPIOS_MAP[norm]) {
    MUNICIPIOS_MAP[norm] = { nombre: name, depto: data.d };
  }
}

function stripHtml(html: string): string {
  return (html ?? '').replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
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

/*async function parseFeed(feedUrl: string): Promise<any> {
  try {
    const parser = new Parser({ timeout: 15000 });
    return await parser.parseURL(feedUrl);
  } catch (err: any) {
    console.error(`RSS parse error for ${feedUrl}:`, err?.message);
    return null;
  }
}*/

async function parseFeed(feedUrl: string): Promise<any> {
  try {
    const parser = new Parser({
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    return await parser.parseURL(feedUrl);
  } catch (err: any) {
    console.error(`RSS parse error for ${feedUrl}:`, err?.message);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    let totalNew = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        const parsed = await parseFeed(feed.url);
        if (!parsed?.items?.length) continue;

        for (const item of parsed.items.slice(0, 60)) {
          const titulo = (item.title ?? '').trim();
          const itemUrl = (item.link ?? '').trim();

          if (!titulo || titulo.length < 10) continue;

          // Check duplicate by URL
          if (itemUrl) {
            const { data: existing } = await supabase
              .from(TABLE)
              .select('id')
              .eq('url', itemUrl)
              .limit(1);

            if (existing && existing.length > 0) {
              totalSkipped++;
              continue;
            }
          }

          const description = stripHtml(item.contentSnippet ?? item.content ?? item.description ?? '');
          const resumen = description.substring(0, 500);
          const textoCompleto = description;
          const textoDeteccion = `${titulo} ${description}`.substring(0, 2000);

          const { municipio, departamento } = detectarMunicipio(textoDeteccion, feed.depto);
          const tipologia = clasificarTipologia(textoDeteccion) || 'GENERAL';

          let fechaPub: string | null = null;
          if (item.pubDate || item.isoDate) {
            try {
              fechaPub = new Date(item.isoDate ?? item.pubDate).toISOString().split('T')[0];
            } catch (_) {
              fechaPub = new Date().toISOString().split('T')[0];
            }
          } else {
            fechaPub = new Date().toISOString().split('T')[0];
          }

          const categoria = tipologia === 'HOMICIDIOS' || tipologia === 'ORDEN PÚBLICO' || tipologia === 'NARCOTRÁFICO' ? 'SEGURIDAD' : tipologia === 'SISTEMA JUDICIAL' ? 'JUSTICIA' : 'GENERAL';

          const { error: insertError } = await supabase
            .from(TABLE)
            .insert({
              titulo,
              url: itemUrl || null,
              fuente: feed.fuente,
              departamento,
              municipio: municipio ? municipio.toUpperCase() : null,
              tipologia,
              categoria,
              resumen: resumen || null,
              texto_completo: textoCompleto || null,
              fecha_publicacion: fechaPub,
              criticidad: 1,
            });

          if (insertError) {
            console.error(`RSS insert error:`, insertError.message);
            continue;
          }
          totalNew++;
        }
      } catch (feedErr: any) {
        const errMsg = `${feed.fuente}: ${feedErr?.message}`;
        console.error('RSS feed error:', errMsg);
        errors.push(errMsg);
      }
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
      errores: errors,
    });
  } catch (error: any) {
    console.error('RSS fetch error:', error);
    return NextResponse.json({ error: error?.message ?? 'Error interno' }, { status: 500 });
  }
}
