import { cn } from '@/lib/utils';
import { Field, Label } from '@headlessui/react';
import React, { ChangeEvent, forwardRef, useEffect, useState } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  description?: string;
  error?: string;
  currencySymbol?: string;
  initialValue?: string;
  onChange?: (value: string | number | undefined) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      description,
      error,
      type = 'text',
      currencySymbol,
      id,
      value: propValue,
      initialValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState(propValue ?? initialValue ?? '');

    useEffect(() => {
      if (propValue !== undefined) {
        setValue(propValue);
      }
    }, [propValue]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setValue(inputValue);

      if (onChange) {
        if (type === 'number') {
          if (inputValue === '') {
            onChange(undefined);
          } else {
            const numValue = parseFloat(inputValue);
            onChange(isNaN(numValue) ? undefined : numValue);
          }
        } else {
          onChange(inputValue);
        }
      }
    };

    return (
      <Field className='w-full'>
        {label && (
          <Label htmlFor={id} className='block text-sm font-medium leading-6 text-text-title mb-2'>
            {label}
          </Label>
        )}
        <div className='relative'>
          {currencySymbol && (
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <span className='text-text-body sm:text-sm'>{currencySymbol}</span>
            </div>
          )}
          <input
            id={id}
            type={type}
            className={cn(
              'block w-full rounded-md border-0 py-1.5 text-text-title ring-1 ring-inset ring-text-disabled placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6',
              currencySymbol && 'pl-7',
              error && 'text-error ring-error placeholder:text-red-200 focus:ring-error-hover',
              type === 'number' && 'no-spinner',
              className,
            )}
            ref={ref}
            value={value}
            onChange={handleChange}
            {...props}
          />
        </div>
        {error && (
          <p className='mt-2 text-sm text-error' id={`${id}-error`}>
            {error}
          </p>
        )}
      </Field>
    );
  },
);

Input.displayName = 'Input';

export { Input };
