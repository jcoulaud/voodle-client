'use client';

import { VERIFY_MAGIC_LINK } from '@/app/lib/graphql/mutations/auth';
import { useMutation } from '@apollo/client';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? null;
  const email = searchParams?.get('email') ?? null;
  const [verifyMagicLink] = useMutation(VERIFY_MAGIC_LINK);
  const [error, setError] = useState<string | null>(null);
  const verifyAttempted = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (verifyAttempted.current || !token || !email) return;
      verifyAttempted.current = true;

      try {
        const { data } = await verifyMagicLink({
          variables: { token, email },
        });

        if (data.verifyMagicLink.success) {
          const result = await signIn('credentials', {
            ...data.verifyMagicLink.session,
            redirect: false,
          });

          if (result?.error) {
            setError('Sign-in failed. Please try again.');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError(data.verifyMagicLink.message);
        }
      } catch (error) {
        setError('Error during verification. Please try again.');
      }
    };

    verifyToken();
  }, [token, email, router, verifyMagicLink]);

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-4'>
        <h1 className='text-2xl font-bold mb-4'>Verification Failed</h1>
        <p className='text-red-500 mb-4'>{error}</p>
        <button
          onClick={() => router.push('/')}
          className='mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'>
          Return to Home
        </button>
      </div>
    );
  }

  return <div>Verifying your login...</div>;
}
