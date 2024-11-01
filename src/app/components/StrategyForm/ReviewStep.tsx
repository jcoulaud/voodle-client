import { Button } from '@/app/components/ui';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { StrategyFormData } from './strategySchema';

interface ReviewStepProps {
  onPrev: () => void;
  onSubmit: (data: StrategyFormData) => Promise<void>;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ onPrev, onSubmit }) => {
  const { getValues, handleSubmit } = useFormContext<StrategyFormData>();
  const formData = getValues();

  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <div className='space-y-8'>
      <h2 className='text-2xl font-bold'>Review Your Strategy</h2>

      <div>
        <h3 className='text-lg font-semibold mb-2'>Settings</h3>
        <p>
          <strong>Name:</strong> {formData.name}
        </p>
        <p>
          <strong>Max Bet Amount:</strong> ${formData.maxBetAmount}
        </p>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-2'>Buy Conditions</h3>
        <p>
          <strong>Investment Amount:</strong> ${formData.buy?.action.amount}
        </p>
        <ul>
          {formData.buy?.conditions.map((condition, index) => (
            <li key={index}>
              <strong>{condition.type}:</strong> {JSON.stringify(condition)}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-2'>Sell Conditions</h3>
        {formData.sell?.map((strategy, index) => (
          <div key={index}>
            <p>
              When price {strategy.condition.operator} {strategy.condition.value}%, sell{' '}
              {strategy.action.amount}% of holdings
            </p>
          </div>
        ))}
      </div>

      <div className='flex justify-between'>
        <Button type='button' onClick={onPrev} variant='ghost'>
          Previous: Sell Strategy
        </Button>
        <Button type='button' onClick={handleFormSubmit} variant='primary'>
          Submit Strategy
        </Button>
      </div>
    </div>
  );
};
