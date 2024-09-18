import { TokenService } from '@/services/TokenService';
import { ApolloLink, HttpLink, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
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

const authLink = setContext(async (_, { headers }) => ({
  headers: {
    ...headers,
  },
}));

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED' || err.message.includes('jwt expired')) {
        return new Observable((observer) => {
          TokenService.refreshTokens()
            .then((success) => {
              if (success) {
                forward(operation).subscribe(observer);
              } else {
                observer.error(err);
              }
            })
            .catch((error) => {
              observer.error(error);
            });
        });
      }
    }
  }
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

function makeClient() {
  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
  });

  TokenService.setClient(client);
  return client;
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
