import { cn } from '@/lib/utils';
import { Field, Label } from '@headlessui/react';
import { ChangeEvent, forwardRef } from 'react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  description?: string;
  error?: string;
  currencySymbol?: string;
  value?: string | number | [string | number, string | number];
  onChange?: (value: string | number | [string | number, string | number]) => void;
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
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        const inputValue = e.target.value;
        if (Array.isArray(value)) {
          // Handle array value for "between" operator
          const newValue: [string | number, string | number] = [
            type === 'number' && inputValue !== '' ? Number(inputValue) : inputValue,
            value[1] || '',
          ];
          onChange(newValue);
        } else {
          onChange(type === 'number' && inputValue !== '' ? Number(inputValue) : inputValue);
        }
      }
    };

    return (
      <Field className='w-full'>
        {label && (
          <Label htmlFor={id} className='block text-sm font-medium leading-6 text-gray-900 mb-2'>
            {label}
          </Label>
        )}
        <div className='relative'>
          {currencySymbol && (
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <span className='text-gray-500 sm:text-sm'>{currencySymbol}</span>
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
            value={Array.isArray(value) ? value[0] : value}
            onChange={handleChange}
            {...props}
          />
        </div>
        {error && (
          <p className='mt-2 text-sm text-red-600' id={`${id}-error`}>
            {error}
          </p>
        )}
      </Field>
    );
  },
);

Input.displayName = 'Input';

export { Input };
