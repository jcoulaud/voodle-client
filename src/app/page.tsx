import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import LoginForm from './components/LoginForm';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-background-dark text-gray-200 p-4 sm:p-8'>
      <div className='w-full max-w-md'>
        <h1 className='text-4xl font-bold mb-2 text-center text-accent-400'>YOLOY</h1>
        <p className='text-lg text-center mb-8 text-gray-400'>Trading made easy</p>
        <div className='bg-surface-dark rounded-lg shadow-xl p-6 sm:p-8'>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
