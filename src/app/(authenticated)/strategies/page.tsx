'use client';

import { LoadingSpinner, Toggle } from '@/app/components/ui';
import { EDIT_STRATEGY } from '@/app/lib/graphql/mutations/strategy';
import { GET_USER_STRATEGIES } from '@/app/lib/graphql/queries/strategy';
import { UserStrategy } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import CreateNewStrategyCard from './CreateNewStrategyCard';
import StrategyCard from './StrategyCard';

export default function StrategiesPage() {
  const [showInactive, setShowInactive] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_USER_STRATEGIES);
  const [editStrategy] = useMutation(EDIT_STRATEGY);

  const strategies = data?.userStrategies || [];
  const filteredStrategies = showInactive
    ? strategies
    : strategies.filter((s: UserStrategy) => s.isActive);

  const handlePause = (id: number, isActive: boolean) => {
    toast.promise(
      editStrategy({
        variables: {
          input: {
            id,
            isActive,
          },
        },
      }).then(() => refetch()),
      {
        loading: `${isActive ? 'Activating' : 'Pausing'} strategy...`,
        success: `Strategy ${isActive ? 'activated' : 'paused'} successfully!`,
        error: (error) => `Failed to ${isActive ? 'activate' : 'pause'} strategy: ${error.message}`,
      },
    );
  };

  const handleRename = (id: number, newName: string) => {
    toast.promise(
      editStrategy({
        variables: {
          input: {
            id,
            name: newName,
          },
        },
      }).then(() => refetch()),
      {
        loading: 'Renaming strategy...',
        success: 'Strategy renamed successfully!',
        error: (error) => `Failed to rename strategy: ${error.message}`,
      },
    );
  };

  if (loading) return <LoadingSpinner size={48} className='h-screen' />;
  if (error) return <div className='text-red-500'>Error: {error.message}</div>;

  return (
    <>
      <div className='px-4 sm:px-0 mb-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>Strategies</h1>
        <div className='mt-1 flex items-center justify-between'>
          <p className='text-sm text-gray-600'>
            See all your strategies here. You can pause or rename them at any time.
          </p>
          <Toggle
            enabled={showInactive}
            setEnabled={setShowInactive}
            label='Show Inactive Strategies'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <CreateNewStrategyCard />
        {filteredStrategies.map((strategy: UserStrategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onPause={handlePause}
            onRename={handleRename}
          />
        ))}
      </div>
    </>
  );
}
