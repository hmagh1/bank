import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages);
  
  if (endPage - startPage < maxVisiblePages) {
    startPage = Math.max(0, endPage - maxVisiblePages);
  }

  for (let i = startPage; i < endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(0)} 
        disabled={currentPage === 0}
      >
        ⏮️
      </button>
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 0}
      >
        ◀️
      </button>
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? 'active' : ''}
        >
          {page + 1}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage >= totalPages - 1}
      >
        ▶️
      </button>
      <button 
        onClick={() => onPageChange(totalPages - 1)} 
        disabled={currentPage >= totalPages - 1}
      >
        ⏭️
      </button>
    </div>
  );
};

export default Pagination;
