import { Button, Input } from '@/app/components/ui';
import { Check } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ConditionModal from './ConditionModal';
import { BuyCondition, StrategyFormData, baseConditionSchema } from './strategySchema';

interface BuyStrategyStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export const BuyStrategyStep: React.FC<BuyStrategyStepProps> = ({ onNext, onPrev }) => {
  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<StrategyFormData>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConditionType, setCurrentConditionType] = useState<BuyCondition['type'] | null>(
    null,
  );

  const buyData = watch('buy');
  const buyConditions = buyData?.conditions || [];
  const investmentAmount = buyData?.action?.amount;

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

  const handleConditionClick = (conditionType: BuyCondition['type']) => {
    const existingCondition = buyConditions.find((c) => c.type === conditionType);

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

  const handleSaveCondition = (condition: BuyCondition) => {
    const updatedConditions = [
      ...buyConditions.filter((c) => c.type !== condition.type),
      condition,
    ];

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
      <h2 className='text-2xl font-semibold text-text-title'>Buy Strategy</h2>

      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-text-title'>Investment Amount</h3>
        <Controller
          name='buy.action.amount'
          control={control}
          render={({ field }) => (
            <Input
              id='investment-amount'
              type='text'
              label='Amount of TON invested on each token'
              placeholder='0.00'
              className='max-w-40'
              {...field}
              onChange={(value) => {
                if (typeof value === 'string') {
                  const cleanedValue = value.replace(/[^0-9.]/g, '');
                  field.onChange(cleanedValue === '' ? '' : Number(cleanedValue));
                }
              }}
              error={errors.buy?.action?.amount?.message}
            />
          )}
        />
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-text-title'>Conditions</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {conditionOptions.map((option) => {
            const isSelected = buyConditions.some((c) => c.type === option.value);
            return (
              <Button
                key={option.value}
                onClick={() => handleConditionClick(option.value as BuyCondition['type'])}
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

      <div className='flex justify-between'>
        <Button onClick={onPrev} variant='ghost'>
          Previous: Strategy Name
        </Button>
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
