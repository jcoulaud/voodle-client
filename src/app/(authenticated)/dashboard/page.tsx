import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  console.log('session', session);

  if (!session) {
    redirect('/');
  }

  return <div className='min-h-screen'></div>;
}
