import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // 301 redirect %20-encoded tag URLs to hyphenated slugs
  const pathname = request.nextUrl.pathname;
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
  matcher: ['/admin/:path*', '/blog/tag/:path*'],
};
