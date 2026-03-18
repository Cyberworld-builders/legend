'use client';

import { useState, useEffect } from 'react';
import { PipelineEventRecord } from '@/types/transcripts';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PipelineTimelineProps {
  transcriptId: string;
}

export default function PipelineTimeline({ transcriptId }: PipelineTimelineProps) {
  const [events, setEvents] = useState<PipelineEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/admin/transcripts/${transcriptId}/events`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load events');
        const data = await res.json();
        setEvents(data.events ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [transcriptId]);

  if (loading) {
    return <div className="text-[#00ff00]/40 text-xs font-mono py-2">Loading events...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-xs font-mono py-2">{error}</div>;
  }

  if (events.length === 0) {
    return <div className="text-[#00ff00]/30 text-xs font-mono py-2">No pipeline events recorded.</div>;
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#00ff00]';
      case 'failed': return 'text-red-400';
      case 'started': return 'text-yellow-400';
      default: return 'text-[#00ff00]/50';
    }
  };

  const dotColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#00ff00]';
      case 'failed': return 'bg-red-400';
      case 'started': return 'bg-yellow-400';
      default: return 'bg-[#00ff00]/50';
    }
  };

  return (
    <div className="relative pl-4">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#00ff00]/20" />

      {events.map((event) => {
        const hasData = event.event_data && Object.keys(event.event_data).length > 0;
        const isExpanded = expandedId === event.id;

        return (
          <div key={event.id} className="relative pb-3 last:pb-0">
            {/* Dot */}
            <div className={`absolute left-[-13px] top-1.5 w-2.5 h-2.5 rounded-full ${dotColor(event.status)} ring-2 ring-[#0a0a0a]`} />

            <div className="ml-2">
              <div
                className={`flex items-center gap-2 ${hasData ? 'cursor-pointer' : ''}`}
                onClick={() => hasData && setExpandedId(isExpanded ? null : event.id)}
              >
                {hasData && (
                  isExpanded
                    ? <ChevronDown size={10} className="text-[#00ff00]/40 flex-shrink-0" />
                    : <ChevronRight size={10} className="text-[#00ff00]/40 flex-shrink-0" />
                )}
                <span className="text-xs font-mono text-[#00ff00]/80">
                  {event.step_name || event.event_type}
                </span>
                <span className={`text-xs font-mono ${statusColor(event.status)}`}>
                  [{event.status}]
                </span>
                <span className="text-xs font-mono text-[#00ff00]/30 ml-auto flex-shrink-0">
                  {new Date(event.created_at).toLocaleString()}
                </span>
              </div>

              <div className="text-xs font-mono text-[#00ff00]/30 ml-3">
                {event.triggered_by}
              </div>

              {isExpanded && hasData && (
                <pre className="mt-1 ml-3 p-2 bg-[#0a0a0a] border border-[#00ff00]/10 rounded text-xs font-mono text-[#00ff00]/60 overflow-x-auto max-h-40">
                  {JSON.stringify(event.event_data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
