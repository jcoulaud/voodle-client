import { LoadingSpinner } from '@/app/components/ui';
import { Card } from '@/app/components/ui/Card';
import { Dialog } from '@/app/components/ui/Dialog';
import { GET_WALLET_PRIVATE_KEY } from '@/app/lib/graphql/queries/wallet';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { Wallet as WalletType } from '@/types';
import { useLazyQuery } from '@apollo/client';
import { Copy, ExternalLink, Eye, EyeOff, Key, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface WalletCardProps {
  wallet: WalletType;
}

export const Wallet: React.FC<WalletCardProps> = ({ wallet }) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [isPrivateKeyDialogOpen, setIsPrivateKeyDialogOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const { balance, isLoadingBalance, refreshBalance } = useWalletBalance(wallet.address);

  const [getWalletPrivateKey, { loading: privateKeyLoading }] = useLazyQuery(
    GET_WALLET_PRIVATE_KEY,
    {
      variables: { address: wallet.address },
      onCompleted: (data) => setPrivateKey(data.getWalletPrivateKey),
    },
  );

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(wallet.address)
      .then(() => toast.success('Address copied to clipboard!'))
      .catch(() => toast.error('Failed to copy address. Please try again.'));
  };

  const handleShowPrivateKey = () => {
    setIsPrivateKeyDialogOpen(true);
    if (!privateKey) {
      handleConfirmShowPrivateKey();
    }
  };

  const handleConfirmShowPrivateKey = () => {
    getWalletPrivateKey({ variables: { address: wallet.address } });
  };

  const handleCopyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard
        .writeText(privateKey)
        .then(() => toast.success('Private key copied to clipboard!'))
        .catch(() => toast.error('Failed to copy private key. Please try again.'));
    }
  };

  const toggleShowPrivateKey = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  return (
    <>
      <Card>
        <Card.Header
          title={`Blockchain: ${
            wallet.blockchain.charAt(0).toUpperCase() + wallet.blockchain.slice(1)
          }`}
          menu={{
            items: [
              {
                label: 'View on Explorer',
                icon: <ExternalLink className='h-4 w-4' />,
                onClick: () => {
                  switch (wallet.blockchain) {
                    case 'ton':
                      window.open(`https://tonscan.org/address/${wallet.address}`, '_blank');
                      break;
                    default:
                      console.warn(`Explorer not implemented for blockchain: ${wallet.blockchain}`);
                  }
                },
              },
              {
                label: 'Show Private Key',
                icon: <Key className='h-4 w-4' />,
                onClick: handleShowPrivateKey,
              },
            ],
          }}
        />
        <Card.Content>
          <div className='space-y-4'>
            <div>
              <Card.Description>Public Address</Card.Description>
              <div className='mt-1 flex items-start space-x-2'>
                <div className='flex-1 bg-gray-100 rounded p-2 font-mono text-sm break-all'>
                  {showFullAddress
                    ? wallet.address
                    : `${wallet.address.slice(0, 8)}...${wallet.address.slice(-8)}`}
                </div>
                <button
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  className='p-2 text-gray-500 hover:text-gray-700 flex-shrink-0'>
                  {showFullAddress ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
                <button
                  onClick={handleCopyAddress}
                  className='p-2 text-gray-500 hover:text-gray-700 flex-shrink-0'>
                  <Copy className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div>
              <Card.Description>Balance</Card.Description>
              <div className='mt-1 flex items-center space-x-2'>
                <div className='flex-1 bg-gray-100 rounded p-2 font-mono text-sm min-h-[2.5rem] flex items-center'>
                  {isLoadingBalance ? <LoadingSpinner size={20} /> : `${balance} TON`}
                </div>
                <button
                  onClick={refreshBalance}
                  className='p-2 text-gray-500 hover:text-gray-700'
                  disabled={isLoadingBalance}>
                  <RefreshCw className={`h-5 w-5 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Dialog
        open={isPrivateKeyDialogOpen}
        onClose={() => {
          setIsPrivateKeyDialogOpen(false);
          setShowPrivateKey(false);
        }}
        title='Warning: Private Key Access'
        description='Your private key is sensitive information. Never share it with anyone.'
        variant='danger'
        blurContent={true}
        primaryAction={{
          label: 'Close',
          onClick: () => {
            setIsPrivateKeyDialogOpen(false);
            setShowPrivateKey(false);
          },
        }}>
        {privateKeyLoading && <p>Loading private key...</p>}
        {privateKey && (
          <div className='mt-4'>
            <p className='text-sm font-medium text-gray-900'>Private Key:</p>
            <div className='relative mt-2'>
              <div className='bg-gray-100 rounded p-2 pr-20 overflow-hidden'>
                <p
                  className={`text-sm text-gray-600 font-mono break-all ${
                    showPrivateKey ? '' : 'filter blur-sm select-none'
                  }`}>
                  {privateKey}
                </p>
              </div>
              <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2'>
                <button
                  onClick={toggleShowPrivateKey}
                  className='p-1 rounded-full bg-gray-200 hover:bg-gray-300'>
                  {showPrivateKey ? (
                    <EyeOff className='h-5 w-5 text-gray-600' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-600' />
                  )}
                </button>
                <button
                  onClick={handleCopyPrivateKey}
                  className='p-1 rounded-full bg-gray-200 hover:bg-gray-300'>
                  <Copy className='h-5 w-5 text-gray-600' />
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};
