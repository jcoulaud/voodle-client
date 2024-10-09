import { Button, Input } from '@/app/components/ui';
import { GET_USER_WALLETS } from '@/app/lib/graphql/queries/wallet';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { GetUserWalletsData } from '@/types';
import { useQuery } from '@apollo/client';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StrategyFormData } from './strategySchema';

export const SettingsStrategyStep: React.FC<{ onNext: () => void }> = memo(({ onNext }) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<StrategyFormData>();

  const maxBetAmount = watch('maxBetAmount');
  const strategyName = watch('name');

  const { data: walletsData } = useQuery<GetUserWalletsData>(GET_USER_WALLETS);

  const { balance } = useWalletBalance(walletsData?.getUserWallets[0]?.address || '');

  const isMaxBetAmountValid =
    balance !== null && balance !== 'N/A' && maxBetAmount !== undefined
      ? parseFloat(maxBetAmount.toString()) <= parseFloat(balance)
      : true;

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Name Your Strategy</h2>
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <Input
            label='Strategy Name'
            {...field}
            error={errors.name?.message}
            placeholder='Enter a name for your strategy'
          />
        )}
      />
      <Controller
        name='maxBetAmount'
        control={control}
        render={({ field }) => (
          <Input
            label='Maximum TON to bet'
            type='number'
            {...field}
            onChange={(value) => field.onChange(value)}
            error={
              errors.maxBetAmount?.message ||
              (!isMaxBetAmountValid
                ? `Max bet amount exceeds your current balance of ${balance} TON`
                : undefined)
            }
            placeholder='Enter the maximum bet amount'
          />
        )}
      />

      <Button
        type='button'
        onClick={onNext}
        variant='primary'
        disabled={!isMaxBetAmountValid || !strategyName || balance === null}>
        Next: Buy Strategy
      </Button>
    </div>
  );
});

SettingsStrategyStep.displayName = 'SettingsStrategyStep';
