import { NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { validateAutomationApiKey } from '@/lib/automation-auth';

export async function GET(request: Request) {
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'next-unprocessed/route.ts:GET',message:'handler entry',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2-H5'})}).catch(()=>{});
  // #endregion
  const authError = validateAutomationApiKey(request);
  if (authError) {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'next-unprocessed/route.ts:authReturn',message:'returning authError',data:{status:authError.status},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    return authError;
  }

  const supabaseConfigured = isServerSupabaseConfigured();
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'next-unprocessed/route.ts:supabaseCheck',message:'after isServerSupabaseConfigured',data:{supabaseConfigured},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
  // #endregion
  if (!supabaseConfigured) {
    return NextResponse.json(
      { error: 'Supabase is not configured' },
      { status: 500 }
    );
  }

  try {
    const supabase = createServerClient();
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'next-unprocessed/route.ts:beforeQuery',message:'before supabase query',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3-H4'})}).catch(()=>{});
    // #endregion
    const { data, error } = await supabase
      .from('transcripts')
      .select('*')
      .eq('is_processed', false)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'next-unprocessed/route.ts:afterQuery',message:'after supabase query',data:{hasData:!!data,errorMessage:error?.message ?? null},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ transcript: null }, { status: 200 });
    }

    return NextResponse.json({ transcript: data }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'next-unprocessed/route.ts:catch',message:'caught exception',data:{message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4-H5'})}).catch(()=>{});
    // #endregion
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
