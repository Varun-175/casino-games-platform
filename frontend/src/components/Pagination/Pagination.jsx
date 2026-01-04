// src/components/Pagination/Pagination.jsx
import { useCallback } from "react";
import "./Pagination.css";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  loading 
}) => {
  const pagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  const handlePageChange = useCallback((page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  }, [currentPage, onPageChange]);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="page-btn prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          className={`page-btn ${page === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(page)}
          disabled={loading}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        aria-label="Next page"
      >
        Next →
      </button>

      <span className="pagination-info">
        Page {currentPage} of {totalPages} ({totalItems} total)
      </span>
    </div>
  );
};

export default Pagination;
