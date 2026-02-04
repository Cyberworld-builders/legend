'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { LeadRecord, LEAD_STATUSES, PROJECT_LABELS, BUDGET_LABELS } from '@/types/leads';
import { getLeadTier } from '@/lib/lead-scoring';
import LeadFilters from './LeadFilters';

const TIER_STYLES: Record<string, string> = {
  hot: 'bg-red-500/20 text-red-400 border border-red-500/40',
  warm: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
  cold: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
  spam: 'bg-gray-500/20 text-gray-400 border border-gray-500/40',
};

export default function LeadsTable() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    projectType: '',
    budgetTier: '',
    urgency: '',
    search: '',
  });
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchLeads = useCallback(async (currentPage: number, currentFilters: typeof filters) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('pageSize', '20');
    if (currentFilters.status) params.set('status', currentFilters.status);
    if (currentFilters.projectType) params.set('projectType', currentFilters.projectType);
    if (currentFilters.budgetTier) params.set('budgetTier', currentFilters.budgetTier);
    if (currentFilters.urgency) params.set('urgency', currentFilters.urgency);
    if (currentFilters.search) params.set('search', currentFilters.search);

    try {
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(page, filters);
  }, [page, filters, fetchLeads]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'search') {
      if (searchTimeout) clearTimeout(searchTimeout);
      const timeout = setTimeout(() => {
        setPage(1);
        setFilters((prev) => ({ ...prev, search: value }));
      }, 400);
      setSearchTimeout(timeout);
      // Update input value immediately for responsive feel
      setFilters((prev) => ({ ...prev, search: value }));
      return;
    }
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as LeadRecord['status'] } : l))
        );
      }
    } catch {
      // Network error
    }
  };

  return (
    <div>
      <LeadFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="mt-4 text-[#00ff00]/50 text-sm">
        {total} lead{total !== 1 ? 's' : ''} found
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#00ff00]/20">
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal">Score</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal">Name</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal hidden md:table-cell">Email</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal hidden lg:table-cell">Project</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal hidden lg:table-cell">Budget</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal">Status</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal hidden md:table-cell">Created</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#00ff00]/40">Loading...</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#00ff00]/40">No leads found</td>
              </tr>
            ) : (
              leads.map((lead) => {
                const tier = getLeadTier(lead.score);
                return (
                  <tr key={lead.id} className="border-b border-[#00ff00]/10 hover:bg-[#00ff00]/5">
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-mono ${TIER_STYLES[tier]}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[#00ff00]">{lead.name}</td>
                    <td className="py-3 px-2 text-[#00ff00]/70 hidden md:table-cell">{lead.email}</td>
                    <td className="py-3 px-2 text-[#00ff00]/60 hidden lg:table-cell">
                      {PROJECT_LABELS[lead.project_type] || lead.project_type}
                    </td>
                    <td className="py-3 px-2 text-[#00ff00]/60 hidden lg:table-cell">
                      {BUDGET_LABELS[lead.budget_tier] || lead.budget_tier}
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="bg-[#0a0a0a] border border-[#00ff00]/30 rounded px-2 py-1 text-[#00ff00] text-xs font-mono focus:outline-none"
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-2 text-[#00ff00]/50 hidden md:table-cell">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-[#00ff00]/60 hover:text-[#00ff00] text-xs underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-[#00ff00]/30 rounded text-[#00ff00] text-sm font-mono hover:bg-[#00ff00]/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-[#00ff00]/50 text-sm font-mono">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-[#00ff00]/30 rounded text-[#00ff00] text-sm font-mono hover:bg-[#00ff00]/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
