import { Button, Input, Select } from '@/app/components/ui';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { StrategyFormData } from './strategySchema';

export const SellStrategyStep: React.FC = () => {
  const { control, register } = useFormContext<StrategyFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sell',
  });

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>Sell Strategy</h2>
      {fields.map((field, index) => (
        <div key={field.id} className='flex items-end space-x-2'>
          <Select
            label='Condition'
            {...register(`sell.${index}.condition`)}
            options={[
              { value: 'priceIncrease', label: 'Price Increase' },
              { value: 'priceDecrease', label: 'Price Decrease' },
            ]}
          />
          <Input
            type='number'
            label='Percentage'
            {...register(`sell.${index}.percentage`, { valueAsNumber: true })}
          />
          <Button type='button' onClick={() => remove(index)} variant='destructive'>
            <TrashIcon className='w-4 h-4' />
          </Button>
        </div>
      ))}
      <Button
        type='button'
        onClick={() => append({ condition: 'priceIncrease', percentage: 0 })}
        variant='secondary'>
        <PlusIcon className='w-4 h-4 mr-2' />
        Add Sell Condition
      </Button>
    </div>
  );
};
