'use client';

import { Disclosure, DisclosureButton } from '@headlessui/react';
import { Loader2, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';
import MainMenu from './Header/MainMenu';
import MobileMenu from './Header/MobileMenu';
import UserMenu from './Header/UserMenu';

interface LayoutProps {
  children: ReactNode;
  userName: string | null | undefined;
  userEmail: string | null | undefined;
}

export default function Layout({ children, userName, userEmail }: LayoutProps) {
  const isLoading = !userName || !userEmail;

  return (
    <div className='min-h-full'>
      <Disclosure as='nav' className='border-b border-gray-200 bg-white'>
        {({ open }) => (
          <>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='flex h-16 justify-between'>
                <div className='flex'>
                  <div className='flex flex-shrink-0 items-center'>
                    <Image
                      className='block h-8 w-auto lg:hidden'
                      src='/logo.png'
                      alt='Your Company'
                      width={32}
                      height={32}
                    />
                    <Image
                      className='hidden h-8 w-auto lg:block'
                      src='/logo.png'
                      alt='Your Company'
                      width={32}
                      height={32}
                    />
                  </div>
                  <MainMenu />
                </div>
                <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                  {isLoading ? (
                    <div className='ml-3 flex items-center'>
                      <Loader2 className='h-5 w-5 animate-spin text-gray-400' />
                    </div>
                  ) : (
                    <UserMenu userName={userName} userEmail={userEmail} />
                  )}
                </div>
                <div className='-mr-2 flex items-center sm:hidden'>
                  <DisclosureButton className='relative inline-flex items-center justify-center rounded-md bg-background p-2 text-text-secondary hover:bg-background-dark hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
                    <span className='absolute -inset-0.5' />
                    <span className='sr-only'>Open main menu</span>
                    {open ? (
                      <X className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <Menu className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <Disclosure.Panel className='sm:hidden'>
              {isLoading ? (
                <div className='px-4 py-5 border-t border-gray-200'>
                  <div className='flex items-center'>
                    <div className='ml-3 flex items-center'>
                      <Loader2 className='h-5 w-5 animate-spin text-gray-400' />
                    </div>
                  </div>
                </div>
              ) : (
                <MobileMenu userName={userName} userEmail={userEmail} />
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className='py-10'>
        <main>
          <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </div>
  );
}
