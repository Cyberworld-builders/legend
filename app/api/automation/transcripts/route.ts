import { NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { validateAutomationApiKey } from '@/lib/automation-auth';
import { transcriptCreateSchema } from '@/types/transcripts';

export async function POST(request: Request) {
  const authError = validateAutomationApiKey(request);
  if (authError) return authError;

  if (!isServerSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = transcriptCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const rawTitle = parsed.data.title?.trim();
  const title =
    rawTitle && rawTitle.length > 0
      ? rawTitle
      : 'NEW_' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('transcripts')
      .insert({
        title,
        transcript_text: parsed.data.transcript_text,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transcript: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
