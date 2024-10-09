import LoginForm from '@/app/components/LoginForm';
import { Card } from '@/app/components/ui/Card';

export default async function LoginPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8'>
      <div className='w-full max-w-md'>
        <Card>
          <Card.Content>
            <LoginForm />
          </Card.Content>
        </Card>
      </div>
    </main>
  );
}
