import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { leadFormSchema } from '@/types/leads';
import { calculateLeadScore, isSpam } from '@/lib/lead-scoring';
import { v4 as uuidv4 } from 'uuid';

// Send lead data to n8n webhook (non-blocking)
async function sendToN8n(
  leadId: string,
  data: Record<string, unknown>,
  score: number
): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('N8N_WEBHOOK_URL not configured, skipping webhook');
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': leadId,
      },
      body: JSON.stringify({
        leadId,
        ...data,
        score,
        timestamp: new Date().toISOString(),
      }),
    });
    console.log('Lead sent to n8n webhook:', leadId);
  } catch (error) {
    console.error('n8n webhook failed:', error);
  }
}

// Email-only (hero) and full form (bottom CTA) both submit here; only email required, other fields nullable (see migration 20260204000002).
export async function POST(request: NextRequest) {
  try {
    // Get client IP for logging
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const parseResult = leadFormSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Calculate lead score
    const scoreBreakdown = calculateLeadScore(data);

    // Log spam but still store the lead — favor catching 100% of valid leads
    const spamDetected = isSpam(scoreBreakdown);
    if (spamDetected) {
      console.warn('Potential spam lead detected:', {
        email: data.email,
        score: scoreBreakdown.totalScore,
        honeypotFilled: !scoreBreakdown.honeypotEmpty,
        ip,
      });
    }

    // Check if Supabase is configured
    if (!isServerSupabaseConfigured()) {
      console.log('Supabase not configured - logging lead to console:', {
        email: data.email,
        score: scoreBreakdown.totalScore,
      });
      return NextResponse.json({
        success: true,
        message: 'Thank you for your submission! We\'ll be in touch soon.',
      });
    }

    // Create Supabase client
    const supabase = createServerClient();

    // Generate idempotency key
    const idempotencyKey = uuidv4();

    // Insert lead — only email is required, all other fields nullable
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name: data.name || null,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        project_type: data.projectType || null,
        budget_tier: data.budgetTier || null,
        urgency: data.urgency || null,
        message: data.message || null,
        score: scoreBreakdown.totalScore,
        score_breakdown: scoreBreakdown,
        status: 'new',
        source_url: request.headers.get('referer') || null,
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || null,
        consent_marketing: true,
      })
      .select()
      .single();

    if (leadError) {
      console.error('Failed to insert lead:', leadError);
      return NextResponse.json(
        { error: 'Failed to submit lead' },
        { status: 500 }
      );
    }

    // Log form_submit event for audit trail
    await supabase.from('lead_events').insert({
      lead_id: lead.id,
      event_type: 'form_submit',
      event_data: {
        source: 'website',
        scoreBreakdown,
        ip,
        spam_detected: spamDetected,
      },
      idempotency_key: idempotencyKey,
      triggered_by: 'api',
    });

    // Send to n8n webhook (async, non-blocking)
    sendToN8n(lead.id, {
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      projectType: data.projectType,
      budgetTier: data.budgetTier,
      urgency: data.urgency,
      message: data.message,
    }, scoreBreakdown.totalScore);

    console.log('Lead created:', {
      id: lead.id,
      email: data.email,
      score: scoreBreakdown.totalScore,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your submission! We\'ll be in touch soon.',
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
