import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className='min-h-screen p-24'>
      <h1 className='text-4xl font-bold mb-8'>Dashboard</h1>
      <p>Welcome, {session.user?.email}</p>
    </div>
  );
}
