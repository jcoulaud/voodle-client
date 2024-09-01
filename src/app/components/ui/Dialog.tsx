import { cn } from '@/lib/utils';
import { Dialog as HeadlessDialog, Transition, TransitionChild } from '@headlessui/react';
import React, {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button } from './Button';
import { Input, InputProps } from './Input';

type DialogVariant = 'success' | 'info' | 'danger';

type ActionProps<T extends boolean> = {
  label: string;
  onClick: T extends true ? (value: string) => void : () => void;
};

interface DialogProps<T extends boolean> {
  open: boolean;
  onClose: (value: boolean) => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: DialogVariant;
  primaryAction?: ActionProps<T>;
  secondaryAction?: ActionProps<false>;
  children?: ReactNode;
  input?: T extends true
    ? Omit<InputProps, 'value' | 'onChange'> & { initialValue?: string }
    : never;
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

export const Dialog = forwardRef(
  <T extends boolean>(
    {
      open,
      onClose,
      title,
      description,
      variant = 'info',
      primaryAction,
      secondaryAction,
      children,
      input,
    }: DialogProps<T>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);

    const [inputValue, setInputValue] = useState(input?.initialValue || '');

    useEffect(() => {
      if (open) {
        setInputValue(input?.initialValue || '');
      }
    }, [open, input?.initialValue]);

    const handlePrimaryAction = () => {
      if (primaryAction) {
        if (input) {
          (primaryAction as ActionProps<true>).onClick(inputValue);
        } else {
          (primaryAction as ActionProps<false>).onClick();
        }
        onClose(false);
      }
    };

    return (
      <Transition appear show={open} as={React.Fragment}>
        <HeadlessDialog
          as='div'
          className='relative z-10'
          onClose={onClose}
          initialFocus={internalRef}>
          <TransitionChild
            as={React.Fragment}
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
                as={React.Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
                <HeadlessDialog.Panel
                  ref={ref}
                  className='relative transform overflow-hidden rounded-md bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                  <div className='text-center'>
                    <HeadlessDialog.Title
                      as='h3'
                      className='text-lg font-semibold leading-6 text-text-title'>
                      {title}
                    </HeadlessDialog.Title>
                    {description && (
                      <div className='mt-2'>
                        <p className='text-sm text-text-body'>{description}</p>
                      </div>
                    )}
                  </div>

                  {input && (
                    <div className='mt-4'>
                      <Input
                        {...input}
                        value={inputValue}
                        onChange={(value) => setInputValue(value as string)}
                      />
                    </div>
                  )}

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
                          onClick={handlePrimaryAction}>
                          {primaryAction.label}
                        </Button>
                      )}
                      {secondaryAction && (
                        <Button
                          variant='secondary'
                          className={cn('mt-3 sm:mt-0', !primaryAction && 'sm:col-start-2')}
                          onClick={() => {
                            secondaryAction.onClick();
                            onClose(false);
                          }}>
                          {secondaryAction.label}
                        </Button>
                      )}
                    </div>
                  )}
                </HeadlessDialog.Panel>
              </TransitionChild>
            </div>
          </div>
        </HeadlessDialog>
      </Transition>
    );
  },
);

Dialog.displayName = 'Dialog';
