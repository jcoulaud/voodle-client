'use client';

import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const CreateNewStrategyCard: FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/strategies/create-strategy');
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className='relative block w-full h-full rounded-lg border-2 border-dashed border-secondary p-12 text-center hover:border-secondary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark transition-colors'>
      <PlusIcon className='mx-auto h-12 w-12 text-gray-400' strokeWidth={1} />
      <span className='mt-2 block text-sm font-semibold text-text-title'>Create New Strategy</span>
    </button>
  );
};

export default CreateNewStrategyCard;
