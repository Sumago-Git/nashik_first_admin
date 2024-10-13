////some issue not working sos
import React, { createContext, useContext, useState } from 'react';

const PaginationContext = createContext();
const PaginationUpdateContext = createContext();

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0); // Initialize with page 0

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <PaginationContext.Provider value={currentPage}>
      <PaginationUpdateContext.Provider value={goToPage}>
        {children}
      </PaginationUpdateContext.Provider>
    </PaginationContext.Provider>
  );
};

export const usePagination = () => useContext(PaginationContext);
export const usePaginationUpdate = () => useContext(PaginationUpdateContext);