'use client';

import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { useAuth } from '@/app/providers/AuthProvider';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

type VerificationStatus = 'verifying' | 'success' | 'error';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const VERIFICATION_STATES = {
  VERIFYING: 'verifying',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

const decodeEmail = (email: string): string => {
  try {
    const emailWithPlus = email.replace(/ /g, '+');
    return decodeURIComponent(emailWithPlus);
  } catch (error) {
    console.error('Error decoding email:', error);
    return email;
  }
};

const VerifyPage: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>(VERIFICATION_STATES.VERIFYING);
  const [error, setError] = useState<string | null>(null);
  const { verifyMagicLink } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams?.get('token');
      const encodedEmail = searchParams?.get('email');

      if (!token || !encodedEmail) {
        setStatus(VERIFICATION_STATES.ERROR);
        setError('Missing token or email in URL parameters.');
        return;
      }

      const email = decodeEmail(encodedEmail);

      try {
        await verifyMagicLink(token, email);
        setStatus(VERIFICATION_STATES.SUCCESS);
        setTimeout(() => router.push('/dashboard'), 2000);
      } catch (err) {
        console.error('Verification error:', err);
        setStatus(VERIFICATION_STATES.ERROR);
        setError('Error during verification. Please try again.');
      }
    };

    verifyToken();
  }, [searchParams, router, verifyMagicLink]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background text-text-body'>
      <Card className='w-full max-w-md'>
        <Card.Content>
          {status === VERIFICATION_STATES.VERIFYING && <VerifyingState />}
          {status === VERIFICATION_STATES.ERROR && (
            <ErrorState
              error={error || 'Unknown error occurred'}
              onRetry={() => router.push('/')}
            />
          )}
          {status === VERIFICATION_STATES.SUCCESS && <SuccessState />}
        </Card.Content>
      </Card>
    </div>
  );
};

const VerifyingState: FC = () => (
  <>
    <Card.Title className='text-center mb-4'>Verifying your login...</Card.Title>
    <div className='flex justify-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary' />
    </div>
  </>
);

const ErrorState: FC<ErrorStateProps> = ({ error, onRetry }) => (
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

const SuccessState: FC = () => (
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

export default VerifyPage;
