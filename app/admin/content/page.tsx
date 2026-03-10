import Link from 'next/link';
import { createAuthServerClient } from '@/lib/supabase-server';
import postIndex from '@/lib/post-index.json';

interface SocialPost {
  id: string;
  platform: string;
  blog_slug: string;
  status: string;
  post_id: string | null;
  post_url: string | null;
  posted_at: string | null;
  impressions: number | null;
  clicks: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
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

interface ContentRow {
  slug: string;
  title: string;
  publishedDate: string;
  tags: string[];
  platforms: { x: SocialPost | null; linkedin: SocialPost | null; facebook: SocialPost | null };
  totals: { impressions: number; clicks: number; likes: number; comments: number; shares: number };
  score: number;
  socialPostCount: number;
  draftCount: number;
}

function PlatformBadge({ post, name }: { post: SocialPost | null; name: string }) {
  if (!post) return <span className="text-[#00ff00]/20 text-xs">{name}</span>;
  const colors: Record<string, string> = {
    draft: 'text-yellow-400/70 border-yellow-400/30',
    posted: 'text-[#00ff00] border-[#00ff00]/40',
    failed: 'text-red-400/70 border-red-400/30',
  };
  return (
    <span className={`text-xs px-1.5 py-0.5 border rounded ${colors[post.status] || 'text-[#00ff00]/40 border-[#00ff00]/20'}`}>
      {name}
    </span>
  );
}

function MetricCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[#00ff00] font-mono text-sm">{value.toLocaleString()}</p>
      <p className="text-[#00ff00]/30 text-[10px] uppercase">{label}</p>
    </div>
  );
}

