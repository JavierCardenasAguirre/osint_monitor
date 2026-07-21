// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server-side Supabase client not configured' }, { status: 500 });
    }

    const { email: rawEmail, password } = await req.json();
    const email = (rawEmail || '').toString().toLowerCase().trim();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id,email,name,role,approved,password_hash,created_at')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.error('[LOGIN] lookup error:', error);
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    if (!user.approved) {
      return NextResponse.json({ error: 'Tu cuenta aún no ha sido aprobada por el administrador' }, { status: 403 });
    }

    const { password_hash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}