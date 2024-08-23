import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import LoginForm from './components/LoginForm';
import { Card } from './components/ui/Card';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8'>
      <div className='w-full max-w-md'>
        <Card>
          <Card.Header>
            <Card.Title className='text-4xl font-bold text-center text-primary'>YOLOY</Card.Title>
            <Card.Description className='text-lg text-center'>Trading made easy</Card.Description>
          </Card.Header>
          <Card.Content>
            <LoginForm />
          </Card.Content>
        </Card>
      </div>
    </main>
  );
}
