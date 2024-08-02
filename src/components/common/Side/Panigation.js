import { Button } from "../../ui";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((page) => page + 1);

  return (
    <div className="mt-4 flex justify-center">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        primary
        hidden = {totalPages === 0 || currentPage === 1}
        className='mx-1 px-4'
      >
        Previous
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          primary
          className={`mx-1 px-4 ${
            currentPage === page
              ? "bg-green-900 text-white"
              : "hover:bg-green-300"
          }`}
        >
          {page}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        primary
        hidden = {totalPages === 0 || currentPage === totalPages}
        className='mx-1 px-4'
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
