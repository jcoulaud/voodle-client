import { Dialog } from '@/app/components/ui/Dialog';
import {
  REFRESH_TOKEN,
  SEND_MAGIC_LINK,
  VERIFY_MAGIC_LINK,
} from '@/app/lib/graphql/mutations/auth';
import { ME } from '@/app/lib/graphql/queries/user';
import { TokenService } from '@/services/TokenService';
import { MeQueryResponse, SendMagicLinkResponse, VerifyMagicLinkResponse } from '@/types';
import { ApolloError, useApolloClient } from '@apollo/client';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

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
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [isMnemonicDialogOpen, setIsMnemonicDialogOpen] = useState(false);
  const client = useApolloClient();
  const verificationAttempted = useRef(false);

  const fetchUser = useCallback(async () => {
    const refreshTokenAndRetry = async () => {
      try {
        const refreshToken = TokenService.getRefreshToken();
        if (refreshToken) {
          const { data } = await client.mutate<{
            refreshToken: { success: boolean; accessToken: string; refreshToken: string };
          }>({
            mutation: REFRESH_TOKEN,
            variables: { refreshToken },
          });
          if (data?.refreshToken.success) {
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
      const { data } = await client.query<MeQueryResponse>({
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
    const { data } = await client.mutate<SendMagicLinkResponse>({
      mutation: SEND_MAGIC_LINK,
      variables: { email },
    });
    if (!data?.sendMagicLink.success) {
      throw new Error(data?.sendMagicLink.message || 'Failed to send magic link');
    }
  };

  const verifyMagicLink = useCallback(
    async (token: string, email: string) => {
      if (verificationAttempted.current) {
        console.log('Verification already attempted, skipping.');
        return;
      }

      verificationAttempted.current = true;

      try {
        const { data } = await client.mutate<VerifyMagicLinkResponse>({
          mutation: VERIFY_MAGIC_LINK,
          variables: { token, email },
        });
        if (data?.verifyMagicLink.success) {
          TokenService.setTokens({
            accessToken: data.verifyMagicLink.accessToken!,
            refreshToken: data.verifyMagicLink.refreshToken!,
          });
          await fetchUser();
          if ('mnemonic' in data.verifyMagicLink) {
            setMnemonic(data.verifyMagicLink.mnemonic);
            setIsMnemonicDialogOpen(true);
          }
        } else {
          throw new Error(data?.verifyMagicLink.message || 'Verification failed');
        }
      } catch (error) {
        console.error('Error verifying magic link:', error);
        throw error;
      } finally {
        verificationAttempted.current = false;
      }
    },
    [client, fetchUser],
  );

  const logout = useCallback(async () => {
    TokenService.clearTokens();
    setUser(null);
    await client.resetStore();
    window.location.href = '/';
  }, [client]);

  return (
    <AuthContext.Provider value={{ user, loading, sendMagicLink, verifyMagicLink, logout }}>
      {children}
      <Dialog
        open={isMnemonicDialogOpen}
        onClose={() => setIsMnemonicDialogOpen(false)}
        title='Important: Your Recovery Phrase'
        description='This is your wallet recovery phrase. Write it down and store it securely. Never share it with anyone.'
        variant='warning'
        blurContent={true}
        primaryAction={{
          label: "I've stored it safely",
          onClick: () => setIsMnemonicDialogOpen(false),
        }}>
        {mnemonic && (
          <p className='my-6 text-sm text-gray-600 bg-gray-100 p-2 rounded mnemonic'>{mnemonic}</p>
        )}
      </Dialog>
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
