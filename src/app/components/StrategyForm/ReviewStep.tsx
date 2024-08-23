import { useFormContext } from 'react-hook-form';
import { StrategyFormData } from './strategySchema';

export const ReviewStep: React.FC = () => {
  const { watch } = useFormContext<StrategyFormData>();
  const formData = watch();

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>Review Strategy</h2>
      <div>
        <h3 className='text-md font-medium'>Buy Strategy</h3>
        <p>Action Type: {formData.buy.action.type}</p>
        {formData.buy.action.type === 'fixedAmount' && <p>Amount: {formData.buy.action.amount}</p>}
        {formData.buy.action.type === 'percentageOfBalance' && (
          <p>Percentage: {formData.buy.action.percentage}%</p>
        )}
      </div>
      <div>
        <h3 className='text-md font-medium'>Sell Strategy</h3>
        {formData.sell.map((sellCondition, index) => (
          <p key={index}>
            {sellCondition.condition}: {sellCondition.percentage}%
          </p>
        ))}
      </div>
    </div>
  );
};
