'use client';

import { LoadingSpinner } from '@/app/components/ui';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { EDIT_USER, ME } from '@/app/lib/graphql/queries/user';
import { useUser } from '@/hooks/useUser';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type FormData = {
  username: string;
};

export default function ProfilePage() {
  const { user, isLoading, error } = useUser();
  const [editUser] = useMutation(EDIT_USER);
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  if (isLoading) return <LoadingSpinner size={48} className='h-screen' />;
  if (error || !user) return <div className='text-red-500'>Error: {error?.message}</div>;

  const onSubmit = async (formData: FormData) => {
    try {
      await editUser({
        variables: { input: formData },
        refetchQueries: [{ query: ME }],
      });
      toast.success('Username updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update username');
    }
  };

  return (
    <>
      <div className='px-4 sm:px-0'>
        <h1 className='text-2xl font-semibold text-gray-900'>Profile</h1>
        <p className='mt-1 text-sm text-gray-600'>
          Manage your personal information and account settings.
        </p>
      </div>
      <div className='mt-6 border-t border-gray-100'>
        <dl className='divide-y divide-gray-100'>
          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm font-medium leading-6 text-text-title sm:pt-2'>Username</dt>
            <dd className='mt-1 text-sm leading-6 text-text-body sm:col-span-2 sm:mt-0'>
              {isEditing ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='flex flex-col sm:flex-row sm:items-start'>
                  <div className='flex-grow'>
                    <Controller
                      name='username'
                      control={control}
                      defaultValue={user.username}
                      rules={{ required: true, minLength: 3, maxLength: 30 }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          error={errors.username && 'Username must be between 3 and 30 characters'}
                        />
                      )}
                    />
                  </div>
                  <div className='flex justify-end space-x-2 mt-2 sm:mt-0 sm:ml-4'>
                    <Button type='button' variant='ghost' onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type='submit' variant='primary'>
                      Save
                    </Button>
                  </div>
                </form>
              ) : (
                <div className='flex items-center justify-between'>
                  <span>{user.username}</span>
                  <Button type='button' variant='ghost' onClick={() => setIsEditing(true)}>
                    Update
                  </Button>
                </div>
              )}
            </dd>
          </div>
          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm font-medium leading-6 text-gray-900 sm:pt-2'>Email address</dt>
            <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 sm:pt-2'>
              {user.email}
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
