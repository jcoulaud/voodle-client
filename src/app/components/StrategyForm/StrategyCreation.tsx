import { CREATE_STRATEGY } from '@/app/lib/graphql/mutations/strategy';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BuyStrategyStep } from './BuyStrategyStep';
import { NameStrategyStep } from './NameStrategyStep';
import { ReviewStep } from './ReviewStep';
import { SellStrategyStep } from './SellStrategyStep';
import { StepIndicator } from './StepIndicator';
import { StrategyFormData, strategySchema } from './strategySchema';

const steps = ['Name', 'Buy Conditions', 'Sell Conditions', 'Review'] as const;
type Step = (typeof steps)[number];

export const StrategyCreation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('Name');
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const [createStrategy] = useMutation(CREATE_STRATEGY);

  const methods = useForm<StrategyFormData>({
    resolver: zodResolver(strategySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
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
    try {
      console.log('session', session);
      setError(null);
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }
      const result = await createStrategy({
        variables: {
          input: {
            name: data.name,
            strategy: { buy: data.buy, sell: data.sell },
            userId: parseInt(session.user.id),
          },
        },
      });
      console.log('Strategy created:', result.data.createStrategy);
      // TODO: Show success message and redirect to strategy list
    } catch (err) {
      setError('An error occurred while submitting the strategy. Please try again.');
      console.error('Error creating strategy:', err);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className='space-y-8'>
        <StepIndicator steps={steps} currentStep={currentStep} />

        {currentStep === 'Name' && <NameStrategyStep onNext={nextStep} />}
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
