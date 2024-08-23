import DashboardLayout from '@/app/components/DashboardLayout';
import AppProviders from '@/app/providers/AppProviders';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Yoloy',
  description: 'Trading Made Easy',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en' className='h-full'>
      <body className={`${inter.className} h-full`}>
        <AppProviders session={session}>
          <DashboardLayout
            userName={session?.user?.name ?? 'Julien'}
            userEmail={session?.user?.email ?? 'julien@yoloy.ai'}>
            {children}
          </DashboardLayout>
        </AppProviders>
      </body>
    </html>
  );
}
