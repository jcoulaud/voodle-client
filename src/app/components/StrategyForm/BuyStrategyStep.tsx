import { Button, Input } from '@/app/components/ui';
import { Check } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ConditionModal from './ConditionModal';
import { Condition, StrategyFormData, baseConditionSchema } from './strategySchema';

interface BuyStrategyStepProps {
  onNext: () => void;
}

export const BuyStrategyStep: React.FC<BuyStrategyStepProps> = ({ onNext }) => {
  const { control, watch, setValue, trigger } = useFormContext<StrategyFormData>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConditionType, setCurrentConditionType] = useState<Condition['type'] | null>(null);
  console.log('currentConditionType', currentConditionType);

  const buyConditions = watch('buy.conditions') || [];
  const investmentAmount = watch('buy.action.amount');

  const conditionOptions = useMemo(() => {
    const types = baseConditionSchema.shape.type.options;
    return types.map((type) => ({
      value: type,
      label:
        type.charAt(0).toUpperCase() +
        type
          .slice(1)
          .replace(/([A-Z])/g, ' $1')
          .trim(),
    }));
  }, []);

  const handleConditionClick = (conditionType: Condition['type']) => {
    const existingCondition = buyConditions.find((c) => c.type === conditionType);
    console.log('existingCondition', existingCondition);

    if (existingCondition) {
      setValue(
        'buy.conditions',
        buyConditions.filter((c) => c.type !== conditionType),
        { shouldValidate: true },
      );
    } else {
      setCurrentConditionType(conditionType);
      setIsModalOpen(true);
    }
  };

  const handleSaveCondition = (condition: Condition) => {
    console.log('handleSaveCondition', condition);
    const updatedConditions = [
      ...buyConditions.filter((c) => c.type !== condition.type),
      condition,
    ];
    console.log('updatedConditions', updatedConditions);

    setValue('buy.conditions', updatedConditions, { shouldValidate: true });
    setIsModalOpen(false);
  };

  const handleNext = async () => {
    const isValid = await trigger(['buy.action.amount', 'buy.conditions']);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-900'>Buy Strategy</h2>

      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>Investment Amount</h3>
        <Controller
          name='buy.action.amount'
          control={control}
          render={({ field }) => (
            <Input
              id='investment-amount'
              type='text'
              label='Amount invested on each token'
              currencySymbol='$'
              placeholder='0.00'
              className='max-w-40'
              {...field}
              onChange={(value) => {
                if (typeof value === 'string') {
                  const cleanedValue = value.replace(/[^0-9.]/g, '');
                  field.onChange(cleanedValue === '' ? '' : Number(cleanedValue));
                }
              }}
              value={field.value === 0 ? '' : field.value}
            />
          )}
        />
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>Conditions</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {conditionOptions.map((option) => {
            const isSelected = buyConditions.some((c) => c.type === option.value);
            return (
              <Button
                key={option.value}
                onClick={() => handleConditionClick(option.value)}
                variant={isSelected ? 'dark' : 'secondary'}
                size='lg'
                className='justify-between h-14 text-base font-semibold w-full'>
                {option.label}
                {isSelected && <Check className='h-6 w-6' />}
              </Button>
            );
          })}
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          onClick={handleNext}
          disabled={!investmentAmount || buyConditions.length === 0}
          variant='primary'>
          Next: Selling Strategy
        </Button>
      </div>

      {currentConditionType && (
        <ConditionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCondition}
          conditionType={currentConditionType}
          initialCondition={buyConditions.find((c) => c.type === currentConditionType)}
        />
      )}
    </div>
  );
};
