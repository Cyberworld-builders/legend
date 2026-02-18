import ChatsTable from '@/components/admin/ChatsTable';

export default function AdminChatsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#00ff00] mb-6">Chats</h1>
      <ChatsTable />
    </div>
  );
}
