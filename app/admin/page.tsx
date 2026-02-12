import Link from 'next/link';
import { createAuthServerClient } from '@/lib/supabase-server';

export default async function AdminDashboardPage() {
  let leadCount = 0;
  let transcriptCount = 0;
  let recentLeads: Array<{ id: string; name: string; email: string; score: number; created_at: string }> = [];
  let recentTranscripts: Array<{ id: string; title: string; is_processed: boolean; created_at: string }> = [];

  try {
    const supabase = await createAuthServerClient();

    const [leadsResult, transcriptsResult, recentLeadsResult, recentTranscriptsResult] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('transcripts').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('id, name, email, score, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('transcripts').select('id, title, is_processed, created_at').order('created_at', { ascending: false }).limit(5),
    ]);

    leadCount = leadsResult.count ?? 0;
    transcriptCount = transcriptsResult.count ?? 0;
    recentLeads = recentLeadsResult.data ?? [];
    recentTranscripts = recentTranscriptsResult.data ?? [];
  } catch {
    // Supabase may not be running
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#00ff00] mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
          <p className="text-[#00ff00]/50 text-sm">Total Leads</p>
          <p className="text-3xl font-bold text-[#00ff00] mt-2">{leadCount}</p>
          <Link href="/admin/leads" className="text-[#00ff00]/70 text-sm hover:text-[#00ff00] mt-4 inline-block">
            View all &rarr;
          </Link>
        </div>
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
          <p className="text-[#00ff00]/50 text-sm">Total Transcripts</p>
          <p className="text-3xl font-bold text-[#00ff00] mt-2">{transcriptCount}</p>
          <Link href="/admin/transcripts" className="text-[#00ff00]/70 text-sm hover:text-[#00ff00] mt-4 inline-block">
            View all &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#00ff00] mb-4">Recent Leads</h2>
          {recentLeads.length === 0 ? (
            <p className="text-[#00ff00]/40 text-sm">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded hover:bg-[#00ff00]/5 transition-colors"
                >
                  <div>
                    <p className="text-[#00ff00] text-sm">{lead.name}</p>
                    <p className="text-[#00ff00]/40 text-xs">{lead.email}</p>
                  </div>
                  <span className="text-[#00ff00]/60 text-xs">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transcripts */}
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#00ff00] mb-4">Recent Transcripts</h2>
          {recentTranscripts.length === 0 ? (
            <p className="text-[#00ff00]/40 text-sm">No transcripts yet</p>
          ) : (
            <div className="space-y-3">
              {recentTranscripts.map((transcript) => (
                <div
                  key={transcript.id}
                  className="flex items-center justify-between py-2 px-3 rounded"
                >
                  <div>
                    <p className="text-[#00ff00] text-sm">{transcript.title}</p>
                    <p className="text-[#00ff00]/40 text-xs">
                      {transcript.is_processed ? 'Processed' : 'Pending'}
                    </p>
                  </div>
                  <span className="text-[#00ff00]/60 text-xs">
                    {new Date(transcript.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
