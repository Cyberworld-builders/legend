import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/tag/:path*'],
};
