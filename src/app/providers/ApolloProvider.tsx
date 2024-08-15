'use client';

import { useApollo } from '@/hooks/useApollo';
import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';

interface ApolloWrapperProps {
  children: ReactNode;
}

export default function ApolloWrapper({ children }: ApolloWrapperProps): JSX.Element {
  const client = useApollo();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
