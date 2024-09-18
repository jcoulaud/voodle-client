import { ME } from '@/app/lib/graphql/queries/user';
import { ExtendedUser } from '@/types/next-auth';
import { useQuery } from '@apollo/client';

export function useUser() {
  const { data, loading, error } = useQuery<{ me: ExtendedUser }>(ME, {
    fetchPolicy: 'network-only',
  });

  return {
    user: data?.me,
    isLoading: loading,
    error,
    isAuthenticated: !!data?.me,
  };
}
