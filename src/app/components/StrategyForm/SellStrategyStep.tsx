import { Button, Input, Select } from '@/app/components/ui';
import { PlusIcon, TrashIcon } from 'lucide-react';
import React from 'react';
import { Controller, FieldError, useFieldArray, useFormContext } from 'react-hook-form';
import { StrategyFormData } from './strategySchema';

interface SellStrategyStepProps {
  onPrev: () => void;
  onNext: () => void;
}

export const SellStrategyStep: React.FC<SellStrategyStepProps> = ({ onPrev, onNext }) => {
  const {
    control,
    formState: { isValid },
  } = useFormContext<StrategyFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sell',
  });

  const handleAddStrategy = () => {
    append({
      condition: { type: 'price', operator: 'increasedBy', value: 100 },
      action: { type: 'percentageOfHoldings', amount: 50 },
    });
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Sell Strategy</h2>

      {fields.map((field, index) => (
        <SellStrategyField key={field.id} index={index} remove={remove} />
      ))}

      <Button type='button' onClick={handleAddStrategy} variant='secondary' className='w-full'>
        <PlusIcon className='w-4 h-4 mr-2' />
        Add Sell Strategy
      </Button>

      <div className='flex justify-between'>
        <Button type='button' onClick={onPrev} variant='ghost'>
          Previous: Buy Strategy
        </Button>
        <Button
          type='button'
          onClick={onNext}
          variant='primary'
          disabled={!isValid || fields.length === 0}>
          Next: Review
        </Button>
      </div>
    </div>
  );
};

const SellStrategyField: React.FC<{
  index: number;
  remove: (index: number) => void;
}> = ({ index, remove }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<StrategyFormData>();

  const sellError = errors.sell?.[index] as
    | {
        action?: {
          amount?: FieldError;
        };
      }
    | undefined;

  return (
    <div className='p-4 bg-gray-50 rounded-lg space-y-4 relative'>
      <Button
        type='button'
        onClick={() => remove(index)}
        variant='destructive'
        size='icon'
        className='absolute top-2 right-2'>
        <TrashIcon className='w-4 h-4' />
      </Button>
      <div className='flex space-x-2'>
        <Controller
          name={`sell.${index}.condition.operator`}
          control={control}
          render={({ field }) => (
            <Select
              label='Condition'
              {...field}
              options={[
                { value: 'increasedBy', label: 'Price Increased By' },
                { value: 'decreasedBy', label: 'Price Decreased By' },
              ]}
            />
          )}
        />
        <Controller
          name={`sell.${index}.condition.value`}
          control={control}
          render={({ field }) => (
            <Input
              type='number'
              label='Percentage'
              placeholder='0'
              {...field}
              onChange={(value) => {
                const numValue = value === '' ? '' : Number(value);
                field.onChange(numValue);
              }}
              step='0.1'
              min='0.1'
              max='100'
              className='no-spinner'
            />
          )}
        />
      </div>
      <div className='w-full'>
        <Controller
          name={`sell.${index}.action.amount`}
          control={control}
          render={({ field }) => (
            <Input
              type='number'
              label='Sell Percentage'
              placeholder='0'
              {...field}
              onChange={(value) => {
                const numValue = value === '' ? '' : Number(value);
                field.onChange(numValue);
              }}
              step='0.1'
              min='0.1'
              max='100'
              className='no-spinner'
              error={sellError?.action?.amount?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
