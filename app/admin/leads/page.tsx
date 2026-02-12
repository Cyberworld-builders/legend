import LeadsTable from '@/components/admin/LeadsTable';

export default function AdminLeadsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#00ff00] mb-6">Leads</h1>
      <LeadsTable />
    </div>
  );
}
