import { NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { validateAutomationApiKey } from '@/lib/automation-auth';

const STUCK_TIMEOUT_MINUTES = 30;
const MAX_RETRIES = 3;

export async function GET(request: Request) {
  const authError = validateAutomationApiKey(request);
  if (authError) return authError;

  if (!isServerSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
  }

  try {
    const supabase = createServerClient();

    // Auto-recover stuck transcripts before querying
    await recoverStuckTranscripts(supabase);

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

async function recoverStuckTranscripts(supabase: ReturnType<typeof createServerClient>) {
  const cutoff = new Date(Date.now() - STUCK_TIMEOUT_MINUTES * 60 * 1000).toISOString();

  // Find transcripts stuck in 'claimed' past the timeout
  // Use claimed_at if available, fall back to updated_at for pre-migration rows
  const { data: stuckRows } = await supabase
    .from('transcripts')
    .select('id, retry_count, claimed_at, updated_at')
    .eq('status', 'claimed')
    .eq('is_processed', false);

  if (!stuckRows || stuckRows.length === 0) return;

  for (const row of stuckRows) {
    const stuckSince = row.claimed_at || row.updated_at;
    if (stuckSince > cutoff) continue; // Not timed out yet

    const retryCount = row.retry_count ?? 0;

    if (retryCount < MAX_RETRIES) {
      // Reset to pending for retry
      await supabase
        .from('transcripts')
        .update({
          status: 'pending',
          claimed_at: null,
          error_message: null,
          error_at: null,
          retry_count: retryCount + 1,
        })
        .eq('id', row.id);

      await supabase.from('pipeline_events').insert({
        transcript_id: row.id,
        event_type: 'auto_timeout',
        step_name: 'Auto-recovery',
        status: 'completed',
        event_data: {
          retry_count: retryCount + 1,
          stuck_since: stuckSince,
          timeout_minutes: STUCK_TIMEOUT_MINUTES,
        },
        triggered_by: 'system',
      });
    } else {
      // Max retries exceeded — mark as failed
      await supabase
        .from('transcripts')
        .update({
          status: 'failed',
          error_message: `Exceeded max retries (${MAX_RETRIES})`,
          error_at: new Date().toISOString(),
        })
        .eq('id', row.id);

      await supabase.from('pipeline_events').insert({
        transcript_id: row.id,
        event_type: 'failed',
        step_name: 'Auto-recovery',
        status: 'failed',
        event_data: {
          reason: `Exceeded max retries (${MAX_RETRIES})`,
          retry_count: retryCount,
          stuck_since: stuckSince,
        },
        triggered_by: 'system',
      });
    }
  }
}
