import { cn } from '@/lib/utils';
import { Description, Field, Select as HeadlessSelect, Label } from '@headlessui/react';
import { forwardRef } from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  description?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, description, error, options, ...props }, ref) => {
    return (
      <Field className='w-full'>
        {label && (
          <Label className='block text-sm font-medium leading-6 text-text-body'>{label}</Label>
        )}
        <div className='relative mt-2'>
          <HeadlessSelect
            className={cn(
              'mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-text-body ring-1 ring-inset ring-text-disabled focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6',
              error && 'text-error ring-error focus:ring-error-hover',
              props.disabled &&
                'cursor-not-allowed bg-background text-text-disabled ring-text-disabled',
              className,
            )}
            invalid={!!error}
            ref={ref}
            {...props}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </HeadlessSelect>
        </div>
        {description && !error && (
          <Description className='mt-2 text-sm text-text-body'>{description}</Description>
        )}
        {error && (
          <p className='mt-2 text-sm text-error' id={`${props.id}-error`}>
            {error}
          </p>
        )}
      </Field>
    );
  },
);

Select.displayName = 'Select';

export { Select };
