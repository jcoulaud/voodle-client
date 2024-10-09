import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { mainNavigation } from './navigation';

interface NavigationItem {
  name: string;
  href: string;
}

const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ');

const isActiveLink = (pathname: string | null, href: string): boolean =>
  pathname !== null && (pathname === href || pathname.startsWith(`${href}/`));

export default function MainMenu() {
  const pathname = usePathname();

  const menuItems = useMemo(
    () =>
      mainNavigation.map((item: NavigationItem) => ({
        ...item,
        isActive: isActiveLink(pathname, item.href),
      })),
    [pathname],
  );

  return (
    <nav className='hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8'>
      {menuItems.map(({ name, href, isActive }) => (
        <Link
          key={name}
          href={href}
          className={classNames(
            isActive
              ? 'border-primary text-text-body'
              : 'border-transparent text-text-body hover:border-primary/50',
            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
          )}
          aria-current={isActive ? 'page' : undefined}>
          {name}
        </Link>
      ))}
    </nav>
  );
}
