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
    <>
      <div className='px-4 sm:px-0 mb-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>Wallet</h1>
        <p className='mt-1 text-sm text-gray-600'>
          Find all your personal wallets here (more blockchains coming soon).
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {wallets.map((wallet, index) => (
          <Wallet key={index} wallet={wallet} />
        ))}
      </div>
    </>
  );
};

export default WalletsPage;
