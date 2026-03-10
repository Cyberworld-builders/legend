import { NextRequest, NextResponse } from 'next/server';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import postIndex from '@/lib/post-index.json';

export const dynamic = 'force-dynamic';

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

interface PostMeta {
  title: string;
  slug: string;
  description?: string;
  publishedDate?: string;
  tags?: string[];
  category?: string;
  headerImage?: string;
  socialImage?: string;
}

/**
 * GET /api/admin/content — Unified content performance view.
 *
 * Joins blog metadata from post-index.json with social metrics from Supabase.
 * Query params: slug, platform, status, days (default 30), sort (default: published)
 */
export async function GET(request: NextRequest) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { searchParams } = request.nextUrl;
  const slugFilter = searchParams.get('slug');
  const platformFilter = searchParams.get('platform');
  const sort = searchParams.get('sort') || 'published';

  // Get blog posts from index
  const posts: PostMeta[] = (postIndex as { posts: PostMeta[] }).posts || [];

  // Get all social posts from Supabase
  let query = supabase
    .from('social_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (slugFilter) query = query.eq('blog_slug', slugFilter);
  if (platformFilter) query = query.eq('platform', platformFilter);

  const { data: socialPosts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get GA4 traffic data
  const { data: trafficData } = await supabase
    .from('blog_traffic')
    .select('slug, views, sessions, users')
    .eq('period', 'daily')
    .order('date', { ascending: false });

  // Aggregate traffic by slug (sum across all dates)
  const trafficBySlug: Record<string, { views: number; sessions: number; users: number }> = {};
  for (const row of trafficData ?? []) {
    if (!trafficBySlug[row.slug]) trafficBySlug[row.slug] = { views: 0, sessions: 0, users: 0 };
    trafficBySlug[row.slug].views += row.views || 0;
    trafficBySlug[row.slug].sessions += row.sessions || 0;
    trafficBySlug[row.slug].users += row.users || 0;
  }

  // Group social posts by slug
  const socialBySlug: Record<string, typeof socialPosts> = {};
  for (const sp of socialPosts ?? []) {
    if (!socialBySlug[sp.blog_slug]) socialBySlug[sp.blog_slug] = [];
    socialBySlug[sp.blog_slug].push(sp);
  }

  // Build unified content records
  const content = posts.map((post) => {
    const social = socialBySlug[post.slug] || [];
    const posted = social.filter((s) => s.status === 'posted');

    const totalImpressions = posted.reduce((sum, s) => sum + (s.impressions || 0), 0);
    const totalLikes = posted.reduce((sum, s) => sum + (s.likes || 0), 0);
    const totalComments = posted.reduce((sum, s) => sum + (s.comments || 0), 0);
    const totalShares = posted.reduce((sum, s) => sum + (s.shares || 0), 0);
    const totalClicks = posted.reduce((sum, s) => sum + (s.clicks || 0), 0);

    // Composite score: weighted engagement
    const score =
      totalImpressions * 0.1 +
      totalClicks * 2 +
      totalLikes * 3 +
      totalComments * 5 +
      totalShares * 8;

    const traffic = trafficBySlug[post.slug] || { views: 0, sessions: 0, users: 0 };

    return {
      slug: post.slug,
      title: post.title,
      description: post.description || '',
      publishedDate: post.publishedDate || '',
      tags: post.tags || [],
      category: post.category || '',
      headerImage: post.headerImage || '',
      socialImage: post.socialImage || '',
      platforms: {
        x: social.find((s) => s.platform === 'x') || null,
        linkedin: social.find((s) => s.platform === 'linkedin') || null,
        facebook: social.find((s) => s.platform === 'facebook') || null,
      },
      totals: {
        impressions: totalImpressions,
        clicks: totalClicks,
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
      },
      traffic,
      score,
      socialPostCount: posted.length,
      draftCount: social.filter((s) => s.status === 'draft').length,
    };
  });

  // Sort
  if (sort === 'score') {
    content.sort((a, b) => b.score - a.score);
  } else if (sort === 'impressions') {
    content.sort((a, b) => b.totals.impressions - a.totals.impressions);
  } else if (sort === 'likes') {
    content.sort((a, b) => b.totals.likes - a.totals.likes);
  } else if (sort === 'views') {
    content.sort((a, b) => b.traffic.views - a.traffic.views);
  } else {
    // Default: most recently published first
    content.sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''));
  }

  // Summary stats
  const summary = {
    totalPosts: content.length,
    postsWithSocial: content.filter((c) => c.socialPostCount > 0).length,
    totalImpressions: content.reduce((sum, c) => sum + c.totals.impressions, 0),
    totalEngagement: content.reduce((sum, c) => sum + c.totals.likes + c.totals.comments + c.totals.shares, 0),
    totalViews: content.reduce((sum, c) => sum + c.traffic.views, 0),
    totalSessions: content.reduce((sum, c) => sum + c.traffic.sessions, 0),
    totalUsers: content.reduce((sum, c) => sum + c.traffic.users, 0),
    topPerformer: content.length > 0
      ? content.reduce((best, c) => (c.score > best.score ? c : best))
      : null,
    pendingDrafts: (socialPosts ?? []).filter((s) => s.status === 'draft').length,
  };

  return NextResponse.json(
    { content, summary },
    { headers: { 'Cache-Control': 'private, no-store, max-age=0' } },
  );
}
