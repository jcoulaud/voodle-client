import { cn } from '@/lib/utils';
import { forwardRef, ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
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

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-4 py-5 sm:px-6 border-b border-gray-200', className)}
      {...props}
    />
  ),
);
CardHeader.displayName = 'Card.Header';

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-4 py-5 sm:p-6', className)} {...props} />
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
