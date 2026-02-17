import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function verifyAuth() {
  const cookieStore = await cookies();
  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* Read-only context */
          }
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('chat_sessions').select('*', { count: 'exact' });

  if (status && ['active', 'abandoned', 'converted'].includes(status)) {
    query = query.eq('status', status);
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(
      `extracted_email.ilike.${term},extracted_name.ilike.${term},extracted_phone.ilike.${term}`
    );
  }

  const sortColumn =
    sortBy === 'message_count'
      ? 'message_count'
      : sortBy === 'last_message_at'
        ? 'last_message_at'
        : 'created_at';
  query = query.order(sortColumn, {
    ascending: sortOrder === 'asc',
    nullsFirst: false,
  });
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      chats: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    },
    {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
      },
    },
  );
}
