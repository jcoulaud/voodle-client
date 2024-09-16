import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const Pagination: React.FC<PaginationProps> = memo(
  ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const { startItem, endItem, pageNumbers, hasPrevious, hasNext } = useMemo(() => {
      const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, totalItems);
      const hasPrev = currentPage > 1;
      const hasNext = currentPage < totalPages;

      const numbers = [];
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
          numbers.push(i);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
          numbers.push('...');
        }
      }

      return {
        startItem: start,
        endItem: end,
        pageNumbers: numbers,
        hasPrevious: hasPrev,
        hasNext: hasNext,
      };
    }, [currentPage, totalPages, totalItems, itemsPerPage]);

    const handlePageChange = (page: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    };

    const renderPageButton = (number: number | string, index: number) => {
      if (number === '...') {
        return (
          <span
            key={index}
            className='relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0'>
            ...
          </span>
        );
      }

      return (
        <a
          key={index}
          href='#'
          onClick={handlePageChange(number as number)}
          aria-current={number === currentPage ? 'page' : undefined}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            number === currentPage
              ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              : 'text-text-title ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
          }`}>
          {number}
        </a>
      );
    };

    const arrowButtonClass = (enabled: boolean) => `
      relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300
      ${
        enabled
          ? 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
          : 'opacity-50 cursor-not-allowed'
      }
    `;

    return (
      <div className='flex items-center justify-between border-t border-gray-200 bg-white py-3'>
        {/* Mobile pagination */}
        <div className='flex flex-1 justify-end sm:hidden mt-2'>
          <a
            href='#'
            onClick={hasPrevious ? handlePageChange(currentPage - 1) : undefined}
            className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
              hasPrevious ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
            }`}>
            Previous
          </a>
          <a
            href='#'
            onClick={hasNext ? handlePageChange(currentPage + 1) : undefined}
            className={`relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
              hasNext ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
            }`}>
            Next
          </a>
        </div>

        {/* Desktop pagination */}
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
                onClick={hasPrevious ? handlePageChange(currentPage - 1) : undefined}
                className={`${arrowButtonClass(hasPrevious)} rounded-l-md`}
                aria-disabled={!hasPrevious}>
                <span className='sr-only'>Previous</span>
                <ChevronLeft className='h-5 w-5' aria-hidden='true' />
              </a>
              {pageNumbers.map(renderPageButton)}
              <a
                href='#'
                onClick={hasNext ? handlePageChange(currentPage + 1) : undefined}
                className={`${arrowButtonClass(hasNext)} rounded-r-md`}
                aria-disabled={!hasNext}>
                <span className='sr-only'>Next</span>
                <ChevronRight className='h-5 w-5' aria-hidden='true' />
              </a>
            </nav>
          </div>
        </div>
      </div>
    );
  },
);

Pagination.displayName = 'Pagination';
