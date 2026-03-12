import { NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { validateAutomationApiKey } from '@/lib/automation-auth';

export async function GET(request: Request) {
  const authError = validateAutomationApiKey(request);
  if (authError) return authError;

  if (!isServerSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('transcripts')
      .select('*')
      .eq('is_processed', false)
      .or('status.is.null,status.eq.pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transcript: data ?? null }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
