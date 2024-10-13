//having some issue not working properly 
// TablePagination.js
import React from 'react';
import ReactPaginate from 'react-paginate';


const TablePagination = ({ totalPages, handlePageClick }) => {


  const handlePageChange = (selectedPage) => {
    goToPage(selectedPage);
  };

  return (
    <ReactPaginate
      previousLabel={'Previous'}
      nextLabel={'Next'}
      breakLabel={'...'}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageChange}
      containerClassName={'pagination justify-content-end'}
      activeClassName={'active'}
      pageClassName={'page-item'}
      pageLinkClassName={'page-link'}
      previousClassName={'page-item'}
      nextClassName={'page-item'}
      previousLinkClassName={'page-link'}
      nextLinkClassName={'page-link'}
    />
  );
};

export default TablePagination;



