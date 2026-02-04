import { z } from 'zod';

// Zod schema for creating a transcript — only transcript_text required; title optional (server sets default new_<ISO>)
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
}

// Paginated response
export interface TranscriptListResponse {
  transcripts: TranscriptRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
