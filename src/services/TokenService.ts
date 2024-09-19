import { REFRESH_TOKEN } from '@/app/lib/graphql/mutations/auth';
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

  static async checkAuthStatus(): Promise<boolean> {
    try {
      const client = this.ensureClient();
      const { data } = await client.query({
        query: ME,
        fetchPolicy: 'network-only',
      });
      return !!data.me;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
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

  static removeCookies(): void {
    if (typeof document !== 'undefined') {
      const cookieOptions = 'path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      document.cookie = `accessToken=;${cookieOptions}`;
      document.cookie = `refreshToken=;${cookieOptions}`;
    }
  }
}
