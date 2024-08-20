'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface HeaderMenuProps {
  userName: string;
  userEmail: string;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ userName, userEmail }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <header className='bg-background-darker text-white py-4 px-6 flex justify-between items-center'>
      <div className='flex items-center space-x-8'>
        <Link href='/' className='text-2xl font-bold text-accent-400'>
          Yoloy
        </Link>
        <nav>
          <ul className='flex space-x-6'>
            <li>
              <Link
                href='/strategies'
                className='text-gray-300 hover:text-accent-400 transition-colors'>
                My Strategies
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className='flex items-center space-x-3 bg-gray-800 rounded-full py-2 px-4 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400'>
            <span className='text-sm font-medium'>{userName}</span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className='bg-gray-800 text-white rounded-lg shadow-lg mt-2 p-2 min-w-[240px] z-50 border border-gray-700'
            align='end'>
            <div className='px-4 py-3 bg-gray-900 rounded-lg'>
              <p className='font-medium text-lg'>{userName}</p>
              <p className='text-sm text-gray-400'>{userEmail}</p>
            </div>
            <DropdownMenu.Item className='flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 rounded-md cursor-pointer outline-none mt-2 transition-colors'>
              <User size={18} className='text-accent-400' />
              <span className='font-medium'>My Profile</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item className='flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 rounded-md cursor-pointer outline-none transition-colors'>
              <Settings size={18} className='text-accent-400' />
              <span className='font-medium'>Settings</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={handleSignOut}
              className='flex items-center space-x-3 px-4 py-3 bg-accent-500 hover:bg-accent-600 text-gray-900 rounded-md cursor-pointer outline-none mt-2 transition-colors'>
              <LogOut size={18} />
              <span className='font-medium'>Sign Out</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
};

export default HeaderMenu;
