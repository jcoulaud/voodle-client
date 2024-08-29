import {
  REFRESH_TOKEN,
  SEND_MAGIC_LINK,
  VERIFY_MAGIC_LINK,
} from '@/app/lib/graphql/mutations/auth';
import { ME } from '@/app/lib/graphql/queries/user';
import { TokenService } from '@/services/TokenService';
import { ApolloError, useApolloClient } from '@apollo/client';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendMagicLink: (email: string) => Promise<void>;
  verifyMagicLink: (token: string, email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  const fetchUser = useCallback(async () => {
    const refreshTokenAndRetry = async () => {
      try {
        const refreshToken = TokenService.getRefreshToken();
        if (refreshToken) {
          const { data } = await client.mutate({
            mutation: REFRESH_TOKEN,
            variables: { refreshToken },
          });
          if (data.refreshToken.success) {
            TokenService.setTokens({
              accessToken: data.refreshToken.accessToken,
              refreshToken: data.refreshToken.refreshToken,
            });
            await fetchUser();
          } else {
            throw new Error('Token refresh failed');
          }
        } else {
          throw new Error('No refresh token available');
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        TokenService.clearTokens();
        setUser(null);
      }
    };

    try {
      const { data } = await client.query({
        query: ME,
        fetchPolicy: 'network-only',
      });
      setUser(data.me);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (error instanceof ApolloError && error.message.includes('Unauthorized')) {
        await refreshTokenAndRetry();
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    const token = TokenService.getAccessToken();
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const sendMagicLink = async (email: string) => {
    const { data } = await client.mutate({
      mutation: SEND_MAGIC_LINK,
      variables: { email },
    });
    if (!data.sendMagicLink.success) {
      throw new Error(data.sendMagicLink.message);
    }
  };

  const verifyMagicLink = async (token: string, email: string) => {
    const { data } = await client.mutate({
      mutation: VERIFY_MAGIC_LINK,
      variables: { token, email },
    });
    if (data.verifyMagicLink.success) {
      TokenService.setTokens({
        accessToken: data.verifyMagicLink.accessToken,
        refreshToken: data.verifyMagicLink.refreshToken,
      });
      await fetchUser();
    } else {
      throw new Error(data.verifyMagicLink.message);
    }
  };

  const logout = useCallback(async () => {
    TokenService.clearTokens();
    setUser(null);
    await client.resetStore();
    window.location.href = '/';
  }, [client]);

  return (
    <AuthContext.Provider value={{ user, loading, sendMagicLink, verifyMagicLink, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
