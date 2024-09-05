import { GET_USER_WALLETS } from '@/app/lib/graphql/queries/wallet'; // Adjust this import path as needed
import { Wallet } from '@/types';
import { useQuery } from '@apollo/client';

interface GetUserWalletsData {
  getUserWallets: Wallet[];
}

export function useUserWallets() {
  const { data, loading, error, refetch } = useQuery<GetUserWalletsData>(GET_USER_WALLETS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    wallets: data?.getUserWallets || [],
    isLoading: loading,
    error: error ? error.message : null,
    refetch: () => refetch({ fetchPolicy: 'network-only' }),
  };
}
