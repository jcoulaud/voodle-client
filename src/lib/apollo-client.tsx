import { TokenService } from '@/services/TokenService';
import { ApolloLink, HttpLink, NormalizedCacheObject, Observable } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED' || err.message.includes('jwt expired')) {
        return new Observable((observer) => {
          TokenService.refreshTokens()
            .then((success) => {
              if (success) {
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              } else {
                TokenService.removeCookies();
                observer.complete();
              }
            })
            .catch((error) => {
              TokenService.removeCookies();
              observer.complete();
            });
        });
      }
    }
  }
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

function makeClient(): ApolloClient<NormalizedCacheObject> {
  const client = new ApolloClient<NormalizedCacheObject>({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });

  TokenService.setClient(client);
  return client;
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
