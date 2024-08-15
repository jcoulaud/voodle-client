import { initializeApollo } from '@/lib/apollo-client';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';

export function useApollo(initialState: any): ApolloClient<NormalizedCacheObject> {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
