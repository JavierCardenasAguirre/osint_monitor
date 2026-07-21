import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server-side Supabase client not configured' }, { status: 500 });
    }

    const callerId = req.headers.get('x-user-id');

    if (callerId) {
      const { data: caller, error: callerErr } = await supabaseAdmin
        .from('users')
        .select('id,role')
        .eq('id', callerId)
        .single();

      if (callerErr || !caller || caller.role !== 'admin') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
      }
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id,email,name,role,approved,created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('admin/users error', error);
      return NextResponse.json({ error: 'Error obteniendo usuarios' }, { status: 500 });
    }

    return NextResponse.json({ users: data || [] });
  } catch (err: any) {
    console.error('admin/users exception', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server-side Supabase client not configured' }, { status: 500 });
    }

    const callerId = req.headers.get('x-user-id');
    const body = await req.json();
    const { userId } = body;

    if (!callerId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { data: caller, error: callerErr } = await supabaseAdmin
      .from('users')
      .select('id,role')
      .eq('id', callerId)
      .single();

    if (callerErr || !caller || caller.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({ approved: true })
      .eq('id', userId);

    if (error) {
      console.error('admin/users PATCH error', error);
      return NextResponse.json({ error: 'No se pudo aprobar el usuario' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('admin/users PATCH exception', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server-side Supabase client not configured' }, { status: 500 });
    }

    const callerId = req.headers.get('x-user-id');
    const body = await req.json();
    const { userId } = body;

    if (!callerId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { data: caller, error: callerErr } = await supabaseAdmin
      .from('users')
      .select('id,role')
      .eq('id', callerId)
      .single();

    if (callerErr || !caller || caller.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('admin/users DELETE error', error);
      return NextResponse.json({ error: 'No se pudo eliminar el usuario' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('admin/users DELETE exception', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}