/**
 * Chat session record from chat_sessions table.
 */
export interface ChatSessionRecord {
  id: string;
  created_at: string;
  updated_at: string;
  session_id: string;
  messages: ChatMessage[];
  message_count: number;
  last_message_at: string | null;
  page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  extracted_name: string | null;
  extracted_email: string | null;
  extracted_phone: string | null;
  extracted_company: string | null;
  extracted_project_type: string | null;
  extracted_budget: string | null;
  extracted_problems: string | null;
  extracted_how_found: string | null;
  extracted_interests: string | null;
  extraction_ran_at: string | null;
  lead_id: string | null;
  status: 'active' | 'abandoned' | 'converted';
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  ts?: string;
}

/**
 * Extraction order entry: field, value, and the message index (0-based) where it was first captured.
 */
export interface ExtractionOrderEntry {
  field: 'name' | 'email' | 'phone';
  value: string;
  messageIndex: number;
}

/**
 * Result of computeExtractionOrder: ordered list of extracted fields with message indices.
 */
export type ExtractionOrderResult = ExtractionOrderEntry[];
