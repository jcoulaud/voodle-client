import HeaderMenu from '@/app/components/HeaderMenu';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <div className='min-h-screen bg-background-darker'>
      <HeaderMenu
        userName={session.user.name ?? 'User'}
        userEmail={session.user.email ?? 'user@example.com'}
      />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  );
}
