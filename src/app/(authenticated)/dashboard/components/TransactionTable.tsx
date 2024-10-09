import { Badge } from '@/app/components/ui';
import { Transaction } from '@/types/transaction.types';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className='flow-root'>
      <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
          <table className='min-w-full divide-y divide-gray-300'>
            <thead>
              <tr>
                <th
                  scope='col'
                  className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-title sm:pl-0'>
                  Type
                </th>
                <th
                  scope='col'
                  className='px-3 py-3.5 text-left text-sm font-semibold text-text-title'>
                  Tokens
                </th>
                <th
                  scope='col'
                  className='px-3 py-3.5 text-left text-sm font-semibold text-text-title'>
                  TON
                </th>
                <th
                  scope='col'
                  className='px-3 py-3.5 text-left text-sm font-semibold text-text-title'>
                  Price
                </th>
                <th
                  scope='col'
                  className='px-3 py-3.5 text-left text-sm font-semibold text-text-title'>
                  Status
                </th>
                <th
                  scope='col'
                  className='px-3 py-3.5 text-left text-sm font-semibold text-text-title'>
                  Date
                </th>
                <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0 w-10'>
                  <span className='sr-only'>Explorer</span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text-title sm:pl-0'>
                    <Badge variant={transaction.type === 'buy' ? 'green' : 'red'}>
                      {transaction.type}
                    </Badge>
                  </td>
                  <td className='whitespace-nowrap px-3 py-4 text-sm text-text-body'>
                    {Number(transaction.amount_token).toFixed(3)}
                  </td>
                  <td className='whitespace-nowrap px-3 py-4 text-sm text-text-body'>
                    {transaction.amount_ton} TON
                  </td>
                  <td className='whitespace-nowrap px-3 py-4 text-sm text-text-body'>
                    ${transaction.price_in_usd}
                  </td>
                  <td className='whitespace-nowrap px-3 py-4 text-sm text-text-body'>
                    <Badge
                      variant={
                        transaction.status === 'success'
                          ? 'green'
                          : transaction.status === 'failed'
                          ? 'red'
                          : 'yellow'
                      }>
                      {transaction.status}
                    </Badge>
                  </td>
                  <td className='whitespace-nowrap px-3 py-4 text-sm text-text-body'>
                    {format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm:ss')}
                  </td>
                  <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 w-10'>
                    {transaction.transaction_id && (
                      <a
                        href={`https://tonviewer.com/transaction/${transaction.transaction_id}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-gray-400 hover:text-gray-600'>
                        <ExternalLink className='h-5 w-5' />
                        <span className='sr-only'>View transaction {transaction.id}</span>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
