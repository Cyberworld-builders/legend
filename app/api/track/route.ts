import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userAgent = request.headers.get('user-agent') || null;

    // Support single event or array of events
    const events: TrackingPayload[] = Array.isArray(body) ? body : [body];

    // Validate required fields
    for (const event of events) {
      if (!event.session_id || !event.event_name || !event.page) {
        return NextResponse.json(
          { error: 'Missing required fields: session_id, event_name, page' },
          { status: 400 }
        );
      }
    }

    if (!isServerSupabaseConfigured()) {
      // Log to console when Supabase is not configured
      for (const event of events) {
        console.log('[track]', event.event_name, event.event_data);
      }
      return new NextResponse(null, { status: 204 });
    }

    const supabase = createServerClient();

    const rows = events.map((event) => ({
      session_id: event.session_id,
      event_name: event.event_name,
      page: event.page,
      referrer: event.referrer || null,
      utm_source: event.utm_source || null,
      utm_medium: event.utm_medium || null,
      utm_campaign: event.utm_campaign || null,
      utm_term: event.utm_term || null,
      utm_content: event.utm_content || null,
      experiment_id: event.experiment_id || null,
      variant: event.variant || null,
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
    return new NextResponse(null, { status: 204 }); // Non-critical — don't break the client
  }
}
