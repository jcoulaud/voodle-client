'use client';

import { StrategyForm } from '@/app/components/StrategyForm/StrategyForm';
import { FC } from 'react';

const CreateStrategyPage: FC = () => {
  return (
    <div className='min-h-screen'>
      <h1 className='text-4xl font-bold mb-8 text-text-title'>Create New Strategy</h1>
      <StrategyForm />
    </div>
  );
};

export default CreateStrategyPage;
