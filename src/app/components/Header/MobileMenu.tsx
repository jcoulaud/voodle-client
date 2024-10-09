import { DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { usePathname } from 'next/navigation';
import Avatar from './Avatar';
import { mainNavigation, userNavigation } from './navigation';

interface MobileMenuProps {
  userName: string;
  userEmail: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function MobileMenu({ userName, userEmail }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <DisclosurePanel className='sm:hidden'>
      <div className='space-y-1 pb-3 pt-2'>
        {mainNavigation.map((item) => (
          <DisclosureButton
            key={item.name}
            as='a'
            href={item.href}
            className={classNames(
              pathname === item.href
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-transparent text-text-body hover:border-primary',
              'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
            )}
            aria-current={pathname === item.href ? 'page' : undefined}>
            {item.name}
          </DisclosureButton>
        ))}
      </div>
      <div className='border-t border-border pb-3 pt-4'>
        <div className='flex items-center px-4'>
          <div className='flex-shrink-0'>
            <Avatar userName={userName} size={40} />
          </div>
          <div className='ml-3'>
            <div className='text-base font-medium text-text-body'>{userName}</div>
            <div className='text-sm font-medium text-text-body/70'>{userEmail}</div>
          </div>
        </div>
        <div className='mt-3 space-y-1'>
          {userNavigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as='a'
              href={item.href}
              className='block px-4 py-2 text-base font-medium text-text-body'>
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </div>
    </DisclosurePanel>
  );
}
