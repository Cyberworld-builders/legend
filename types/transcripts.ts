import { z } from 'zod';

// Zod schema for creating a transcript — only transcript_text required; title optional (server sets default NEW_<timestamp>)
export const transcriptCreateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  transcript_text: z.string().min(1, 'Transcript text is required'),
});

export type TranscriptCreateData = z.infer<typeof transcriptCreateSchema>;

// Zod schema for updating a transcript
export const transcriptUpdateSchema = z.object({
  title: z.string().min(2).max(500).optional(),
  transcript_text: z.string().min(1).optional(),
  is_processed: z.boolean().optional(),
  status: z.enum(['pending', 'claimed', 'processed', 'failed']).optional(),
  error_message: z.string().max(2000).optional(),
});

export type TranscriptUpdateData = z.infer<typeof transcriptUpdateSchema>;

// Database record interface
export interface TranscriptRecord {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  title: string;
  transcript_text: string;
  is_processed: boolean;
  status: 'pending' | 'claimed' | 'processed' | 'failed';
  error_message: string | null;
  error_at: string | null;
  claimed_at: string | null;
  retry_count: number;
}

// Paginated response
export interface TranscriptListResponse {
  transcripts: TranscriptRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Pipeline events
export const pipelineEventCreateSchema = z.object({
  transcript_id: z.string().uuid(),
  event_type: z.string().min(1).max(100),
  step_name: z.string().max(200).optional(),
  status: z.enum(['started', 'completed', 'failed']).default('completed'),
  event_data: z.record(z.unknown()).optional(),
  triggered_by: z.string().max(100).default('n8n'),
});

export type PipelineEventCreateData = z.infer<typeof pipelineEventCreateSchema>;

export interface PipelineEventRecord {
  id: string;
  transcript_id: string;
  created_at: string;
  event_type: string;
  step_name: string | null;
  status: 'started' | 'completed' | 'failed';
  event_data: Record<string, unknown>;
  triggered_by: string;
}
