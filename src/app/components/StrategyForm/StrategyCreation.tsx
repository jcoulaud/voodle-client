import { CREATE_STRATEGY } from '@/app/lib/graphql/mutations/strategy';
import { GET_USER_STRATEGIES } from '@/app/lib/graphql/queries/strategy';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BuyStrategyStep } from './BuyStrategyStep';
import { ReviewStep } from './ReviewStep';
import { SellStrategyStep } from './SellStrategyStep';
import { SettingsStrategyStep } from './SettingsStrategyStep';
import { StepIndicator } from './StepIndicator';
import { StrategyFormData, strategySchema } from './strategySchema';

const steps = ['Settings', 'Buy Conditions', 'Sell Conditions', 'Review'] as const;
type Step = (typeof steps)[number];

export const StrategyCreation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('Settings');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [createStrategy] = useMutation(CREATE_STRATEGY, {
    refetchQueries: [{ query: GET_USER_STRATEGIES }],
  });

  const methods = useForm<StrategyFormData>({
    resolver: zodResolver(strategySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      maxBetAmount: 0,
      buy: {
        conditions: [],
        action: { type: 'fixedAmount', amount: 0 },
      },
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
    await toast.promise(
      createStrategy({
        variables: {
          input: {
            name: data.name,
            maxBetAmount: data.maxBetAmount,
            strategy: { buy: data.buy, sell: data.sell },
          },
        },
      }),
      {
        loading: 'Creating strategy...',
        success: () => {
          router.push('/strategies');
          return 'Strategy created successfully!';
        },
        error: (error) => {
          console.error('Error creating strategy:', error);
          return 'Failed to create strategy. Please try again.';
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <div className='space-y-8'>
        <StepIndicator steps={steps} currentStep={currentStep} />

        {currentStep === 'Settings' && <SettingsStrategyStep onNext={nextStep} />}
        {currentStep === 'Buy Conditions' && (
          <BuyStrategyStep onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 'Sell Conditions' && (
          <SellStrategyStep onPrev={prevStep} onNext={nextStep} />
        )}
        {currentStep === 'Review' && <ReviewStep onPrev={prevStep} onSubmit={onSubmit} />}

        {error && <div className='text-red-500'>{error}</div>}
      </div>
    </FormProvider>
  );
};
