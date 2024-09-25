'use client';

import { ApolloWrapper } from '@/lib/apollo-client';
import PlausibleProvider from 'next-plausible';
import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <PlausibleProvider domain={process.env.NEXT_PUBLIC_BASE_URL as string}>
      <ApolloWrapper>
        <AuthProvider>{children}</AuthProvider>
      </ApolloWrapper>
    </PlausibleProvider>
  );
}
