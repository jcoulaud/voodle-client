import { GET_WALLET_BALANCE } from '@/app/lib/graphql/queries/wallet';
import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

export const useWalletBalance = (address: string) => {
  const [balance, setBalance] = useState<string | null>(null);

  const [getWalletBalance, { loading: isLoadingBalance }] = useLazyQuery(GET_WALLET_BALANCE, {
    variables: { address },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const rawBalance = data.getWalletBalance;
      const formattedBalance = formatBalance(rawBalance);
      setBalance(formattedBalance);
    },
  });

  const formatBalance = useCallback((rawBalance: string): string => {
    const decimals = 9; // TON decimals
    const balanceNum = parseFloat(rawBalance);
    if (isNaN(balanceNum)) return 'Invalid';
    return (balanceNum / Math.pow(10, decimals)).toString();
  }, []);

  useEffect(() => {
    const fetchBalance = () => {
      if (address) {
        getWalletBalance();
      }
    };
    fetchBalance();
    const intervalId = setInterval(fetchBalance, 30000);
    return () => clearInterval(intervalId);
  }, [address, getWalletBalance]);

  const refreshBalance = useCallback(() => {
    if (address) {
      getWalletBalance();
    }
  }, [address, getWalletBalance]);

  return { balance, isLoadingBalance, refreshBalance };
};
