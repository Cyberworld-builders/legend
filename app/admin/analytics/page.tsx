import { createAuthServerClient } from '@/lib/supabase-server';

const PAGE_SIZE = 1000; // Supabase default limit; paginate to avoid truncation

/** Fetches all rows by paginating through results to avoid 1000-row truncation. */
async function fetchAllRows<T>(
  runQuery: (from: number, to: number) => Promise<{ data: T[] | null; error?: { message: string } | null }>
): Promise<T[]> {
  const all: T[] = [];
  let from = 0;
  while (true) {
    const to = from + PAGE_SIZE - 1;
    const res = await runQuery(from, to);
    if (res.error) throw res.error;
    const data = res.data;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
}

interface SectionCount {
  section: string;
  count: number;
}

interface DepthCount {
  depth: number;
  count: number;
}

interface CTACount {
  cta: string;
  count: number;
}

interface VariantStats {
  variant: string;
  sessions: number;
  cta_clicks: number;
  leads: number;
}

async function getAnalyticsData(days: number) {
  const supabase = await createAuthServerClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();

  // Total sessions
  const { count: totalSessions } = await supabase
    .from('page_events')
    .select('session_id', { count: 'exact', head: true })
    .eq('event_name', 'page_view')
    .gte('created_at', sinceISO);

  // Unique sessions (paginate to avoid 1000-row limit)
  const uniqueSessionsData = await fetchAllRows<{ session_id: string }>(async (from, to) => {
    const r = await supabase
      .from('page_events')
      .select('session_id')
      .gte('created_at', sinceISO)
      .range(from, to);
    return { data: r.data, error: r.error };
  });
  const uniqueSessions = new Set(uniqueSessionsData.map((r) => r.session_id)).size;

  // Section visibility counts (with session_ids for dedup; paginate to avoid 1000-row limit)
  const sectionCounts: Record<string, Set<string>> = {};
  const sectionWithSessions = await fetchAllRows<{ session_id: string; event_data: unknown }>(async (from, to) => {
    const r = await supabase
      .from('page_events')
      .select('session_id, event_data')
      .eq('event_name', 'section_visible')
      .gte('created_at', sinceISO)
      .range(from, to);
    return { data: r.data, error: r.error };
  });

  if (sectionWithSessions.length > 0) {
    for (const row of sectionWithSessions) {
      const section = (row.event_data as Record<string, unknown>)?.section as string;
      if (section) {
        if (!sectionCounts[section]) sectionCounts[section] = new Set();
        sectionCounts[section].add(row.session_id);
      }
    }
  }

  const sections: SectionCount[] = ['hero', 'services', 'proof', 'about', 'contact', 'faq'].map(
    (s) => ({ section: s, count: sectionCounts[s]?.size ?? 0 })
  );

  // Scroll depth counts (paginate to avoid 1000-row limit)
  const depthData = await fetchAllRows<{ session_id: string; event_data: unknown }>(async (from, to) => {
    const r = await supabase
      .from('page_events')
      .select('session_id, event_data')
      .eq('event_name', 'scroll_depth')
      .gte('created_at', sinceISO)
      .range(from, to);
    return { data: r.data, error: r.error };
  });

  const depthSessions: Record<number, Set<string>> = { 25: new Set(), 50: new Set(), 75: new Set(), 100: new Set() };
  if (depthData.length > 0) {
    for (const row of depthData) {
      const depth = (row.event_data as Record<string, unknown>)?.depth as number;
      if (depth && depthSessions[depth]) {
        depthSessions[depth].add(row.session_id);
      }
    }
  }

  const depths: DepthCount[] = [25, 50, 75, 100].map((d) => ({
    depth: d,
    count: depthSessions[d]?.size ?? 0,
  }));

  // CTA clicks (paginate to avoid 1000-row limit)
  const ctaData = await fetchAllRows<{ event_data: unknown }>(async (from, to) => {
    const r = await supabase
      .from('page_events')
      .select('event_data')
      .eq('event_name', 'cta_click')
      .gte('created_at', sinceISO)
      .range(from, to);
    return { data: r.data, error: r.error };
  });

  const ctaCounts: Record<string, number> = {};
  if (ctaData.length > 0) {
    for (const row of ctaData) {
      const cta = (row.event_data as Record<string, unknown>)?.cta as string;
      if (cta) ctaCounts[cta] = (ctaCounts[cta] || 0) + 1;
    }
  }

  const ctas: CTACount[] = Object.entries(ctaCounts).map(([cta, count]) => ({ cta, count }));

  // Lead submits
  const { count: leadSubmits } = await supabase
    .from('page_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_name', 'lead_submit')
    .gte('created_at', sinceISO);

  // A/B test variant stats (paginate to avoid 1000-row limit)
  const variantData = await fetchAllRows<{ session_id: string; variant: string; event_name: string }>(async (from, to) => {
    const r = await supabase
      .from('page_events')
      .select('session_id, variant, event_name')
      .not('variant', 'is', null)
      .gte('created_at', sinceISO)
      .range(from, to);
    return { data: r.data, error: r.error };
  });

  const variantMap: Record<string, { sessions: Set<string>; cta_clicks: number; leads: number }> = {};
  if (variantData.length > 0) {
    for (const row of variantData) {
      const v = row.variant!;
      if (!variantMap[v]) variantMap[v] = { sessions: new Set(), cta_clicks: 0, leads: 0 };
      variantMap[v].sessions.add(row.session_id);
      if (row.event_name === 'cta_click') variantMap[v].cta_clicks++;
      if (row.event_name === 'lead_submit') variantMap[v].leads++;
    }
  }

  const variants: VariantStats[] = Object.entries(variantMap).map(([variant, stats]) => ({
    variant,
    sessions: stats.sessions.size,
    cta_clicks: stats.cta_clicks,
    leads: stats.leads,
  }));

  return {
    totalSessions: totalSessions ?? 0,
    uniqueSessions,
    sections,
    depths,
    ctas,
    leadSubmits: leadSubmits ?? 0,
    variants,
  };
}

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 text-[#00ff00]/70 text-right">{label}</span>
      <div className="flex-1 bg-[#1a1a1a] rounded h-6 overflow-hidden border border-[#00ff00]/10">
        <div
          className="h-full bg-[#00ff00]/30 rounded"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-16 text-[#00ff00]/60 text-right">
        {value} ({pct}%)
      </span>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = parseInt(params.days || '7', 10);

  let data;
  try {
    data = await getAnalyticsData(days);
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#00ff00] mb-4">Analytics</h1>
        <p className="text-[#00ff00]/50">Unable to load analytics. Ensure Supabase is running and the page_events table exists.</p>
      </div>
    );
  }

  const ctaClickTotal = data.ctas.reduce((sum, c) => sum + c.count, 0);
  const ctaRate = data.uniqueSessions > 0 ? ((ctaClickTotal / data.uniqueSessions) * 100).toFixed(1) : '0';
  const convRate = data.uniqueSessions > 0 ? ((data.leadSubmits / data.uniqueSessions) * 100).toFixed(1) : '0';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#00ff00]">Analytics</h1>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <a
              key={d}
              href={`/admin/analytics?days=${d}`}
              className={`px-3 py-1 text-sm rounded border transition-colors ${
                days === d
                  ? 'bg-[#00ff00]/20 border-[#00ff00] text-[#00ff00]'
                  : 'border-[#00ff00]/20 text-[#00ff00]/60 hover:border-[#00ff00]/40'
              }`}
            >
              {d}d
            </a>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-[#00ff00]/50 text-xs">Sessions</p>
          <p className="text-2xl font-bold text-[#00ff00] mt-1">{data.uniqueSessions}</p>
        </div>
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-[#00ff00]/50 text-xs">Page Views</p>
          <p className="text-2xl font-bold text-[#00ff00] mt-1">{data.totalSessions}</p>
        </div>
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-[#00ff00]/50 text-xs">CTA Click Rate</p>
          <p className="text-2xl font-bold text-[#00ff00] mt-1">{ctaRate}%</p>
        </div>
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-[#00ff00]/50 text-xs">Lead Conv. Rate</p>
          <p className="text-2xl font-bold text-[#00ff00] mt-1">{convRate}%</p>
        </div>
      </div>

      {/* Section Visibility Funnel */}
      <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#00ff00] mb-4">Section Visibility Funnel</h2>
        {data.uniqueSessions === 0 ? (
          <p className="text-[#00ff00]/40 text-sm">No data yet</p>
        ) : (
          <div className="space-y-2">
            {data.sections.map((s) => (
              <Bar key={s.section} value={s.count} max={data.uniqueSessions} label={s.section} />
            ))}
          </div>
        )}
      </div>

      {/* Scroll Depth Distribution */}
      <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#00ff00] mb-4">Scroll Depth Distribution</h2>
        {data.uniqueSessions === 0 ? (
          <p className="text-[#00ff00]/40 text-sm">No data yet</p>
        ) : (
          <div className="space-y-2">
            {data.depths.map((d) => (
              <Bar key={d.depth} value={d.count} max={data.uniqueSessions} label={`${d.depth}%`} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Performance */}
      <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#00ff00] mb-4">CTA Performance</h2>
        {data.ctas.length === 0 ? (
          <p className="text-[#00ff00]/40 text-sm">No CTA clicks yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#00ff00]/50 border-b border-[#00ff00]/10">
                <th className="text-left py-2">CTA</th>
                <th className="text-right py-2">Clicks</th>
                <th className="text-right py-2">Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.ctas.map((c) => (
                <tr key={c.cta} className="border-b border-[#00ff00]/5">
                  <td className="py-2 text-[#00ff00]">{c.cta}</td>
                  <td className="py-2 text-right text-[#00ff00]/70">{c.count}</td>
                  <td className="py-2 text-right text-[#00ff00]/70">
                    {data.uniqueSessions > 0
                      ? ((c.count / data.uniqueSessions) * 100).toFixed(1)
                      : '0'}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Leads */}
      <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#00ff00] mb-2">Lead Submissions</h2>
        <p className="text-3xl font-bold text-[#00ff00]">{data.leadSubmits}</p>
        <p className="text-xs text-[#00ff00]/50 mt-1">last {days} days</p>
      </div>

      {/* A/B Test Results */}
      {data.variants.length > 0 && (
        <div className="border border-[#00ff00]/20 bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#00ff00] mb-4">
            A/B Test: Hero Headline (hero_headline_v1)
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#00ff00]/50 border-b border-[#00ff00]/10">
                <th className="text-left py-2">Variant</th>
                <th className="text-right py-2">Sessions</th>
                <th className="text-right py-2">CTA Clicks</th>
                <th className="text-right py-2">Leads</th>
                <th className="text-right py-2">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.variants.map((v) => (
                <tr key={v.variant} className="border-b border-[#00ff00]/5">
                  <td className="py-2 text-[#00ff00] font-bold">Variant {v.variant}</td>
                  <td className="py-2 text-right text-[#00ff00]/70">{v.sessions}</td>
                  <td className="py-2 text-right text-[#00ff00]/70">{v.cta_clicks}</td>
                  <td className="py-2 text-right text-[#00ff00]/70">{v.leads}</td>
                  <td className="py-2 text-right text-[#00ff00]/70">
                    {v.sessions > 0 ? ((v.leads / v.sessions) * 100).toFixed(1) : '0'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
