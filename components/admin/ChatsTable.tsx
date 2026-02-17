'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ChatSessionRecord } from '@/types/chats';
import { computeExtractionOrder } from '@/lib/chat-extraction-order';

const selectClass =
  'bg-[#0a0a0a] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] text-sm font-mono focus:outline-none focus:border-[#00ff00]/60';
const inputClass =
  'bg-[#0a0a0a] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] text-sm font-mono placeholder-[#00ff00]/30 focus:outline-none focus:border-[#00ff00]/60';

interface ChatDetailPanelProps {
  chat: ChatSessionRecord;
}

function ChatDetailPanel({ chat }: ChatDetailPanelProps) {
  const extractionOrder = computeExtractionOrder(chat.messages ?? []);
  const extractionByField: Record<string, { value: string; messageIndex: number } | null> = {
    name: extractionOrder.find((e) => e.field === 'name') ?? null,
    email: extractionOrder.find((e) => e.field === 'email') ?? null,
    phone: extractionOrder.find((e) => e.field === 'phone') ?? null,
  };

  let userMsgIndex = -1;
  const messagesWithUserIndex = (chat.messages ?? []).map((msg) => {
    if (msg.role === 'user') userMsgIndex += 1;
    return { ...msg, userMsgIndex: msg.role === 'user' ? userMsgIndex : -1 };
  });

  return (
    <tr>
      <td colSpan={6} className="p-0">
        <div className="border-l-2 border-[#00ff00]/30 bg-[#0a0a0a] p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Extraction Order */}
            <div className="border border-[#00ff00]/20 rounded-lg p-4">
              <h3 className="text-sm font-bold text-[#00ff00] mb-3">Extraction Order</h3>
              <ol className="space-y-2 text-sm">
                {(['name', 'email', 'phone'] as const).map((field, idx) => {
                  const entry = extractionByField[field];
                  return (
                    <li key={field} className="text-[#00ff00]/80">
                      {idx + 1}. {field}:
                      {entry ? (
                        <span className="ml-2">
                          <span className="text-[#00ff00]">{entry.value}</span>
                          <span className="text-[#00ff00]/50 text-xs ml-1">
                            (User msg #{entry.messageIndex + 1})
                          </span>
                        </span>
                      ) : (
                        <span className="text-[#00ff00]/40 ml-2">—</span>
                      )}
                    </li>
                  );
                })}
              </ol>
              <div className="mt-3 pt-3 border-t border-[#00ff00]/10 text-xs text-[#00ff00]/50">
                <p>Page: {chat.page ?? '—'}</p>
                <p className="font-mono truncate">Session: {chat.session_id}</p>
              </div>
            </div>

            {/* Raw Transcript */}
            <div className="border border-[#00ff00]/20 rounded-lg p-4">
              <h3 className="text-sm font-bold text-[#00ff00] mb-3">Conversation Transcript</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {messagesWithUserIndex.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-sm ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <span
                      className={`inline-block px-2 py-1.5 rounded-lg max-w-full ${
                        msg.role === 'user'
                          ? 'bg-[#00ff00]/20 text-[#00ff00] ml-auto'
                          : 'bg-[#1a1a1a] text-[#00ff00]/80'
                      }`}
                    >
                      <span className="text-[#00ff00]/40 text-xs mr-1">
                        [{i + 1}]
                        {msg.role === 'user' && msg.userMsgIndex >= 0 && (
                          <> User #{msg.userMsgIndex + 1}</>
                        )}
                        {msg.role === 'bot' && ' Bot'}
                        {':'}
                      </span>
                      {msg.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function ChatsTable() {
  const [chats, setChats] = useState<ChatSessionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchChats = useCallback(async (currentPage: number, currentFilters: typeof filters) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('pageSize', '20');
    if (currentFilters.status) params.set('status', currentFilters.status);
    if (currentFilters.search) params.set('search', currentFilters.search);
    params.set('sortBy', currentFilters.sortBy);
    params.set('sortOrder', currentFilters.sortOrder);

    try {
      const res = await fetch(`/api/admin/chats?${params.toString()}`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok) {
        setChats(data.chats ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch {
      /* Network error */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats(page, filters);
  }, [page, filters, fetchChats]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'search') {
      if (searchTimeout) clearTimeout(searchTimeout);
      const timeout = setTimeout(() => {
        setPage(1);
        setFilters((prev) => ({ ...prev, search: value }));
      }, 400);
      setSearchTimeout(timeout);
      setFilters((prev) => ({ ...prev, search: value }));
      return;
    }
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input
          type="text"
          placeholder="Search email, name, phone..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className={`${inputClass} w-64`}
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className={selectClass}
        >
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="abandoned">Abandoned</option>
          <option value="converted">Converted</option>
        </select>
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [string, string];
            setPage(1);
            setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
          }}
          className={selectClass}
        >
          <option value="created_at-desc">Newest first</option>
          <option value="created_at-asc">Oldest first</option>
          <option value="message_count-asc">Fewest messages (bounces)</option>
          <option value="message_count-desc">Most messages</option>
        </select>
      </div>

      <div className="mt-4 text-[#00ff00]/50 text-sm">
        {total} chat{total !== 1 ? 's' : ''} found
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#00ff00]/20">
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal w-8"></th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal">Status</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal">Msgs</th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal hidden md:table-cell">
                Email / Name
              </th>
              <th className="text-left py-3 px-2 text-[#00ff00]/60 font-normal hidden md:table-cell">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#00ff00]/40">
                  Loading...
                </td>
              </tr>
            ) : chats.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#00ff00]/40">
                  No chats found
                </td>
              </tr>
            ) : (
              chats.flatMap((chat) => [
                <tr
                  key={chat.id}
                  className="border-b border-[#00ff00]/10 hover:bg-[#00ff00]/5 cursor-pointer"
                  onClick={() => toggleExpanded(chat.id)}
                >
                  <td className="py-3 px-2">
                    {expandedId === chat.id ? (
                      <ChevronDown size={18} className="text-[#00ff00]/60" />
                    ) : (
                      <ChevronRight size={18} className="text-[#00ff00]/60" />
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-mono ${
                        chat.status === 'converted'
                          ? 'bg-[#00ff00]/20 text-[#00ff00]'
                          : chat.status === 'abandoned'
                            ? 'bg-[#00ff00]/10 text-[#00ff00]/60'
                            : 'bg-[#00ff00]/10 text-[#00ff00]/80'
                      }`}
                    >
                      {chat.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-[#00ff00]">{chat.message_count}</td>
                  <td className="py-3 px-2 text-[#00ff00]/70 hidden md:table-cell">
                    {chat.extracted_email ?? chat.extracted_name ?? '—'}
                  </td>
                  <td className="py-3 px-2 text-[#00ff00]/50 hidden md:table-cell">
                    {new Date(chat.created_at).toLocaleDateString()}
                  </td>
                </tr>,
                expandedId === chat.id ? (
                  <ChatDetailPanel key={`${chat.id}-detail`} chat={chat} />
                ) : null,
              ])
            )}
          </tbody>
        </table>
      </div>

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
