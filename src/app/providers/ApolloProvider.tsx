'use client';

import { useApollo } from '@/hooks/useApollo';
import { ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { ReactNode } from 'react';

interface ApolloWrapperProps {
  children: ReactNode;
  initialState?: NormalizedCacheObject | null;
}

export function ApolloWrapper({ children, initialState = null }: ApolloWrapperProps) {
  const client = useApollo(initialState);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
