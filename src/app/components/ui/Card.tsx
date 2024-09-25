import { cn } from '@/lib/utils';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreVertical } from 'lucide-react';
import { forwardRef, ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  action?: ReactNode;
  menu?: {
    items: Array<{
      label: string;
      icon?: ReactNode;
      onClick: () => void;
    }>;
  };
}

interface CardComposition {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('overflow-hidden rounded-lg bg-white shadow', className)}
      {...props}>
      {children}
    </div>
  );
}) as React.ForwardRefExoticComponent<CardProps> & CardComposition;

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, action, menu, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center justify-between',
        className,
      )}
      {...props}>
      <div className='flex-1 min-w-0'>
        <h3 className='text-lg font-medium leading-6 text-text-title truncate'>{title}</h3>
      </div>
      <div className='flex items-center space-x-2 flex-shrink-0'>
        {action}
        {menu && (
          <Menu as='div' className='relative inline-block text-left'>
            <div>
              <MenuButton className='-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600'>
                <span className='sr-only'>Open options</span>
                <MoreVertical className='h-5 w-5' aria-hidden='true' />
              </MenuButton>
            </div>
            <MenuItems className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                {menu.items.map((item, index) => (
                  <MenuItem key={index}>
                    {({ active }) => (
                      <button
                        onClick={item.onClick}
                        className={cn(
                          active ? 'bg-gray-100 text-text-title' : 'text-gray-700',
                          'flex w-full px-4 py-2 text-sm',
                        )}>
                        {item.icon && (
                          <span className='mr-3 h-5 w-5 text-gray-400'>{item.icon}</span>
                        )}
                        <span>{item.label}</span>
                      </button>
                    )}
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        )}
      </div>
    </div>
  ),
);
CardHeader.displayName = 'Card.Header';

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-4 py-4 sm:px-6', className)} {...props} />
  ),
);
CardContent.displayName = 'Card.Content';

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-4 py-4 sm:px-6 border-t border-gray-200', className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'Card.Footer';

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-medium leading-6 text-text-title', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'Card.Title';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('mt-1 max-w-2xl text-sm text-text-body', className)} {...props} />
));
CardDescription.displayName = 'Card.Description';

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export { Card };
