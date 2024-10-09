import { cn } from '@/lib/utils';
import { Dialog as HeadlessDialog, Transition, TransitionChild } from '@headlessui/react';
import { AlertCircle, AlertTriangle, CheckCircle, Copy, Eye, EyeOff, Loader2 } from 'lucide-react';
import React, {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { Button } from './Button';
import { Input, InputProps } from './Input';

type DialogVariant = 'success' | 'info' | 'danger' | 'warning';

type ActionProps<T extends boolean> = {
  label: string;
  onClick: T extends true ? (value: string) => void : () => void;
  disabled?: boolean;
  loading?: boolean;
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
  blurContent?: boolean;
}

const mapVariantToButtonVariant = (
  variant: DialogVariant,
): 'primary' | 'destructive' | 'warning' => {
  switch (variant) {
    case 'success':
    case 'info':
      return 'primary';
    case 'danger':
      return 'destructive';
    case 'warning':
      return 'warning';
  }
};

const mapVariantToIcon = (variant: DialogVariant): ReactNode => {
  switch (variant) {
    case 'warning':
      return <AlertTriangle className='h-6 w-6 text-yellow-600' aria-hidden='true' />;
    case 'success':
      return <CheckCircle className='h-6 w-6 text-green-600' aria-hidden='true' />;
    case 'danger':
      return <AlertCircle className='h-6 w-6 text-red-600' aria-hidden='true' />;
    default:
      return null;
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
      blurContent = false,
    }: DialogProps<T>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);

    const [inputValue, setInputValue] = useState(input?.initialValue || '');
    const [isBlurred, setIsBlurred] = useState(blurContent);

    useEffect(() => {
      if (open) {
        setInputValue(input?.initialValue || '');
        setIsBlurred(blurContent);
      }
    }, [open, input?.initialValue, blurContent]);

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

    const toggleBlur = () => {
      setIsBlurred(!isBlurred);
    };

    const copyToClipboard = (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success('Recovery phrase copied to clipboard!'))
        .catch(() => toast.error('Failed to copy recovery phrase. Please try again.'));
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
                  className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                  <div className='sm:flex sm:items-start'>
                    {mapVariantToIcon(variant) && (
                      <div
                        className={cn(
                          'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 sm:mr-4',
                          {
                            'bg-yellow-100': variant === 'warning',
                            'bg-green-100': variant === 'success',
                            'bg-red-100': variant === 'danger',
                          },
                        )}>
                        {mapVariantToIcon(variant)}
                      </div>
                    )}
                    <div className='mt-3 text-center sm:mt-0 sm:text-left'>
                      <HeadlessDialog.Title
                        as='h3'
                        className='text-base font-semibold leading-6 text-text-title'>
                        {title}
                      </HeadlessDialog.Title>
                      {description && (
                        <div className='mt-2'>
                          <p className='text-sm text-text-body'>{description}</p>
                        </div>
                      )}
                    </div>
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
                  {children && (
                    <div className='mt-4'>
                      {React.Children.map(children, (child) => {
                        if (
                          React.isValidElement(child) &&
                          child.type === 'p' &&
                          child.props.className?.includes('mnemonic')
                        ) {
                          return (
                            <div className='relative mt-2'>
                              <p
                                className={cn(
                                  child.props.className,
                                  isBlurred ? 'filter blur-sm' : '',
                                  'pr-20',
                                )}>
                                {child.props.children}
                              </p>
                              <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2'>
                                {blurContent && (
                                  <button
                                    onClick={toggleBlur}
                                    className='p-1 rounded-full bg-gray-200 hover:bg-gray-300'>
                                    {isBlurred ? (
                                      <Eye className='h-5 w-5 text-gray-600' />
                                    ) : (
                                      <EyeOff className='h-5 w-5 text-gray-600' />
                                    )}
                                  </button>
                                )}
                                <button
                                  onClick={() => copyToClipboard(child.props.children)}
                                  className='p-1 rounded-full bg-gray-200 hover:bg-gray-300'>
                                  <Copy className='h-5 w-5 text-gray-600' />
                                </button>
                              </div>
                            </div>
                          );
                        }
                        return child;
                      })}
                    </div>
                  )}

                  {(primaryAction || secondaryAction) && (
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                      {primaryAction && (
                        <Button
                          variant={mapVariantToButtonVariant(variant)}
                          className='w-full sm:ml-3 sm:w-auto'
                          onClick={handlePrimaryAction}
                          disabled={primaryAction.disabled || primaryAction.loading}>
                          {primaryAction.loading ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            </>
                          ) : (
                            primaryAction.label
                          )}
                        </Button>
                      )}
                      {secondaryAction && (
                        <Button
                          variant='secondary'
                          className={cn(
                            'mt-3 w-full sm:mt-0 sm:w-auto',
                            !primaryAction && 'sm:ml-3',
                          )}
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
