'use client';

import { SEND_MAGIC_LINK } from '@/app/lib/graphql/mutations/auth';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from './ui/Input';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sendMagicLink] = useMutation(SEND_MAGIC_LINK);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMagicLink({ variables: { email: data.email } });

      if (result.data?.sendMagicLink.success) {
        setSuccess(true);
      } else {
        setError(result.data?.sendMagicLink.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error('Signin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className='text-center text-text-body'>
        <h2 className='text-2xl font-semibold mb-4 text-text-title'>Check your email</h2>
        <p>A sign-in link has been sent to your email address.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-md'>
      <Controller
        name='email'
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type='email'
            id='email'
            placeholder='Enter your email'
            error={errors.email?.message}
          />
        )}
      />
      {error && <p className='mt-2 text-sm text-error'>{error}</p>}
      <button
        type='submit'
        disabled={isLoading}
        className='mt-4 w-full bg-primary text-background py-2 px-4 rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'>
        {isLoading ? 'Sending...' : 'Receive sign-in link'}
      </button>
    </form>
  );
}
