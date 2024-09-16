'use client';

import { StrategyCreation } from '@/app/components/StrategyForm/StrategyCreation';
import { PageHeader } from '@/app/components/ui';
import { FC } from 'react';

const CreateStrategyPage: FC = () => {
  return (
    <>
      <PageHeader
        title='Create New Strategy'
        description='Fill in the form to create a new strategy based on your preferences.'
      />

      <StrategyCreation />
    </>
    // <div className='min-h-screen'>
    //   <h1 className='text-4xl font-bold mb-8 text-text-title'>Create New Strategy</h1>
    //   <StrategyCreation />
    // </div>
  );
};

export default CreateStrategyPage;
