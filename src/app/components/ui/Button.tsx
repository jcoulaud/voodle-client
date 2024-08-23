import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary',
        secondary: 'bg-white text-text-body ring-1 ring-inset ring-gray-50 hover:bg-gray-50',
        destructive: 'bg-error text-white hover:bg-error-hover focus-visible:outline-error',
        ghost: 'hover:bg-gray-50',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-2 py-1 text-sm',
        md: 'px-2.5 py-1.5 text-sm',
        lg: 'px-3 py-2 text-sm',
        xl: 'px-3.5 py-2.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
