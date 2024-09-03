import { Card } from '@/app/components/ui/Card';
import { Wallet as WalletType } from '@/types';
import { Copy, ExternalLink, Eye, Key } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface WalletCardProps {
  wallet: WalletType;
}

export const Wallet: React.FC<WalletCardProps> = ({ wallet }) => {
  const [showFullAddress, setShowFullAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(wallet.address)
      .then(() => toast.success('Address copied to clipboard!'))
      .catch(() => toast.error('Failed to copy address. Please try again.'));
  };

  const handleShowPrivateKey = () => {
    // TODO: call a query to get the private key
  };

  return (
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
            <div className='mt-1 flex items-center space-x-2'>
              <div className='flex-1 bg-gray-100 rounded p-2 font-mono text-sm'>
                {showFullAddress
                  ? wallet.address
                  : `${wallet.address.slice(0, 8)}...${wallet.address.slice(-8)}`}
              </div>
              <button
                onClick={() => setShowFullAddress(!showFullAddress)}
                className='p-2 text-gray-500 hover:text-gray-700'>
                <Eye className='h-5 w-5' />
              </button>
              <button onClick={handleCopyAddress} className='p-2 text-gray-500 hover:text-gray-700'>
                <Copy className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
