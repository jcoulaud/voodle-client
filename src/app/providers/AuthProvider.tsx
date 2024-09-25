import { Dialog } from '@/app/components/ui/Dialog';
import { LOGOUT, SEND_MAGIC_LINK, VERIFY_MAGIC_LINK } from '@/app/lib/graphql/mutations/auth';
import { ME } from '@/app/lib/graphql/queries/user';
import { TokenService } from '@/services/TokenService';
import { MeQueryResponse, SendMagicLinkResponse, VerifyMagicLinkResponse } from '@/types';
import { useApolloClient } from '@apollo/client';
import { useLogger } from 'next-axiom';
import { useRouter } from 'next/navigation';
import { createContext, memo, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendMagicLink: (email: string) => Promise<void>;
  verifyMagicLink: (token: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [isMnemonicDialogOpen, setIsMnemonicDialogOpen] = useState(false);
  const client = useApolloClient();
  const verificationAttempted = useRef(false);
  const router = useRouter();
  const log = useLogger();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.query<MeQueryResponse>({
        query: ME,
        fetchPolicy: 'network-only',
      });
      log.debug('User logged in', data.me);
      setUser(data.me);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [client, log]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const sendMagicLink = async (email: string): Promise<void> => {
    const { data } = await client.mutate<SendMagicLinkResponse>({
      mutation: SEND_MAGIC_LINK,
      variables: { email },
    });
    if (!data?.sendMagicLink.success) {
      throw new Error(data?.sendMagicLink.message || 'Failed to send magic link');
    }
  };

  const verifyMagicLink = useCallback(
    async (token: string, email: string): Promise<void> => {
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

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await client.mutate({
        mutation: LOGOUT,
      });
      setUser(null);
      await TokenService.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  }, [client, router]);

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
});

AuthProvider.displayName = 'AuthProvider';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
