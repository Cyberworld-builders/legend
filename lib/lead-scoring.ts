import type { LeadFormData, LeadScore } from '@/types/leads';

// Scoring weights for budget tiers
const BUDGET_SCORES: Record<string, number> = {
  'under-5k': 2,
  '5k-10k': 4,
  '10k-25k': 6,
  '25k-50k': 8,
  '50k-plus': 10,
  'not-sure': 3,
};

// Scoring weights for urgency
const URGENCY_SCORES: Record<string, number> = {
  'asap': 10,
  'this-month': 7,
  'this-quarter': 4,
  'exploring': 2,
};

// Scoring weights for project type
const PROJECT_SCORES: Record<string, number> = {
  'ai-automation': 8,
  'custom-automation': 7,
  'web-app': 6,
  'consulting': 5,
  'other': 3,
};

// Keywords that indicate serious intent
const SERIOUS_KEYWORDS = [
  'budget',
  'timeline',
  'deadline',
  'integrate',
  'automate',
  'workflow',
  'api',
  'crm',
  'scale',
  'migrate',
  'replace',
  'current system',
  'existing',
];

/**
 * Calculate lead score based on form data.
 * Handles optional fields gracefully — missing fields score 0.
 */
export function calculateLeadScore(data: LeadFormData): LeadScore {
  // Check honeypot - if filled, it's a bot
  const honeypotEmpty = !data.honeypot || data.honeypot.length === 0;

  // Validate phone format (if provided)
  const phoneValid = !data.phone || data.phone.length === 0 || /^[\d\s\-\+\(\)]{7,20}$/.test(data.phone);

  // Calculate message quality score (length and keyword presence)
  const message = data.message || '';
  const messageLength = message.length;
  let messageQualityScore = Math.min(10, Math.floor(messageLength / 50));

  // Bonus points for specific keywords indicating serious intent
  if (message) {
    const messageLower = message.toLowerCase();
    const keywordMatches = SERIOUS_KEYWORDS.filter(kw =>
      messageLower.includes(kw)
    ).length;
    messageQualityScore = Math.min(10, messageQualityScore + keywordMatches);
  }

  // Calculate component scores (0 if field not provided)
  const budgetScore = data.budgetTier ? (BUDGET_SCORES[data.budgetTier] || 0) : 0;
  const urgencyScore = data.urgency ? (URGENCY_SCORES[data.urgency] || 0) : 0;
  const projectTypeScore = data.projectType ? (PROJECT_SCORES[data.projectType] || 0) : 0;

  // Calculate total with penalties
  let totalScore = budgetScore + urgencyScore + projectTypeScore + messageQualityScore;

  // Major penalty for honeypot (bot detected)
  if (!honeypotEmpty) {
    totalScore -= 100;
  }

  // Minor penalty for malformed phone
  if (!phoneValid && data.phone) {
    totalScore -= 5;
  }

  return {
    honeypotEmpty,
    phoneValid,
    budgetScore,
    urgencyScore,
    projectTypeScore,
    messageQualityScore,
    totalScore: Math.max(-100, totalScore), // Floor at -100
  };
}

/**
 * Determine if a submission is spam based on score
 */
export function isSpam(score: LeadScore): boolean {
  // Spam if honeypot filled or total score is negative
  return !score.honeypotEmpty || score.totalScore < 0;
}

/**
 * Get lead quality tier based on score
 */
export function getLeadTier(score: number): 'hot' | 'warm' | 'cold' | 'spam' {
  if (score < 0) return 'spam';
  if (score >= 25) return 'hot';
  if (score >= 15) return 'warm';
  return 'cold';
}

/**
 * Format score breakdown for display
 */
export function formatScoreBreakdown(score: LeadScore): string {
  const lines = [
    `Budget: ${score.budgetScore}/10`,
    `Urgency: ${score.urgencyScore}/10`,
    `Project Type: ${score.projectTypeScore}/10`,
    `Message Quality: ${score.messageQualityScore}/10`,
  ];

  if (!score.phoneValid) {
    lines.push('Phone Format: -5');
  }

  if (!score.honeypotEmpty) {
    lines.push('Bot Detected: -100');
  }

  lines.push(`Total: ${score.totalScore}`);

  return lines.join('\n');
}
