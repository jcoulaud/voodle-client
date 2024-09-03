'use client';

import { LoadingSpinner } from '@/app/components/ui';
import { GET_USER_WALLETS } from '@/app/lib/graphql/queries/wallet';
import { GetUserWalletsData } from '@/types';
import { useQuery } from '@apollo/client';
import { Wallet } from './components/Wallet';

const WalletsPage: React.FC = () => {
  const { data, loading, error } = useQuery<GetUserWalletsData>(GET_USER_WALLETS);

  if (loading) return <LoadingSpinner size={48} className='h-screen' />;
  if (error) return <p className='text-red-500'>Error: {error.message}</p>;

  const wallets = data?.getUserWallets || [];

  return (
    <div className='min-h-screen'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900'>My Wallets</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {wallets.map((wallet, index) => (
          <Wallet key={index} wallet={wallet} />
        ))}
      </div>
    </div>
  );
};

export default WalletsPage;
