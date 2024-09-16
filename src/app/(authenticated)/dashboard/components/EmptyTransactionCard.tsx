import { Card } from '@/app/components/ui';
import { Button } from '@/app/components/ui/Button';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface EmptyTransactionCardProps {
  hasFunds: boolean;
}

export const EmptyTransactionCard: React.FC<EmptyTransactionCardProps> = ({ hasFunds }) => {
  return (
    <Card className='text-center py-12'>
      <Card.Content>
        <div className='mx-auto h-12 w-12 text-gray-400'>
          <BarChart3 className='h-12 w-12' />
        </div>
        <h3 className='mt-2 text-lg font-semibold text-text-title'>No transactions yet</h3>
        <p className='mt-1 text-sm text-text-body'>
          Your transaction history will appear here once you start executing strategies.
          <br />
          You need to fund your wallet first in order to create a strategy.
        </p>
        <div className='mt-6 flex justify-center space-x-3'>
          <Button variant='primary' disabled={!hasFunds}>
            <Link href='/strategies/create-strategy'>Create Strategy</Link>
          </Button>
          <Button variant='secondary'>
            <Link href='/wallets'>Fund Wallet</Link>
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};
