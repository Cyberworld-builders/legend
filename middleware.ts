import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// AI crawler user agent patterns
const AI_BOT_PATTERNS = [
  'GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-Web',
  'GoogleOther', 'Google-Extended', 'Amazonbot', 'Bytespider', 'cohere-ai',
  'Applebot-Extended', 'anthropic-ai',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --- AI crawler detection (runs on all paths, no blocking) ---
  const ua = request.headers.get('user-agent') || '';
  const matchedBot = AI_BOT_PATTERNS.find(bot => ua.includes(bot));
  if (matchedBot && !pathname.startsWith('/api/')) {
    // Fire-and-forget: log to the track endpoint
    const trackUrl = new URL('/api/track', request.url);
    try {
      fetch(trackUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: [{
            session_id: `bot-${matchedBot}-${Date.now()}`,
            event_name: 'ai_crawler_visit',
            page: pathname,
            event_data: { bot_name: matchedBot, user_agent: ua.slice(0, 512) },
          }],
        }),
      }).catch(() => {}); // truly fire-and-forget
    } catch {}
  }

  // 301 redirect %20-encoded tag URLs to hyphenated slugs
  if (pathname.startsWith('/blog/tag/') && pathname.includes('%20')) {
    const tagPart = pathname.slice('/blog/tag/'.length);
    const slugified = decodeURIComponent(tagPart)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const url = request.nextUrl.clone();
    url.pathname = `/blog/tag/${slugified}`;
    return NextResponse.redirect(url, 301);
  }

  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Block non-US traffic from all /admin routes
  const country = request.headers.get('cf-ipcountry') || '';
  if (country && country !== 'US') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Allow login and password reset flow without auth
  if (
    request.nextUrl.pathname === '/admin/login' ||
    request.nextUrl.pathname === '/admin/forgot-password' ||
    request.nextUrl.pathname === '/admin/reset-password'
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // AI crawler detection needs all content paths
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
