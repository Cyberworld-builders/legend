import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

const ALLOWED_EVENTS = new Set([
  'page_view',
  'section_visible',
  'scroll_depth',
  'scroll_depth_final',
  'cta_click',
  'lead_submit',
]);

const MAX_EVENTS_PER_REQUEST = 20;
const MAX_PAYLOAD_BYTES = 64 * 1024; // 64KB
const MAX_STRING_LENGTH = 512;

interface TrackingPayload {
  session_id: string;
  event_name: string;
  page: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  experiment_id?: string;
  variant?: string;
  event_data?: Record<string, unknown>;
}

function clampString(val: string | undefined, max: number): string | null {
  if (val == null) return null;
  const s = String(val);
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'anonymous';

    const { ok: rateOk } = await checkRateLimit(`track:${ip}`);
    if (!rateOk) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = await request.json();
    const userAgent = request.headers.get('user-agent') || null;

    const events: TrackingPayload[] = Array.isArray(body) ? body : [body];

    if (events.length > MAX_EVENTS_PER_REQUEST) {
      return NextResponse.json(
        { error: `Maximum ${MAX_EVENTS_PER_REQUEST} events per request` },
        { status: 413 }
      );
    }

    for (const event of events) {
      if (!event.session_id || !event.event_name || !event.page) {
        return NextResponse.json(
          { error: 'Missing required fields: session_id, event_name, page' },
          { status: 400 }
        );
      }

      if (!ALLOWED_EVENTS.has(event.event_name)) {
        return NextResponse.json(
          { error: `Invalid event_name: ${event.event_name}` },
          { status: 400 }
        );
      }

      if (event.session_id.length > MAX_STRING_LENGTH) {
        return NextResponse.json({ error: 'session_id too long' }, { status: 400 });
      }
      if (event.page.length > MAX_STRING_LENGTH) {
        return NextResponse.json({ error: 'page too long' }, { status: 400 });
      }

      if (event.event_data && typeof event.event_data === 'object') {
        const dataStr = JSON.stringify(event.event_data);
        if (dataStr.length > 4096) {
          return NextResponse.json({ error: 'event_data too large' }, { status: 400 });
        }
      }
    }

    if (!isServerSupabaseConfigured()) {
      for (const event of events) {
        console.log('[track]', event.event_name, event.event_data);
      }
      return new NextResponse(null, { status: 204 });
    }

    const supabase = createServerClient();

    const rows = events.map((event) => ({
      session_id: event.session_id,
      event_name: event.event_name,
      page: clampString(event.page, MAX_STRING_LENGTH)!,
      referrer: clampString(event.referrer, MAX_STRING_LENGTH),
      utm_source: clampString(event.utm_source, 256),
      utm_medium: clampString(event.utm_medium, 256),
      utm_campaign: clampString(event.utm_campaign, 256),
      utm_term: clampString(event.utm_term, 256),
      utm_content: clampString(event.utm_content, 256),
      experiment_id: clampString(event.experiment_id, 128),
      variant: clampString(event.variant, 64),
      event_data: event.event_data || null,
      user_agent: userAgent,
    }));

    const { error } = await supabase.from('page_events').insert(rows);

    if (error) {
      console.error('Failed to insert page_events:', error);
      return NextResponse.json(
        { error: 'Failed to store event' },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Track API error:', error);
    return new NextResponse(null, { status: 204 });
  }
}
