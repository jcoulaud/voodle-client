import { LOGOUT, REFRESH_TOKEN } from '@/app/lib/graphql/mutations/auth';
import { ME } from '@/app/lib/graphql/queries/user';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export class TokenService {
  private static client: ApolloClient<NormalizedCacheObject> | null = null;

  static setClient(client: ApolloClient<NormalizedCacheObject>) {
    TokenService.client = client;
  }

  private static ensureClient(): ApolloClient<NormalizedCacheObject> {
    if (!TokenService.client) {
      throw new Error('Apollo Client not set. Call TokenService.setClient() first.');
    }
    return TokenService.client;
  }

  static async refreshTokens(): Promise<boolean> {
    try {
      const client = this.ensureClient();
      const { data } = await client.mutate({
        mutation: REFRESH_TOKEN,
      });
      return data?.refreshToken.success || false;
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
      return false;
    }
  }

  static async logout(): Promise<void> {
    try {
      const client = this.ensureClient();
      await client.mutate({
        mutation: LOGOUT,
      });
      await client.resetStore();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  static async checkAuthStatus(): Promise<boolean> {
    try {
      const client = this.ensureClient();
      await client.query({
        query: ME,
        fetchPolicy: 'network-only',
      });
      return true;
    } catch (error) {
      console.error('Failed to check auth status:', error);
      return false;
    }
  }
}
