'use client';

import { initializeApollo } from '@/lib/apollo-client';
import { ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { ReactNode } from 'react';

interface ApolloWrapperProps {
  children: ReactNode;
  initialState?: NormalizedCacheObject | null;
}

export function ApolloWrapper({ children, initialState = null }: ApolloWrapperProps) {
  const client = initializeApollo(initialState);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
