import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  label: string;
  description?: string;
  checked?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, onChange, ...props }, ref) => {
    return (
      <div className='relative flex items-start'>
        <div className='flex h-6 items-center'>
          <input
            type='checkbox'
            className={cn(
              'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary',
              className,
            )}
            ref={ref}
            checked={checked}
            onChange={onChange}
            {...props}
          />
        </div>
        <div className='ml-3 text-sm leading-6'>
          <label htmlFor={props.id} className='font-medium text-text-body'>
            {label}
          </label>
          {description && (
            <p id={`${props.id}-description`} className='text-text-disabled'>
              {description}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
