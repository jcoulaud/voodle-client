import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className='min-h-screen p-24 bg-background-dark text-gray-200'>
      <h1 className='text-4xl font-bold mb-8 text-accent-400'>Dashboard</h1>
      <p className='text-gray-300'>Welcome, {session.user?.email}</p>
    </div>
  );
}
