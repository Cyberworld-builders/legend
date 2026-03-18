'use client';

import { useState, useEffect } from 'react';
import { TranscriptRecord } from '@/types/transcripts';
import { X } from 'lucide-react';
import PipelineTimeline from './PipelineTimeline';

interface TranscriptEditModalProps {
  transcript: TranscriptRecord;
  onClose: () => void;
  onSaved: (updated: TranscriptRecord) => void;
}

export default function TranscriptEditModal({ transcript, onClose, onSaved }: TranscriptEditModalProps) {
  const [title, setTitle] = useState(transcript.title);
  const [text, setText] = useState(transcript.transcript_text);
  const [isProcessed, setIsProcessed] = useState(transcript.is_processed);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = async () => {
    setError('');
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/transcripts/${transcript.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          transcript_text: text,
          is_processed: isProcessed,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      const data = await res.json();
      onSaved(data.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const statusBadge = () => {
    switch (transcript.status) {
      case 'failed':
        return <span className="px-2 py-0.5 bg-red-900/30 border border-red-500/40 rounded text-red-400 text-xs font-mono">FAILED</span>;
      case 'claimed':
        return <span className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-500/40 rounded text-yellow-400 text-xs font-mono">STUCK</span>;
      case 'processed':
        return <span className="px-2 py-0.5 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded text-[#00ff00] text-xs font-mono">PROCESSED</span>;
      default:
        return <span className="px-2 py-0.5 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded text-[#00ff00]/50 text-xs font-mono">PENDING</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#1a1a1a] border border-[#00ff00]/30 rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#00ff00]/20">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-[#00ff00]">Edit Transcript</h2>
            {statusBadge()}
          </div>
          <button onClick={onClose} className="text-[#00ff00]/60 hover:text-[#00ff00]">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Metadata row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#00ff00]/50 font-mono">
            <div>Created: {new Date(transcript.created_at).toLocaleString()}</div>
            <div>Updated: {new Date(transcript.updated_at).toLocaleString()}</div>
            {transcript.claimed_at && (
              <div>Claimed: {new Date(transcript.claimed_at).toLocaleString()}</div>
            )}
            {transcript.retry_count > 0 && (
              <div>Retries: {transcript.retry_count}</div>
            )}
          </div>

          {/* Error box */}
          {transcript.error_message && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded">
              <div className="text-red-400 text-xs font-mono font-bold mb-1">Error</div>
              <div className="text-red-300 text-sm font-mono">{transcript.error_message}</div>
              {transcript.error_at && (
                <div className="text-red-400/50 text-xs font-mono mt-1">
                  at {new Date(transcript.error_at).toLocaleString()}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#00ff00]/70 mb-2 font-mono">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#00ff00]/30 rounded text-[#00ff00] text-sm font-mono focus:outline-none focus:border-[#00ff00]/60"
            />
          </div>

          <div>
            <label className="block text-sm text-[#00ff00]/70 mb-2 font-mono">Transcript Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#00ff00]/30 rounded text-[#00ff00] text-sm font-mono focus:outline-none focus:border-[#00ff00]/60 resize-y"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-[#00ff00]/70 font-mono">Processed</label>
            <button
              type="button"
              onClick={() => setIsProcessed(!isProcessed)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isProcessed ? 'bg-[#00ff00]/30' : 'bg-[#00ff00]/10'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                  isProcessed ? 'translate-x-7 bg-[#00ff00]' : 'translate-x-1 bg-[#00ff00]/50'
                }`}
              />
            </button>
          </div>

          {/* Pipeline Events Timeline */}
          <div>
            <label className="block text-sm text-[#00ff00]/70 mb-2 font-mono">Pipeline Events</label>
            <div className="p-3 bg-[#0a0a0a] border border-[#00ff00]/10 rounded">
              <PipelineTimeline transcriptId={transcript.id} />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm font-mono">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#00ff00]/20">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#00ff00]/30 rounded text-[#00ff00] text-sm font-mono hover:bg-[#00ff00]/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-[#00ff00] text-[#0a0a0a] font-bold text-sm font-mono rounded hover:bg-[#00cc00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
