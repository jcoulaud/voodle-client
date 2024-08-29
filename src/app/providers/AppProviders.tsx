'use client';

import { ReactNode } from 'react';
import { ApolloWrapper } from './ApolloProvider';
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
