'use client';

import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { VERIFY_MAGIC_LINK } from '@/app/lib/graphql/mutations/auth';
import { useMutation } from '@apollo/client';
import { CheckCircle, XCircle } from 'lucide-react';
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
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background text-text-body'>
      <Card className='w-full max-w-md'>
        <Card.Content>
          {isVerifying ? (
            <VerifyingState />
          ) : error ? (
            <ErrorState error={error} onRetry={() => router.push('/')} />
          ) : (
            <SuccessState />
          )}
        </Card.Content>
      </Card>
    </div>
  );
}

const VerifyingState = () => (
  <>
    <Card.Title className='text-center mb-4'>Verifying your login...</Card.Title>
    <div className='flex justify-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
    </div>
  </>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <>
    <div className='flex items-center justify-center mb-4'>
      <XCircle className='h-12 w-12 text-error' aria-hidden='true' />
    </div>
    <Card.Title className='text-center mb-4'>Verification Failed</Card.Title>
    <Card.Description className='text-error mb-6 text-center'>{error}</Card.Description>
    <Button onClick={onRetry} variant='primary' size='lg' className='w-full'>
      Return to Home
    </Button>
  </>
);

const SuccessState = () => (
  <>
    <div className='flex items-center justify-center mb-4'>
      <CheckCircle className='h-12 w-12 text-primary' aria-hidden='true' />
    </div>
    <Card.Title className='text-center mb-4'>Verification Successful</Card.Title>
    <Card.Description className='mb-6 text-center'>
      You are being redirected to the dashboard...
    </Card.Description>
  </>
);
