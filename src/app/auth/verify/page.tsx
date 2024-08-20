'use client';

import { VERIFY_MAGIC_LINK } from '@/app/lib/graphql/mutations/auth';
import { useMutation } from '@apollo/client';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface VerifyMagicLinkResponse {
  verifyMagicLink: {
    success: boolean;
    message: string;
    session?: Record<string, unknown>;
  };
}

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? null;
  const email = searchParams?.get('email') ?? null;
  const [verifyMagicLink] = useMutation<VerifyMagicLinkResponse>(VERIFY_MAGIC_LINK);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const verifyAttempted = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (verifyAttempted.current || !token || !email) return;
      verifyAttempted.current = true;

      try {
        const { data } = await verifyMagicLink({
          variables: { token, email },
        });

        if (data?.verifyMagicLink.success) {
          const result = await signIn('credentials', {
            email,
            token,
            redirect: false,
          });

          if (result?.error) {
            setError('Sign-in failed. Please try again.');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError(data?.verifyMagicLink.message || 'Verification failed');
        }
      } catch (error) {
        setError('Error during verification. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, email, router, verifyMagicLink]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background-dark text-gray-200'>
      <div className='w-full max-w-md bg-surface-dark rounded-lg shadow-xl p-8'>
        {isVerifying ? (
          <VerifyingState />
        ) : error ? (
          <ErrorState error={error} onRetry={() => router.push('/')} />
        ) : (
          <SuccessState />
        )}
      </div>
    </div>
  );
}

const VerifyingState = () => (
  <>
    <h1 className='text-2xl font-bold mb-4 text-center'>Verifying your login...</h1>
    <div className='flex justify-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-400'></div>
    </div>
  </>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <>
    <div className='flex items-center justify-center mb-4'>
      <ExclamationCircleIcon className='h-12 w-12 text-red-500' aria-hidden='true' />
    </div>
    <h1 className='text-2xl font-bold mb-4 text-center'>Verification Failed</h1>
    <p className='text-red-400 mb-6 text-center'>{error}</p>
    <button
      onClick={onRetry}
      className='w-full bg-accent-600 text-white py-2 px-4 rounded-md hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-background-dark transition-colors'>
      Return to Home
    </button>
  </>
);

const SuccessState = () => (
  <>
    <div className='flex items-center justify-center mb-4'>
      <CheckCircleIcon className='h-12 w-12 text-green-500' aria-hidden='true' />
    </div>
    <h1 className='text-2xl font-bold mb-4 text-center'>Verification Successful</h1>
    <p className='text-gray-400 mb-6 text-center'>You are being redirected to the dashboard...</p>
  </>
);
