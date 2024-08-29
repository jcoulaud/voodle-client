import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BuyStrategyStep } from './BuyStrategyStep';
import { ReviewStep } from './ReviewStep';
import { SellStrategyStep } from './SellStrategyStep';
import { StepIndicator } from './StepIndicator';
import { StrategyFormData, strategySchema } from './strategySchema';

const steps = ['Buy Strategy', 'Sell Strategy', 'Review'] as const;
type Step = (typeof steps)[number];

export const StrategyCreation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('Buy Strategy');
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<StrategyFormData>({
    resolver: zodResolver(strategySchema),
    mode: 'onChange',
    defaultValues: {
      buy: { conditions: [], action: { type: 'fixedAmount', amount: 1 } },
      sell: [],
    },
  });

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const onSubmit = async (data: StrategyFormData) => {
    try {
      setError(null);
      console.log('Strategy submitted:', data);
      // TODO: call mutation to create strategy
    } catch (err) {
      setError('An error occurred while submitting the strategy. Please try again.');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className='space-y-8'>
        <StepIndicator steps={steps} currentStep={currentStep} />

        {currentStep === 'Buy Strategy' && <BuyStrategyStep onNext={nextStep} />}
        {currentStep === 'Sell Strategy' && (
          <SellStrategyStep onPrev={prevStep} onNext={nextStep} />
        )}
        {currentStep === 'Review' && <ReviewStep onPrev={prevStep} onSubmit={onSubmit} />}

        {error && <div className='text-red-500'>{error}</div>}
      </div>
    </FormProvider>
  );
};
