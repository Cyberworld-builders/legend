import { NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { validateAutomationApiKey } from '@/lib/automation-auth';
import { pipelineEventCreateSchema } from '@/types/transcripts';

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

  const parsed = pipelineEventCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('pipeline_events')
      .insert({
        transcript_id: parsed.data.transcript_id,
        event_type: parsed.data.event_type,
        step_name: parsed.data.step_name ?? null,
        status: parsed.data.status,
        event_data: parsed.data.event_data ?? {},
        triggered_by: parsed.data.triggered_by,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
