import { Input, Select } from '@/app/components/ui';
import { useFormContext } from 'react-hook-form';
import { StrategyFormData } from './strategySchema';

export const BuyStrategyStep: React.FC = () => {
  const { register, watch } = useFormContext<StrategyFormData>();
  const actionType = watch('buy.action.type');

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>Buy Strategy</h2>
      <Select
        label='Action Type'
        {...register('buy.action.type')}
        options={[
          { value: 'fixedAmount', label: 'Fixed Amount' },
          { value: 'percentageOfBalance', label: 'Percentage of Balance' },
          { value: 'all', label: 'All Available Balance' },
          { value: 'half', label: 'Half of Available Balance' },
        ]}
      />
      {actionType === 'fixedAmount' && (
        <Input
          type='number'
          label='Amount'
          {...register('buy.action.amount', { valueAsNumber: true })}
        />
      )}
      {actionType === 'percentageOfBalance' && (
        <Input
          type='number'
          label='Percentage'
          {...register('buy.action.percentage', { valueAsNumber: true })}
        />
      )}
      {/* Add condition fields here */}
    </div>
  );
};
