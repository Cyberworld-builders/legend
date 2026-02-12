'use client';

import Link from 'next/link';
import { LeadRecord, LeadEvent, PROJECT_LABELS, BUDGET_LABELS, URGENCY_LABELS, LEAD_STATUSES } from '@/types/leads';
import { getLeadTier } from '@/lib/lead-scoring';
import { useState } from 'react';

const TIER_STYLES: Record<string, string> = {
  hot: 'bg-red-500/20 text-red-400 border border-red-500/40',
  warm: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
  cold: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
  spam: 'bg-gray-500/20 text-gray-400 border border-gray-500/40',
};

interface LeadDetailCardProps {
  lead: LeadRecord;
  events: LeadEvent[];
}

export default function LeadDetailCard({ lead: initialLead, events }: LeadDetailCardProps) {
  const [lead, setLead] = useState(initialLead);
  const tier = getLeadTier(lead.score);
  const breakdown = lead.score_breakdown;

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
      }
    } catch {
      // Network error
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded text-sm font-mono ${TIER_STYLES[tier]}`}>
            Score: {lead.score} ({tier})
          </span>
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-[#0a0a0a] border border-[#00ff00]/30 rounded px-3 py-1 text-[#00ff00] text-sm font-mono focus:outline-none"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <Link href="/admin/leads" className="text-[#00ff00]/60 hover:text-[#00ff00] text-sm font-mono">
          &larr; Back to Leads
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#00ff00] mb-4">Contact</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Name</dt>
              <dd className="text-[#00ff00]">{lead.name ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Email</dt>
              <dd className="text-[#00ff00]">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Company</dt>
              <dd className="text-[#00ff00]">{lead.company || '-'}</dd>
            </div>
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Phone</dt>
              <dd className="text-[#00ff00]">{lead.phone || '-'}</dd>
            </div>
          </dl>
        </div>

        {/* Project Details */}
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#00ff00] mb-4">Project</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Type</dt>
              <dd className="text-[#00ff00]">{lead.project_type != null ? (PROJECT_LABELS[lead.project_type] ?? lead.project_type) : '-'}</dd>
            </div>
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Budget</dt>
              <dd className="text-[#00ff00]">{lead.budget_tier != null ? (BUDGET_LABELS[lead.budget_tier] ?? lead.budget_tier) : '-'}</dd>
            </div>
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Urgency</dt>
              <dd className="text-[#00ff00]">{lead.urgency != null ? (URGENCY_LABELS[lead.urgency] ?? lead.urgency) : '-'}</dd>
            </div>
          </dl>
        </div>

        {/* Message */}
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-[#00ff00] mb-4">Message</h2>
          <p className="text-[#00ff00]/80 whitespace-pre-wrap">{lead.message ?? '-'}</p>
        </div>

        {/* Score Breakdown */}
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#00ff00] mb-4">Score Breakdown</h2>
          {breakdown ? (
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-[#00ff00]/50 text-sm">Budget</dt>
                <dd className="text-[#00ff00] text-sm">{breakdown.budgetScore}/10</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#00ff00]/50 text-sm">Urgency</dt>
                <dd className="text-[#00ff00] text-sm">{breakdown.urgencyScore}/10</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#00ff00]/50 text-sm">Project Type</dt>
                <dd className="text-[#00ff00] text-sm">{breakdown.projectTypeScore}/10</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#00ff00]/50 text-sm">Message Quality</dt>
                <dd className="text-[#00ff00] text-sm">{breakdown.messageQualityScore}/10</dd>
              </div>
              <div className="flex justify-between border-t border-[#00ff00]/20 pt-2 mt-2">
                <dt className="text-[#00ff00] text-sm font-bold">Total</dt>
                <dd className="text-[#00ff00] text-sm font-bold">{breakdown.totalScore}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-[#00ff00]/40 text-sm">No breakdown available</p>
          )}
        </div>

        {/* Attribution */}
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#00ff00] mb-4">Attribution</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Source URL</dt>
              <dd className="text-[#00ff00]/70 text-sm break-all">{lead.source_url || '-'}</dd>
            </div>
            <div>
              <dt className="text-[#00ff00]/50 text-xs">IP Address</dt>
              <dd className="text-[#00ff00]/70 text-sm">{lead.ip_address || '-'}</dd>
            </div>
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Created</dt>
              <dd className="text-[#00ff00]/70 text-sm">{new Date(lead.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-[#00ff00]/50 text-xs">Updated</dt>
              <dd className="text-[#00ff00]/70 text-sm">{new Date(lead.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
        <h2 className="text-lg font-bold text-[#00ff00] mb-4">Events Timeline</h2>
        {events.length === 0 ? (
          <p className="text-[#00ff00]/40 text-sm">No events recorded</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex gap-4 border-l-2 border-[#00ff00]/20 pl-4">
                <div>
                  <p className="text-[#00ff00] text-sm font-mono">{event.event_type}</p>
                  <p className="text-[#00ff00]/40 text-xs">
                    {new Date(event.created_at).toLocaleString()} &middot; {event.triggered_by}
                  </p>
                  {event.event_data && Object.keys(event.event_data).length > 0 && (
                    <pre className="text-[#00ff00]/50 text-xs mt-1 overflow-x-auto">
                      {JSON.stringify(event.event_data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
