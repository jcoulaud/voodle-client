import { FC, ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  rightAction?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description, rightAction }) => {
  return (
    <div className='px-4 sm:px-0 mb-6'>
      <h1 className='text-2xl font-semibold text-text-title'>{title}</h1>
      <div className='mt-1 flex items-center justify-between'>
        <p className='text-sm text-text-body'>{description}</p>
        {rightAction && <div className='ml-4'>{rightAction}</div>}
      </div>
    </div>
  );
};
