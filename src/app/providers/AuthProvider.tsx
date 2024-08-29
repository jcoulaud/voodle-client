import { SEND_MAGIC_LINK, VERIFY_MAGIC_LINK } from '@/app/lib/graphql/mutations/auth';
import { ME } from '@/app/lib/graphql/queries/user';
import { useApolloClient } from '@apollo/client';
import Cookies from 'js-cookie';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  sendMagicLink: (email: string) => Promise<void>;
  verifyMagicLink: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await client.query({
        query: ME,
      });
      setUser(data.me);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      Cookies.remove('accessToken');
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    const token = Cookies.get('accessToken');
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

  const verifyMagicLink = async (token: string) => {
    const { data } = await client.mutate({
      mutation: VERIFY_MAGIC_LINK,
      variables: { token },
    });
    if (data.verifyMagicLink.success) {
      await fetchUser();
    } else {
      throw new Error(data.verifyMagicLink.message);
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    setUser(null);
    client.resetStore();
  };

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
