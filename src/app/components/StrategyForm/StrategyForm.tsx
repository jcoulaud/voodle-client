import { Button } from '@/app/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BuyStrategyStep } from './BuyStrategyStep';
import { ReviewStep } from './ReviewStep';
import { SellStrategyStep } from './SellStrategyStep';
import { StepIndicator } from './StepIndicator';
import { StrategyFormData, strategySchema } from './strategySchema';

const steps = ['Buy Strategy', 'Sell Strategy', 'Review'];

export const StrategyForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const methods = useForm<StrategyFormData>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      buy: { conditions: [], action: { type: 'fixedAmount', amount: 0 } },
      sell: [],
    },
  });

  const onSubmit = (data: StrategyFormData) => {
    console.log('Strategy submitted:', data);
    // Here you would typically send the data to your backend
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-8'>
        <StepIndicator steps={steps} currentStep={step} />

        {step === 0 && <BuyStrategyStep />}
        {step === 1 && <SellStrategyStep />}
        {step === 2 && <ReviewStep />}

        <div className='flex justify-between mt-4'>
          {step > 0 && (
            <Button type='button' onClick={prevStep} variant='secondary'>
              Previous
            </Button>
          )}
          {step < steps.length - 1 && (
            <Button type='button' onClick={nextStep}>
              Next
            </Button>
          )}
          {step === steps.length - 1 && <Button type='submit'>Create Strategy</Button>}
        </div>
      </form>
    </FormProvider>
  );
};
