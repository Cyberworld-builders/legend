'use client';

import { LEAD_STATUSES, PROJECT_TYPES, BUDGET_TIERS, URGENCY_OPTIONS, PROJECT_LABELS, BUDGET_LABELS, URGENCY_LABELS } from '@/types/leads';

interface LeadFiltersProps {
  filters: {
    status: string;
    projectType: string;
    budgetTier: string;
    urgency: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export default function LeadFilters({ filters, onFilterChange }: LeadFiltersProps) {
  const selectClass = 'bg-[#0a0a0a] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] text-sm font-mono focus:outline-none focus:border-[#00ff00]/60';
  const inputClass = 'bg-[#0a0a0a] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] text-sm font-mono placeholder-[#00ff00]/30 focus:outline-none focus:border-[#00ff00]/60';

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Search name, email, company..."
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        className={`${inputClass} w-64`}
      />

      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>

      <select
        value={filters.projectType}
        onChange={(e) => onFilterChange('projectType', e.target.value)}
        className={selectClass}
      >
        <option value="">All Project Types</option>
        {PROJECT_TYPES.map((t) => (
          <option key={t} value={t}>{PROJECT_LABELS[t]}</option>
        ))}
      </select>

      <select
        value={filters.budgetTier}
        onChange={(e) => onFilterChange('budgetTier', e.target.value)}
        className={selectClass}
      >
        <option value="">All Budgets</option>
        {BUDGET_TIERS.map((b) => (
          <option key={b} value={b}>{BUDGET_LABELS[b]}</option>
        ))}
      </select>

      <select
        value={filters.urgency}
        onChange={(e) => onFilterChange('urgency', e.target.value)}
        className={selectClass}
      >
        <option value="">All Urgencies</option>
        {URGENCY_OPTIONS.map((u) => (
          <option key={u} value={u}>{URGENCY_LABELS[u]}</option>
        ))}
      </select>
    </div>
  );
}
