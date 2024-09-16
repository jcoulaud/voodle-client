'use client';

import { LoadingSpinner, PageHeader, Pagination } from '@/app/components/ui';
import { GET_USER_TRANSACTIONS } from '@/app/lib/graphql/queries/transaction';
import { useUserWallets } from '@/hooks/useUserWallets';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyTransactionCard } from './components/EmptyTransactionCard';
import { TransactionTable } from './components/TransactionTable';

const POLL_INTERVAL = 30000;
const LIMIT = 10;

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [hasFunds, setHasFunds] = useState(false);

  const { wallets, isLoading: isLoadingWallets, error: errorWallets } = useUserWallets();
  const primaryWalletAddress = wallets?.[0]?.address ?? '';
  const { balance, isLoadingBalance } = useWalletBalance(primaryWalletAddress);

  useEffect(() => {
    console.log('balance', balance);
    if (balance && Number(balance) > 0) {
      setHasFunds(true);
    }
  }, [balance]);

  const {
    data,
    loading: isLoadingTransactions,
    error: errorTransactions,
  } = useQuery(GET_USER_TRANSACTIONS, {
    variables: { page, limit: LIMIT },
    pollInterval: POLL_INTERVAL,
  });

  if (isLoadingWallets || isLoadingTransactions || isLoadingBalance) return <LoadingSpinner />;

  if (errorWallets || errorTransactions) {
    toast.error(`Error: ${errorWallets || errorTransactions}`);
    return null;
  }

  const { data: transactions, total } = data.getUserTransactions;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <PageHeader
        title='Transaction History'
        description='All the transactions executed by your strategies.'
      />

      <div>
        {transactions.length === 0 ? (
          <EmptyTransactionCard hasFunds={hasFunds} />
        ) : (
          <>
            <TransactionTable transactions={transactions} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={total}
              itemsPerPage={LIMIT}
            />
          </>
        )}
      </div>
    </>
  );
}
