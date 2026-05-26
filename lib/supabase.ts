import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] SUPABASE_URL or SUPABASE_KEY not configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const TABLE = 'noticias_datacore';

/** Derive source_type from fuente field */
export function getSourceType(fuente: string | null): string {
  if (!fuente) return 'manual';
  if (fuente.startsWith('FB:')) return 'facebook';
  return 'rss';
}

export interface NoticiaRow {
  id: number;
  created_at: string;
  titulo: string;
  url: string | null;
  fuente: string | null;
  timestamp_original: string | null;
  departamento: string | null;
  municipio: string | null;
  tipologia: string | null;
  categoria: string | null;
  resumen: string | null;
  criticidad: number | null;
  prospectiva: string | null;
  texto_completo: string | null;
  fecha_publicacion: string | null;
}
