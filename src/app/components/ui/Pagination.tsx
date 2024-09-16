import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pageNumbers.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push('...');
    }
  }

  return (
    <div className='flex items-center justify-between border-t border-gray-200 bg-white py-3'>
      <div className='flex flex-1 justify-between sm:hidden'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage - 1);
          }}
          className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'>
          Previous
        </a>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage + 1);
          }}
          className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'>
          Next
        </a>
      </div>
      <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{startItem}</span> to{' '}
            <span className='font-medium'>{endItem}</span> of{' '}
            <span className='font-medium'>{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className='isolate inline-flex -space-x-px rounded-md shadow-sm'
            aria-label='Pagination'>
            <a
              href='#'
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
              className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'>
              <span className='sr-only'>Previous</span>
              <ChevronLeft className='h-5 w-5' aria-hidden='true' />
            </a>
            {pageNumbers.map((number, index) =>
              number === '...' ? (
                <span
                  key={index}
                  className='relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0'>
                  ...
                </span>
              ) : (
                <a
                  key={index}
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(number as number);
                  }}
                  aria-current={number === currentPage ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    number === currentPage
                      ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-text-title ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}>
                  {number}
                </a>
              ),
            )}
            <a
              href='#'
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
              className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'>
              <span className='sr-only'>Next</span>
              <ChevronRight className='h-5 w-5' aria-hidden='true' />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};
