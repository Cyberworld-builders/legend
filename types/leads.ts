import { z } from 'zod';

// Project type options
export const PROJECT_TYPES = [
  'ai-automation',
  'custom-automation',
  'web-app',
  'consulting',
  'other'
] as const;

// Budget tier options
export const BUDGET_TIERS = [
  'under-5k',
  '5k-10k',
  '10k-25k',
  '25k-50k',
  '50k-plus',
  'not-sure'
] as const;

// Urgency options
export const URGENCY_OPTIONS = [
  'asap',
  'this-month',
  'this-quarter',
  'exploring'
] as const;

// Lead status options
export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'converted',
  'lost'
] as const;

// Zod schema for form validation — only email is required
export const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email'),
  company: z.string().max(100).optional().or(z.literal('')),
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]*$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  projectType: z.enum(PROJECT_TYPES).optional().or(z.literal('')),
  budgetTier: z.enum(BUDGET_TIERS).optional().or(z.literal('')),
  urgency: z.enum(URGENCY_OPTIONS).optional().or(z.literal('')),
  message: z.string().max(2000).optional().or(z.literal('')),

  // Hidden honeypot field - should be empty for real users
  honeypot: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Lead scoring breakdown
export interface LeadScore {
  honeypotEmpty: boolean;       // -100 if false (bot detected)
  phoneValid: boolean;          // -5 if malformed
  budgetScore: number;          // 1-10 based on tier
  urgencyScore: number;         // 1-10 based on urgency
  projectTypeScore: number;     // 1-10 based on type
  messageQualityScore: number;  // 1-10 based on length/content
  totalScore: number;
}

// Database lead record
export interface LeadRecord {
  id: string;
  created_at: string;
  updated_at: string;

  // Contact info
  name: string | null;
  email: string;
  company: string | null;
  phone: string | null;

  // Project details
  project_type: typeof PROJECT_TYPES[number] | null;
  budget_tier: typeof BUDGET_TIERS[number] | null;
  urgency: typeof URGENCY_OPTIONS[number] | null;
  message: string | null;

  // Scoring
  score: number;
  score_breakdown: LeadScore;
  status: typeof LEAD_STATUSES[number];

  // Attribution
  source_url: string | null;
  ip_address: string | null;
  user_agent: string | null;

  // Consent
  consent_marketing: boolean;
}

// Lead event for audit trail
export interface LeadEvent {
  id: string;
  lead_id: string;
  created_at: string;
  event_type: 'form_submit' | 'score_calculated' | 'status_changed' | 'email_sent' | 'webhook_sent';
  event_data: Record<string, unknown>;
  idempotency_key: string;
  triggered_by: string;
}

// Display labels for form options
export const PROJECT_LABELS: Record<typeof PROJECT_TYPES[number], string> = {
  'ai-automation': 'AI Automation Flows',
  'custom-automation': 'Custom Automation Solutions',
  'web-app': 'Web Application Development',
  'consulting': 'Technical Consulting',
  'other': 'Other',
};

export const BUDGET_LABELS: Record<typeof BUDGET_TIERS[number], string> = {
  'under-5k': 'Under $5,000',
  '5k-10k': '$5,000 - $10,000',
  '10k-25k': '$10,000 - $25,000',
  '25k-50k': '$25,000 - $50,000',
  '50k-plus': '$50,000+',
  'not-sure': 'Not sure yet',
};

export const URGENCY_LABELS: Record<typeof URGENCY_OPTIONS[number], string> = {
  'asap': 'ASAP - Ready to start immediately',
  'this-month': 'This month',
  'this-quarter': 'This quarter',
  'exploring': 'Just exploring options',
};
