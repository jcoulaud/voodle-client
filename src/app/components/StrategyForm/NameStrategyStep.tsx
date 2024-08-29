import { Button, Input } from '@/app/components/ui';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StrategyFormData } from './strategySchema';

interface NameStrategyStepProps {
  onNext: () => void;
}

export const NameStrategyStep: React.FC<NameStrategyStepProps> = ({ onNext }) => {
  const {
    control,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<StrategyFormData>();

  const name = watch('name');

  const handleNext = async () => {
    const isValid = await trigger('name');
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-900'>Name Your Strategy</h2>
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <Input
            id='strategy-name'
            label='Strategy Name'
            type='text'
            placeholder='Enter a name for your strategy'
            {...field}
            onChange={(value) => field.onChange(value)}
            value={field.value}
            error={errors.name?.message}
          />
        )}
      />
      <div className='flex justify-end'>
        <Button onClick={handleNext} disabled={!name || !!errors.name} variant='primary'>
          Next: Buy Strategy
        </Button>
      </div>
    </div>
  );
};
