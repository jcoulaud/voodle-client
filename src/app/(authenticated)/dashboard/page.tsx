'use client';

import { LoadingSpinner, Pagination } from '@/app/components/ui';
import { GET_USER_TRANSACTIONS } from '@/app/lib/graphql/queries/transaction';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { TransactionTable } from './components/TransactionTable';

const POLL_INTERVAL = 30000;
const LIMIT = 10;

export default function Dashboard() {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery(GET_USER_TRANSACTIONS, {
    variables: { page, limit: LIMIT },
    pollInterval: POLL_INTERVAL,
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  const { data: transactions, total } = data.getUserTransactions;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <div className='px-4 sm:px-0 mb-6'>
        <h1 className='text-2xl font-semibold text-text-title'>Transaction History</h1>
        <div className='mt-1 flex items-center justify-between'>
          <p className='text-sm text-gray-600'>All the transactions executed by your strategies.</p>
        </div>
      </div>

      <div>
        <TransactionTable transactions={transactions} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={total}
          itemsPerPage={LIMIT}
        />
      </div>
    </>
  );
}
