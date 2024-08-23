import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from './Avatar';
import { userNavigation } from './navigation';

interface UserMenuProps {
  userName: string;
  userEmail: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function UserMenu({ userName, userEmail }: UserMenuProps) {
  const router = useRouter();

  const handleSignOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log('signing out');
    e.preventDefault();
    await signOut({ redirect: true });
    router.push('/');
  };

  return (
    <Menu as='div' className='relative ml-3'>
      <div>
        <MenuButton className='relative flex max-w-xs items-center rounded-full bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
          <span className='absolute -inset-1.5' />
          <span className='sr-only'>Open user menu</span>
          <Avatar userName={userName} size={32} />
        </MenuButton>
      </div>
      <MenuItems className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
        <div className='px-4 py-2 text-sm text-text-body'>
          <div className='font-medium'>{userName}</div>
          <div className='text-xs text-text-body/70'>{userEmail}</div>
        </div>
        {userNavigation.map((item) => (
          <MenuItem key={item.name}>
            {({ active }) => (
              <Link
                href={item.href}
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-text-body',
                )}
                onClick={item.name === 'Sign out' ? handleSignOut : undefined}>
                {item.name}
              </Link>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
