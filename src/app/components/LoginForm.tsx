'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('custom-email', {
        email: data.email,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
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
      <Input
        {...register('email')}
        type='email'
        id='email'
        name='email'
        placeholder='Enter your email'
        error={errors.email?.message}
      />
      {error && <p className='mt-2 text-sm text-error'>{error}</p>}
      <button
        type='submit'
        disabled={isLoading}
        className='mt-4 w-full bg-primary text-background py-2 px-4 rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'>
        {isLoading ? 'Sending...' : 'Sign In'}
      </button>
    </form>
  );
}
