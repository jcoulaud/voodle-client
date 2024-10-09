import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className='animate-spin text-text-body' size={size} />
    </div>
  );
};
