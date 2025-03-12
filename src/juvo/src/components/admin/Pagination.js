import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
                ◁
            </button>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
                ▷
            </button>
        </div>
    );
}

export default Pagination;