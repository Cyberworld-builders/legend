'use client';

import { useState } from 'react';

interface TranscriptSubmitFormProps {
  onCreated: () => void;
}

export default function TranscriptSubmitForm({ onCreated }: TranscriptSubmitFormProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/transcripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript_text: text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create transcript');
      }

      setText('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
      <h2 className="text-lg font-bold text-[#00ff00] mb-4">Add Transcript</h2>

      <div className="space-y-4">
        <textarea
          placeholder="Paste or type transcript text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={6}
          className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#00ff00]/30 rounded text-[#00ff00] text-sm font-mono placeholder-[#00ff00]/30 focus:outline-none focus:border-[#00ff00]/60 resize-y"
        />

        {error && (
          <p className="text-red-400 text-sm font-mono">{error}</p>
        )}

        {success && (
          <p className="text-[#00ff00] text-sm font-mono">Transcript added successfully.</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#00ff00] text-[#0a0a0a] font-bold text-sm font-mono rounded hover:bg-[#00cc00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add Transcript'}
        </button>
      </div>
    </form>
  );
}
