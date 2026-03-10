import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { validateAutomationApiKey } from '@/lib/automation-auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/automation/traffic — Push blog traffic data from GusClaw (GA4).
 *
 * Body: { action: "upsert_batch", rows: [{ slug, date, views, sessions, users, period? }] }
 *   or: { action: "get_traffic", slug?, days? }
 */
export async function POST(request: NextRequest) {
  const authError = validateAutomationApiKey(request);
  if (authError) return authError;

  const supabase = createServerClient();

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'upsert_batch') {
      const { rows } = body;
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ error: 'rows array required' }, { status: 400 });
      }

      const records = rows.map((r: { slug: string; date: string; views: number; sessions: number; users: number; period?: string }) => ({
        slug: r.slug,
        date: r.date,
        views: r.views || 0,
        sessions: r.sessions || 0,
        users: r.users || 0,
        period: r.period || 'daily',
      }));

      const { error } = await supabase
        .from('blog_traffic')
        .upsert(records, { onConflict: 'slug,period,date', ignoreDuplicates: false });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, count: records.length });
    }

    if (action === 'get_traffic') {
      const { slug, days } = body;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - (days || 90));

      let query = supabase
        .from('blog_traffic')
        .select('*')
        .gte('date', cutoffDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (slug) query = query.eq('slug', slug);

      const { data, error } = await query;
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, rows: data ?? [] });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });

  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
