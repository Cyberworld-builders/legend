'use client';

import { useState } from 'react';
import TranscriptSubmitForm from '@/components/admin/TranscriptSubmitForm';
import TranscriptsTable from '@/components/admin/TranscriptsTable';

export default function AdminTranscriptsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#00ff00] mb-6">Transcripts</h1>

      <div className="mb-8">
        <TranscriptSubmitForm onCreated={() => setRefreshKey((k) => k + 1)} />
      </div>

      <TranscriptsTable refreshKey={refreshKey} />
    </div>
  );
}
