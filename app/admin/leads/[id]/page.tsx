import { createAuthServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import LeadDetailCard from '@/components/admin/LeadDetailCard';

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAuthServerClient();

  const [leadResult, eventsResult] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).single(),
    supabase.from('lead_events').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
  ]);

  if (leadResult.error || !leadResult.data) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#00ff00] mb-6">Lead: {leadResult.data.name}</h1>
      <LeadDetailCard lead={leadResult.data} events={eventsResult.data ?? []} />
    </div>
  );
}
