import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { validateAutomationApiKey } from '@/lib/automation-auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/automation/social — Create or update social posts from GusClaw.
 *
 * Body: { action: "upsert" | "mark_posted" | "mark_failed" | "update_metrics", ...payload }
 */
export async function POST(request: NextRequest) {
  const authError = validateAutomationApiKey(request);
  if (authError) return authError;

  const supabase = createServerClient();

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'upsert') {
      // Insert or update a social post draft
      const { platform, blog_slug, text, url, image_path, status } = body;
      if (!platform || !blog_slug) {
        return NextResponse.json({ error: 'platform and blog_slug required' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('social_posts')
        .upsert(
          { platform, blog_slug, text: text || '', url, image_path, status: status || 'draft' },
          { onConflict: 'platform,blog_slug', ignoreDuplicates: false }
        )
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, post: data });
    }

    if (action === 'save_draft') {
      const { platform, blog_slug, text, url, image_path } = body;
      if (!platform || !blog_slug) {
        return NextResponse.json({ error: 'platform and blog_slug required' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('social_posts')
        .insert({ platform, blog_slug, text: text || '', url, image_path, status: 'draft' })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, post: data });
    }

    if (action === 'mark_posted') {
      const { id, post_id, post_url } = body;
      if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
      const { error } = await supabase
        .from('social_posts')
        .update({ status: 'posted', post_id, post_url, posted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'mark_failed') {
      const { id, error_message } = body;
      if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
      const { error } = await supabase
        .from('social_posts')
        .update({ status: 'failed', error_message })
        .eq('id', id);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'update_metrics') {
      const { id, impressions, clicks, likes, comments, shares } = body;
      if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
      const { error } = await supabase
        .from('social_posts')
        .update({
          impressions, clicks, likes, comments, shares,
          metrics_updated: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'get_pending_drafts') {
      const { platform } = body;
      let query = supabase
        .from('social_posts')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: true });
      if (platform) query = query.eq('platform', platform);
      const { data, error } = await query;

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, posts: data ?? [] });
    }

    if (action === 'get_posts_for_slug') {
      const { blog_slug } = body;
      if (!blog_slug) return NextResponse.json({ error: 'blog_slug required' }, { status: 400 });
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('blog_slug', blog_slug)
        .order('created_at', { ascending: true });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, posts: data ?? [] });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });

  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
