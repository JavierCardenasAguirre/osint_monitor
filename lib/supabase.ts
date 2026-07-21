// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_KEY not configured');
}
if (typeof window === 'undefined' && !serviceRoleKey) {
  // Solo advertencia en el servidor si falta la service role key
  console.warn('[Supabase] SUPABASE_SERVICE_ROLE_KEY not configured for server-side admin client');
}

// Cliente público para el navegador (anónimo)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente privado para uso en server-side (APIs, route handlers).
// NOTA: en el cliente (navegador) esto será `null` para evitar que la key sea incluida en el bundle.
export const supabaseAdmin: SupabaseClient | null =
  typeof window === 'undefined' && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

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