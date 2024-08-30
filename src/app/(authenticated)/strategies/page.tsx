'use client';

import { Toggle } from '@/app/components/ui';
import { GET_USER_STRATEGIES } from '@/app/lib/graphql/queries/strategy';
import { UserStrategy } from '@/types';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import CreateNewStrategyCard from './CreateNewStrategyCard';
import StrategyCard from './StrategyCard';

export default function StrategiesPage() {
  const [showInactive, setShowInactive] = useState(false);
  const { loading, error, data } = useQuery(GET_USER_STRATEGIES);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const strategies = data?.userStrategies || [];
  const filteredStrategies = showInactive
    ? strategies
    : strategies.filter((s: UserStrategy) => s.isActive);

  return (
    <div className='min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>My Strategies</h1>
        <Toggle
          enabled={showInactive}
          setEnabled={setShowInactive}
          label='Show Inactive Strategies'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <CreateNewStrategyCard />
        {filteredStrategies.map((strategy: UserStrategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  );
}
