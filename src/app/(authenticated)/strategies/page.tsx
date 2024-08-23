import CreateNewStrategyCard from '@/app/components/CreateNewStrategyCard';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className='min-h-screen'>
      <div className='w-64 h-64'>
        <CreateNewStrategyCard />
      </div>
    </div>
  );
}
