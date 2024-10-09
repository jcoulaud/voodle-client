import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-white text-text-title hover:bg-gray-50 border border-text-disabled',
        primary: 'bg-primary text-white hover:bg-primary-hover',
        secondary: 'bg-white text-text-title hover:bg-gray-100 border border-text-disabled',
        destructive: 'bg-error text-white hover:bg-error-hover',
        ghost: 'hover:bg-gray-100 hover:text-text-body-hover border border-transparent',
        link: 'underline-offset-4 hover:underline text-primary',
        dark: 'bg-text-title text-white hover:bg-gray-800',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        selected: true,
        className: 'bg-text-title text-white hover:bg-text-body-hover border-text-title',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      selected: false,
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  selected?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, selected, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, selected, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
