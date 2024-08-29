'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import { useAuth } from '@/app/providers/AuthProvider';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <DashboardLayout userName={user?.name ?? 'User'} userEmail={user?.email ?? 'user@example.com'}>
      {children}
    </DashboardLayout>
  );
}
