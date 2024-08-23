import { cn } from '@/lib/utils';
import {
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessDialog,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment, ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button } from './Button';

type DialogVariant = 'success' | 'info' | 'danger';

interface ActionProps {
  label: string;
  onClick: () => void;
}

interface DialogProps {
  open: boolean;
  onClose: (value: boolean) => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: DialogVariant;
  primaryAction?: ActionProps;
  secondaryAction?: ActionProps;
  children?: ReactNode;
}

const mapVariantToButtonVariant = (variant: DialogVariant): 'primary' | 'destructive' => {
  switch (variant) {
    case 'success':
    case 'info':
      return 'primary';
    case 'danger':
      return 'destructive';
  }
};

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      variant = 'info',
      primaryAction,
      secondaryAction,
      children,
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);

    return (
      <Transition appear show={open} as={Fragment}>
        <HeadlessDialog
          as='div'
          className='relative z-10'
          onClose={onClose}
          initialFocus={internalRef}>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </TransitionChild>

          <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <TransitionChild
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
                <DialogPanel
                  ref={ref}
                  className='relative transform overflow-hidden rounded-md bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                  <div className='text-center'>
                    <DialogTitle
                      as='h3'
                      className='text-lg font-semibold leading-6 text-text-title'>
                      {title}
                    </DialogTitle>
                    {description && (
                      <div className='mt-2'>
                        <p className='text-sm text-text-body'>{description}</p>
                      </div>
                    )}
                  </div>

                  {children && <div className='mt-4'>{children}</div>}

                  {(primaryAction || secondaryAction) && (
                    <div
                      className={cn(
                        'mt-5 sm:mt-6',
                        secondaryAction && primaryAction
                          ? 'sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'
                          : '',
                      )}>
                      {primaryAction && (
                        <Button
                          variant={mapVariantToButtonVariant(variant)}
                          className={secondaryAction ? 'sm:col-start-2' : ''}
                          onClick={primaryAction.onClick}>
                          {primaryAction.label}
                        </Button>
                      )}
                      {secondaryAction && (
                        <Button
                          variant='secondary'
                          className={cn('mt-3 sm:mt-0', !primaryAction && 'sm:col-start-2')}
                          onClick={secondaryAction.onClick}>
                          {secondaryAction.label}
                        </Button>
                      )}
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </HeadlessDialog>
      </Transition>
    );
  },
);

Dialog.displayName = 'Dialog';
