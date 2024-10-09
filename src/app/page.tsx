import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/logo-with-name.png';
import { Button } from './components/ui/Button';

export default function Home() {
  return (
    <div className='bg-background min-h-screen flex flex-col justify-center'>
      <div className='relative isolate px-6 py-24 lg:px-8'>
        <div
          aria-hidden='true'
          className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
          />
        </div>
        <div className='mx-auto max-w-2xl text-center'>
          <div className='mb-8'>
            <Image
              src={logo}
              alt='Voodle Logo'
              width={200}
              height={200}
              priority
              className='mx-auto'
            />
          </div>
          <h2 className='text-sm tracking-tight text-foreground'>
            (Beta version. TON supported. Solana and Ethereum coming soon)
          </h2>
          <p className='mt-6 text-lg leading-8 text-muted-foreground'>
            Voodle makes crypto trading easy. No jargon, no charts—just customizable rules like
            &quot;Invest $5 in tokens with &apos;Dog&apos; in the name&quot; and automatic trades
            based on clear conditions. Manage your strategies and track performance from an
            intuitive dashboard. No trading experience needed.
          </p>
          <div className='mt-10 flex items-center justify-center'>
            <Link href='/login' passHref>
              <Button variant='primary' size='lg'>
                Get started
              </Button>
            </Link>
          </div>
        </div>
        <div
          aria-hidden='true'
          className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
          />
        </div>
      </div>
    </div>
  );
}
