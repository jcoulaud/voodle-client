import { cn } from '@/lib/utils';
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'primary';
  rounded?: 'full' | 'md';
  className?: string;
}

const variantStyles = {
  gray: 'bg-gray-400/10 text-gray-400 ring-gray-400/20',
  red: 'bg-red-400/10 text-red-400 ring-red-400/20',
  yellow: 'bg-yellow-400/10 text-yellow-500 ring-yellow-400/20',
  green: 'bg-green-500/10 text-green-400 ring-green-500/20',
  blue: 'bg-blue-400/10 text-blue-400 ring-blue-400/30',
  indigo: 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/30',
  purple: 'bg-purple-400/10 text-purple-400 ring-purple-400/30',
  pink: 'bg-pink-400/10 text-pink-400 ring-pink-400/20',
  primary: 'bg-primary/10 text-primary ring-primary/30',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant, rounded = 'md', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 text-xs font-medium ring-1 ring-inset',
        rounded === 'full' ? 'rounded-full' : 'rounded-md',
        variantStyles[variant],
        className,
      )}>
      {children}
    </span>
  );
};
