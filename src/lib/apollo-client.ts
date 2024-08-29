import { REFRESH_TOKEN } from '@/app/lib/graphql/mutations/auth';
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const accessToken = Cookies.get('accessToken');
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

interface RefreshTokenResponse {
  refreshToken: {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
  };
}

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        return new Observable((observer) => {
          const client = operation.getContext().client as ApolloClient<NormalizedCacheObject>;
          client
            .mutate<RefreshTokenResponse>({
              mutation: REFRESH_TOKEN,
            })
            .then(({ data }) => {
              if (data?.refreshToken.success) {
                if (data.refreshToken.accessToken) {
                  Cookies.set('accessToken', data.refreshToken.accessToken, { expires: 1 / 96 }); // 15 minutes
                }
                if (data.refreshToken.refreshToken) {
                  Cookies.set('refreshToken', data.refreshToken.refreshToken, { expires: 7 }); // 7 days
                }
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${data.refreshToken.accessToken}`,
                  },
                });
                forward(operation).subscribe(observer);
              } else {
                observer.error(err);
              }
            })
            .catch((error: unknown) => {
              observer.error(error);
            });
        });
      }
    }
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}
