import * as React from "react";

interface PaginProps {
  adsPerPage: number;
  totalAds: number;
  paginate: (arg: number) => void;
}

const Pagination: React.FC<PaginProps> = ({
  adsPerPage,
  totalAds,
  paginate,
}) => {
  const pageNumbers: Array<number> = [];

  for (let i = 1; i <= Math.ceil(totalAds / adsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number: number) => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
