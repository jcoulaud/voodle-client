'use client';

import { LoadingSpinner, PageHeader } from '@/app/components/ui';
import { useUserWallets } from '@/hooks/useUserWallets';
import toast from 'react-hot-toast';
import { Wallet } from './components/Wallet';

const WalletsPage: React.FC = () => {
  const { wallets, isLoading: isLoadingWallets, error } = useUserWallets();

  if (isLoadingWallets) return <LoadingSpinner size={48} className='h-screen' />;

  if (error) {
    toast.error(`Error: ${error}`);
    return null;
  }

  return (
    <>
      <PageHeader
        title='Wallet'
        description='Find all your personal wallets here (more blockchains coming soon).'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {wallets.map((wallet, index) => (
          <Wallet key={index} wallet={wallet} />
        ))}
      </div>
    </>
  );
};

export default WalletsPage;
