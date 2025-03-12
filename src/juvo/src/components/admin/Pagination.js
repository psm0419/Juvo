import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const isPrevDisabled = currentPage === 1 || totalPages === 0;
    const isNextDisabled = currentPage === totalPages || totalPages === 0;

    return (
        <div className="pagination">
            <button onClick={handlePrev} disabled={isPrevDisabled}>
                ◁
            </button>
            <button onClick={handleNext} disabled={isNextDisabled}>
                ▷
            </button>
        </div>
    );
}

export default Pagination;