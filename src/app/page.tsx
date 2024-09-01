import Link from 'next/link';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8'>
      <div className='w-full max-w-md'>
        <Card>
          <Card.Header title='YOLOY'>
            <Card.Description className='text-lg text-center'>Trading made easy</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className='flex justify-center'>
              <Link href='/login' passHref>
                <Button variant='primary' size='lg'>
                  Login
                </Button>
              </Link>
            </div>
          </Card.Content>
        </Card>
      </div>
    </main>
  );
}
