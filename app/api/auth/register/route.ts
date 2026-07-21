// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server-side Supabase client not configured' }, { status: 500 });
    }

    const body = await req.json();
    const name = (body.name || '').toString();
    const email = (body.email || '').toString().toLowerCase().trim();
    const password = (body.password || '').toString();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    // Verificar existencia
    const { data: existing, error: existingErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!existingErr && existing) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
    }

    // ¿Primer usuario? (contar filas)
    const { count } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true });

    const isFirst = typeof count === 'number' ? count === 0 : false;

    const password_hash = await bcrypt.hash(password, 12);

    const { error: insertErr } = await supabaseAdmin.from('users').insert({
      email,
      password_hash,
      name,
      role: isFirst ? 'admin' : 'user',
      approved: isFirst ? true : false,
    });

    if (insertErr) {
      console.error('register insertErr', insertErr);
      return NextResponse.json({ error: insertErr.message || 'Error creando usuario' }, { status: 500 });
    }

    return NextResponse.json({
      message: isFirst ? 'Admin creado y aprobado automáticamente' : 'Registro exitoso. Espera aprobación del administrador.',
    });
  } catch (err: any) {
    console.error('register error', err);
    return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 });
  }
}