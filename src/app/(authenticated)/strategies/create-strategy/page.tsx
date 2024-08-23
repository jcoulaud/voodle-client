'use client';

import { StrategyCreation } from '@/app/components/StrategyForm/StrategyCreation';
import { FC } from 'react';

const CreateStrategyPage: FC = () => {
  return (
    <div className='min-h-screen'>
      <h1 className='text-4xl font-bold mb-8 text-text-title'>Create New Strategy</h1>
      <StrategyCreation />
    </div>
  );
};

export default CreateStrategyPage;