export default async function ContentPage() {
  const posts: PostMeta[] = ((postIndex as { posts: PostMeta[] }).posts || []);
  let socialPosts: SocialPost[] = [];

  try {
    const supabase = await createAuthServerClient();
    const { data } = await supabase
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false });
    socialPosts = data ?? [];
  } catch {
    // Supabase may not be running
  }

  // Group social posts by slug
  const socialBySlug: Record<string, SocialPost[]> = {};
  for (const sp of socialPosts) {
    if (!socialBySlug[sp.blog_slug]) socialBySlug[sp.blog_slug] = [];
    socialBySlug[sp.blog_slug].push(sp);
  }

  // Build content rows
  const content: ContentRow[] = posts.map((post) => {
    const social = socialBySlug[post.slug] || [];
    const posted = social.filter((s) => s.status === 'posted');
    const totals = {
      impressions: posted.reduce((sum, s) => sum + (s.impressions || 0), 0),
      clicks: posted.reduce((sum, s) => sum + (s.clicks || 0), 0),
      likes: posted.reduce((sum, s) => sum + (s.likes || 0), 0),
      comments: posted.reduce((sum, s) => sum + (s.comments || 0), 0),
      shares: posted.reduce((sum, s) => sum + (s.shares || 0), 0),
    };
    const score =
      totals.impressions * 0.1 + totals.clicks * 2 + totals.likes * 3 + totals.comments * 5 + totals.shares * 8;

    return {
      slug: post.slug,
      title: post.title,
      publishedDate: post.publishedDate || '',
      tags: post.tags || [],
      platforms: {
        x: social.find((s) => s.platform === 'x') || null,
        linkedin: social.find((s) => s.platform === 'linkedin') || null,
        facebook: social.find((s) => s.platform === 'facebook') || null,
      },
      totals,
      score,
      socialPostCount: posted.length,
      draftCount: social.filter((s) => s.status === 'draft').length,
    };
  });

  // Sort by score descending
  content.sort((a, b) => b.score - a.score);

  // Summary
  const totalImpressions = content.reduce((s, c) => s + c.totals.impressions, 0);
  const totalEngagement = content.reduce((s, c) => s + c.totals.likes + c.totals.comments + c.totals.shares, 0);
  const withSocial = content.filter((c) => c.socialPostCount > 0).length;
  const pendingDrafts = socialPosts.filter((s) => s.status === 'draft').length;
  const topPost = content.length > 0 ? content[0] : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#00ff00] mb-8">Content Performance</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-[#00ff00]/50 text-xs">Blog Posts</p>
          <p className="text-2xl font-bold text-[#00ff00] mt-1">{content.length}</p>
        </div>
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-[#00ff00]/50 text-xs">Shared to Social</p>
          <p className="text-2xl font-bold text-[#00ff00] mt-1">{withSocial}</p>
        </div>
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-[#00ff00]/50 text-xs">Total Impressions</p>
          <p className="text-2xl font-bold text-[#00ff00] mt-1">{totalImpressions.toLocaleString()}</p>
        </div>
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-[#00ff00]/50 text-xs">Total Engagement</p>
          <p className="text-2xl font-bold text-[#00ff00] mt-1">{totalEngagement.toLocaleString()}</p>
        </div>
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-[#00ff00]/50 text-xs">Pending Drafts</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{pendingDrafts}</p>
        </div>
      </div>

      {/* Top Performer */}
      {topPost && topPost.score > 0 && (
        <div className="border border-[#00ff00]/30 bg-[#00ff00]/5 rounded-lg p-4 mb-8">
          <p className="text-[#00ff00]/50 text-xs uppercase mb-1">Top Performer</p>
          <Link href={`/blog/${topPost.slug}`} className="text-[#00ff00] font-bold hover:underline">
            {topPost.title}
          </Link>
          <div className="flex gap-6 mt-2">
            <span className="text-[#00ff00]/60 text-xs">{topPost.totals.impressions.toLocaleString()} impressions</span>
            <span className="text-[#00ff00]/60 text-xs">{topPost.totals.likes} likes</span>
            <span className="text-[#00ff00]/60 text-xs">{topPost.totals.comments} comments</span>
            <span className="text-[#00ff00]/60 text-xs">{topPost.totals.shares} shares</span>
            <span className="text-[#00ff00]/40 text-xs">Score: {Math.round(topPost.score)}</span>
          </div>
        </div>
      )}

      {/* Content Table */}
      <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#00ff00]/20 text-[#00ff00]/50 text-xs uppercase">
                <th className="text-left p-3 font-normal">Post</th>
                <th className="text-center p-3 font-normal">Platforms</th>
                <th className="text-center p-3 font-normal">Impressions</th>
                <th className="text-center p-3 font-normal">Likes</th>
                <th className="text-center p-3 font-normal">Comments</th>
                <th className="text-center p-3 font-normal">Shares</th>
                <th className="text-center p-3 font-normal">Score</th>
              </tr>
            </thead>
            <tbody>
              {content.map((row) => (
                <tr key={row.slug} className="border-b border-[#00ff00]/10 hover:bg-[#00ff00]/5 transition-colors">
                  <td className="p-3 max-w-xs">
                    <Link href={`/blog/${row.slug}`} className="text-[#00ff00] hover:underline line-clamp-1">
                      {row.title}
                    </Link>
                    <p className="text-[#00ff00]/30 text-xs mt-0.5">
                      {row.publishedDate ? new Date(row.publishedDate).toLocaleDateString() : 'No date'}
                    </p>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-center">
                      <PlatformBadge post={row.platforms.x} name="X" />
                      <PlatformBadge post={row.platforms.linkedin} name="LI" />
                      <PlatformBadge post={row.platforms.facebook} name="FB" />
                    </div>
                  </td>
                  <td className="p-3"><MetricCell value={row.totals.impressions} label="imp" /></td>
                  <td className="p-3"><MetricCell value={row.totals.likes} label="likes" /></td>
                  <td className="p-3"><MetricCell value={row.totals.comments} label="cmt" /></td>
                  <td className="p-3"><MetricCell value={row.totals.shares} label="shr" /></td>
                  <td className="p-3 text-center">
                    <span className={`font-mono text-sm ${row.score > 0 ? 'text-[#00ff00]' : 'text-[#00ff00]/20'}`}>
                      {Math.round(row.score)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
