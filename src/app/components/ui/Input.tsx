import { cn } from '@/lib/utils';
import { Description, Field, Input as HeadlessInput, Label } from '@headlessui/react';
import { AlertCircleIcon } from 'lucide-react';
import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, description, error, type = 'text', ...props }, ref) => {
    return (
      <Field className='w-full'>
        {label && (
          <Label className='block text-sm font-medium leading-6 text-text-body'>{label}</Label>
        )}
        <div className='relative mt-2'>
          <HeadlessInput
            type={type}
            className={cn(
              'block w-full rounded-md border-0 py-1.5 text-text-body shadow-sm ring-1 ring-inset ring-text-disabled placeholder:text-text-disabled focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6',
              error && 'pr-10 text-error ring-error placeholder:text-error focus:ring-error-hover',
              props.disabled &&
                'cursor-not-allowed bg-background text-text-disabled ring-text-disabled',
              className,
            )}
            invalid={!!error}
            ref={ref}
            {...props}
          />
          {error && (
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
              <AlertCircleIcon className='h-5 w-5 text-error' aria-hidden='true' />
            </div>
          )}
        </div>
        {description && !error && (
          <Description className='mt-2 text-sm text-text-disabled'>{description}</Description>
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

Input.displayName = 'Input';

export { Input };
