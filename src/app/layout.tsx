import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { Inter } from 'next/font/google';
import AppProviders from './providers/AppProviders';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Yoloy',
  description: 'Trading Made Easy',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body className={inter.className}>
        <AppProviders session={session}>{children}</AppProviders>
      </body>
    </html>
  );
}
