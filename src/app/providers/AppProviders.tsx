'use client';

import { ApolloWrapper } from '@/lib/apollo-client';
import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ApolloWrapper>
      <AuthProvider>{children}</AuthProvider>
    </ApolloWrapper>
  );
}
