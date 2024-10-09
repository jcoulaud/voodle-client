import { ME } from '@/app/lib/graphql/queries/user';
import { TokenService } from '@/services/TokenService';
import { ExtendedUser } from '@/types/next-auth';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

export function useUser() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data, loading, error } = useQuery<{ me: ExtendedUser }>(ME, {
    fetchPolicy: 'network-only',
    skip: !isAuthenticated,
  });

  useEffect(() => {
    TokenService.checkAuthStatus().then(setIsAuthenticated);
  }, []);

  return {
    user: data?.me,
    isLoading: loading || isAuthenticated === null,
    error,
    isAuthenticated,
  };
}
