import { Checkbox, Dialog, Input, Select } from '@/app/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BuyCondition, buyConditionSchema } from './strategySchema';

interface ConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (condition: BuyCondition) => void;
  conditionType: BuyCondition['type'];
  initialCondition?: BuyCondition;
}

const ConditionModal = memo<ConditionModalProps>(
  ({ isOpen, onClose, onSave, conditionType, initialCondition }) => {
    const {
      control,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
    } = useForm<BuyCondition>({
      resolver: zodResolver(buyConditionSchema),
      defaultValues: initialCondition || getDefaultCondition(conditionType),
    });

    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isOpen) {
        reset(initialCondition || getDefaultCondition(conditionType));
        setTimeout(() => {
          firstInputRef.current?.focus();
        }, 100);
      }
    }, [isOpen, initialCondition, conditionType, reset]);

    const onSubmit = (data: BuyCondition) => {
      onSave(data);
      onClose();
    };

    const operator = watch('operator');

    const renderFields = useMemo(() => {
      switch (conditionType) {
        case 'marketCap':
        case 'liquidity':
        case 'price':
          return (
            <>
              <Controller
                name='operator'
                control={control}
                render={({ field }) => (
                  <Select
                    label='Operator'
                    options={[
                      { value: 'greaterThan', label: 'Greater Than' },
                      { value: 'lessThan', label: 'Less Than' },
                      { value: 'between', label: 'Between' },
                    ]}
                    {...field}
                  />
                )}
              />
              <Controller
                name='value'
                control={control}
                render={({ field }) => (
                  <>
                    {/* @ts-ignore */}
                    <Input
                      type='number'
                      label={operator === 'between' ? 'Minimum Value' : 'Value'}
                      currencySymbol='$'
                      {...field}
                      onChange={(value) => {
                        if (typeof value === 'string') {
                          field.onChange(value === '' ? '' : Number(value));
                        } else if (typeof value === 'number') {
                          field.onChange(value);
                        }
                      }}
                      className='no-spinner'
                      ref={firstInputRef}
                      placeholder='0'
                      error={(errors as any).value?.message}
                    />
                    {operator === 'between' && (
                      <Input
                        type='number'
                        label='Maximum Value'
                        currencySymbol='$'
                        value={Array.isArray(field.value) ? field.value[1] : ''}
                        onChange={(value) => {
                          if (typeof value === 'string' || typeof value === 'number') {
                            const newValue = Array.isArray(field.value)
                              ? [...field.value]
                              : [field.value || '', ''];
                            newValue[1] = value === '' ? '' : Number(value);
                            field.onChange(newValue);
                          }
                        }}
                        className='no-spinner'
                        placeholder='0'
                        error={
                          Array.isArray((errors as any).value)
                            ? (errors as any).value[1]?.message
                            : undefined
                        }
                      />
                    )}
                  </>
                )}
              />
            </>
          );
        case 'tokenName':
          return (
            <Controller
              name='value'
              control={control}
              render={({ field }) => (
                <>
                  {/* @ts-ignore */}
                  <Input
                    label='Token name must contain'
                    placeholder='Dog'
                    {...field}
                    ref={firstInputRef}
                    error={(errors as any).value?.message}
                  />
                </>
              )}
            />
          );
        case 'age':
          return (
            <>
              <Controller
                name='operator'
                control={control}
                render={({ field }) => (
                  <Select
                    label='Operator'
                    options={[
                      { value: 'greaterThan', label: 'Greater Than' },
                      { value: 'lessThan', label: 'Less Than' },
                      { value: 'equal', label: 'Equal To' },
                    ]}
                    {...field}
                  />
                )}
              />
              <Controller
                name='days'
                control={control}
                render={({ field }) => (
                  <Input
                    type='number'
                    label='Days'
                    {...field}
                    onChange={(value) => {
                      if (typeof value === 'string') {
                        field.onChange(value === '' ? '' : Number(value));
                      } else if (typeof value === 'number') {
                        field.onChange(value);
                      }
                    }}
                    ref={firstInputRef}
                    placeholder='0'
                    error={(errors as any).days?.message}
                  />
                )}
              />
            </>
          );
        case 'blacklist':
          return (
            <>
              <Controller
                name='checkDollarSign'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label='Ignore tokens containing a "$" sign'
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              <Controller
                name='checkBlacklist'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label='Check Blacklist'
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </>
          );
      }
    }, [conditionType, control, operator, errors]);

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        variant='info'
        title={`${getConditionLabel(conditionType)} Condition`}
        primaryAction={{
          label: 'Save Condition',
          onClick: handleSubmit(onSubmit),
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: onClose,
        }}>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-4 space-y-4'>
          {renderFields}
        </form>
      </Dialog>
    );
  },
);

ConditionModal.displayName = 'ConditionModal';

export default ConditionModal;

/*
 * HELPERS
 */

function getConditionLabel(type: BuyCondition['type']): string {
  switch (type) {
    case 'tokenName':
      return 'Token Name';
    case 'marketCap':
      return 'Market Cap';
    case 'liquidity':
      return 'Liquidity';
    case 'price':
      return 'Price';
    case 'age':
      return 'Age';
    case 'blacklist':
      return 'Blacklist';
  }
}

function getDefaultCondition(type: BuyCondition['type']): BuyCondition {
  switch (type) {
    case 'tokenName':
      return { type, operator: 'contains', value: '' };
    case 'marketCap':
    case 'liquidity':
    case 'price':
      // @ts-ignore
      return { type, operator: 'greaterThan', value: '' };
    case 'age':
      // @ts-ignore
      return { type, operator: 'greaterThan', days: '' };
    case 'blacklist':
      return { type, checkDollarSign: false, checkBlacklist: false };
  }
}
