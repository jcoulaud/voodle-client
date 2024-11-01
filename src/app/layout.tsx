import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AppProviders from './providers/AppProviders';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Voodle',
  description: 'Simple Crypto Trading for Everyone',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='h-full'>
      <body className={inter.className}>
        <AppProviders>
          {children}
          <Toaster position='top-center' />
        </AppProviders>
      </body>
    </html>
  );
}
