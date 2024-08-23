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
    defaultValues: {
      buy: { conditions: [], action: { type: 'fixedAmount', amount: 0 } },
      sell: [],
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: StrategyFormData) => {
    try {
      setError(null);
      // Here you would typically send the data to your backend
      console.log('Strategy submitted:', data);
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (err) {
      setError('An error occurred while submitting the strategy. Please try again.');
    }
  };

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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        <StepIndicator steps={steps} currentStep={currentStep} />

        {currentStep === 'Buy Strategy' && <BuyStrategyStep onNext={nextStep} />}
        {currentStep === 'Sell Strategy' && <SellStrategyStep />}
        {currentStep === 'Review' && <ReviewStep />}

        {error && <div className='text-error'>{error}</div>}
      </form>
    </FormProvider>
  );
};
