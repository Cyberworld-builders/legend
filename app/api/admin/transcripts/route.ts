import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { transcriptCreateSchema } from '@/types/transcripts';

async function verifyAuth() {
  const cookieStore = await cookies();
  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* Read-only context */ }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(request: NextRequest) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20')));
  const isProcessed = searchParams.get('is_processed');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('transcripts')
    .select('*', { count: 'exact' });

  if (isProcessed === 'true') query = query.eq('is_processed', true);
  if (isProcessed === 'false') query = query.eq('is_processed', false);

  if (search) {
    query = query.or(`title.ilike.%${search}%,transcript_text.ilike.%${search}%`);
  }

  query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    transcripts: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  });
}

export async function POST(request: NextRequest) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = transcriptCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Default title for add form: NEW_<timestamp> so automations can identify new items and parse time
  const rawTitle = parsed.data.title?.trim();
  const title =
    rawTitle && rawTitle.length > 0
      ? rawTitle
      : 'NEW_' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('transcripts')
    .insert({
      title,
      transcript_text: parsed.data.transcript_text,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transcript: data }, { status: 201 });
}
