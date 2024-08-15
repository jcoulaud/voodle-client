'use client';

import { Session } from 'next-auth';
import { ReactNode } from 'react';
import ApolloWrapper from './ApolloProvider';
import SessionProvider from './SessionProvider';

interface AppProvidersProps {
  children: ReactNode;
  session: Session | null;
}

export default function AppProviders({ children, session }: AppProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ApolloWrapper>{children}</ApolloWrapper>
    </SessionProvider>
  );
}
