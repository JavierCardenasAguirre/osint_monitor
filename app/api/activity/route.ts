// app/api/activity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ logs: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('activity_logs')
      .select('id,user_id,action,details,created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('activity fetch error', error);
      return NextResponse.json({ logs: [] });
    }

    return NextResponse.json({ logs: data || [] });
  } catch (err) {
    console.error('activity exception', err);
    return NextResponse.json({ logs: [] }, { status: 500 });
  }
}