import React from 'react';
import { PaginationProps } from './types';

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, handlePageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null; // Не отображать пагинацию, если страниц всего одна

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    const visiblePages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      visiblePages.push(1);
      if (startPage > 2) {
        visiblePages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        visiblePages.push('...');
      }
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  return (
    <div className="pagination">
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          className={`page-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => typeof page === 'number' && handlePageChange(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
