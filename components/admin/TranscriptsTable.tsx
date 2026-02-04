'use client';

import { useState, useEffect, useCallback } from 'react';
import { TranscriptRecord } from '@/types/transcripts';
import TranscriptEditModal from './TranscriptEditModal';
import { Pencil, Trash2, Check, X } from 'lucide-react';

interface TranscriptsTableProps {
  refreshKey: number;
}

export default function TranscriptsTable({ refreshKey }: TranscriptsTableProps) {
  const [transcripts, setTranscripts] = useState<TranscriptRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProcessed, setFilterProcessed] = useState('');
  const [editingModal, setEditingModal] = useState<TranscriptRecord | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchTranscripts = useCallback(async (currentPage: number, currentSearch: string, currentFilter: string) => {
    setLoading(true);
    setLoadError(null);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('pageSize', '20');
    if (currentFilter) params.set('is_processed', currentFilter);
    if (currentSearch) params.set('search', currentSearch);

    try {
      const res = await fetch(`/api/admin/transcripts?${params.toString()}`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setTranscripts(data.transcripts);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        const message =
          res.status === 401
            ? 'Unable to load transcripts. Please sign in again.'
            : (data?.error as string) || 'Unable to load transcripts.';
        setLoadError(message);
      }
    } catch {
      setLoadError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTranscripts(page, search, filterProcessed);
  }, [page, search, filterProcessed, refreshKey, fetchTranscripts]);

  const handleSearchChange = (value: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(value);
    }, 400);
    setSearchTimeout(timeout);
    setSearch(value);
  };

  const handleToggleProcessed = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/transcripts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_processed: !current }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranscripts((prev) =>
          prev.map((t) => (t.id === id ? data.transcript : t))
        );
      }
    } catch {
      // Network error
    }
  };

  const handleTitleSave = async (id: string) => {
    if (!editingTitleValue.trim()) {
      setEditingTitleId(null);
      return;
    }
    try {
      const res = await fetch(`/api/admin/transcripts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitleValue }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranscripts((prev) =>
          prev.map((t) => (t.id === id ? data.transcript : t))
        );
      }
    } catch {
      // Network error
    }
    setEditingTitleId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/transcripts/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTranscripts((prev) => prev.filter((t) => t.id !== id));
        setTotal((prev) => prev - 1);
      }
    } catch {
      // Network error
    }
    setDeleteConfirm(null);
  };

  const handleModalSaved = (updated: TranscriptRecord) => {
    setTranscripts((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setEditingModal(null);
  };

  const selectClass = 'bg-[#0a0a0a] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] text-sm font-mono focus:outline-none focus:border-[#00ff00]/60';
  const inputClass = 'bg-[#0a0a0a] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] text-sm font-mono placeholder-[#00ff00]/30 focus:outline-none focus:border-[#00ff00]/60';

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input
          type="text"
          placeholder="Search title or content..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`${inputClass} w-64`}
        />
        <select
          value={filterProcessed}
          onChange={(e) => { setPage(1); setFilterProcessed(e.target.value); }}
          className={selectClass}
        >
          <option value="">All Status</option>
          <option value="false">Pending</option>
          <option value="true">Processed</option>
        </select>
      </div>

      {loadError && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm font-mono">
          {loadError}
        </div>
      )}

      <div className="text-[#00ff00]/50 text-sm mb-4">
        {total} transcript{total !== 1 ? 's' : ''} found
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#00ff00]/20">
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal">Title</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal w-24">Status</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal hidden md:table-cell w-28">Created</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal hidden lg:table-cell">Preview</th>
              <th className="text-right py-3 px-2 text-[#00ff00]/60 font-normal w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#00ff00]/40">Loading...</td>
              </tr>
            ) : transcripts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#00ff00]/40">No transcripts found</td>
              </tr>
            ) : (
              transcripts.map((t) => (
                <tr key={t.id} className="border-b border-[#00ff00]/10 hover:bg-[#00ff00]/5">
                  <td className="py-3 px-2">
                    {editingTitleId === t.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingTitleValue}
                          onChange={(e) => setEditingTitleValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTitleSave(t.id);
                            if (e.key === 'Escape') setEditingTitleId(null);
                          }}
                          autoFocus
                          className="bg-[#0a0a0a] border border-[#00ff00]/30 rounded px-2 py-1 text-[#00ff00] text-sm font-mono focus:outline-none flex-1"
                        />
                        <button onClick={() => handleTitleSave(t.id)} className="text-[#00ff00]/60 hover:text-[#00ff00]">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingTitleId(null)} className="text-[#00ff00]/60 hover:text-red-400">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <span
                        className="text-[#00ff00] cursor-pointer hover:underline"
                        onClick={() => {
                          setEditingTitleId(t.id);
                          setEditingTitleValue(t.title);
                        }}
                      >
                        {t.title}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleToggleProcessed(t.id, t.is_processed)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        t.is_processed ? 'bg-[#00ff00]/30' : 'bg-[#00ff00]/10'
                      }`}
                      title={t.is_processed ? 'Processed' : 'Pending'}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                          t.is_processed ? 'translate-x-5 bg-[#00ff00]' : 'translate-x-0.5 bg-[#00ff00]/50'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-2 text-[#00ff00]/50 hidden md:table-cell">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-[#00ff00]/50 text-xs hidden lg:table-cell max-w-xs truncate">
                    {t.transcript_text.substring(0, 100)}
                    {t.transcript_text.length > 100 ? '...' : ''}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingModal(t)}
                        className="p-1 text-[#00ff00]/60 hover:text-[#00ff00]"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      {deleteConfirm === t.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-red-400 text-xs font-mono hover:text-red-300"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-[#00ff00]/60 text-xs font-mono hover:text-[#00ff00]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(t.id)}
                          className="p-1 text-[#00ff00]/60 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
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

      {/* Edit Modal */}
      {editingModal && (
        <TranscriptEditModal
          transcript={editingModal}
          onClose={() => setEditingModal(null)}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  );
}
