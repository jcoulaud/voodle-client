'use client';

import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
      const result = await signIn('custom', {
        email: data.email,
        redirect: false,
      });

      if (result?.error) {
        setError('An error occurred. Please try again.');
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
      <div className='text-center'>
        <h2 className='text-2xl font-semibold mb-4'>Check your email</h2>
        <p>A sign-in link has been sent to your email address.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-md'>
      <div className='relative mt-2 rounded-md shadow-sm'>
        <input
          {...register('email')}
          type='email'
          id='email'
          name='email'
          placeholder='Enter your email'
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby='email-error'
          className={`block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ${
            errors.email
              ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
              : 'ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'
          } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
        />
        {errors.email && (
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
            <ExclamationCircleIcon className='h-5 w-5 text-red-500' aria-hidden='true' />
          </div>
        )}
      </div>
      {errors.email && (
        <p className='mt-2 text-sm text-red-600' id='email-error'>
          {errors.email.message}
        </p>
      )}
      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
      <button
        type='submit'
        disabled={isLoading}
        className='mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'>
        {isLoading ? 'Sending...' : 'Sign In with Email'}
      </button>
    </form>
  );
}
