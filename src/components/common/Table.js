import { useState } from "react";
import { Input, Button } from "../ui";

const Table = ({
  columns,
  data,
  pageIndex,
  keyword,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onKeywordChange,
  total,
  pageSizeOptions = [5, 20, 30, 40],
}) => {
  const canPreviousPage = pageIndex !== 0 //(pageIndex + 1) * pageSize >= total;
  const canNextPage = (pageIndex + 1) * pageSize < total;
  const [key, setKey] = useState(keyword);

  const handlePageChange = (newPageIndex) => {
    onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    onPageSizeChange(newSize);
  };

  const hanldeSearch = () => {
    onKeywordChange(key);
  };

  return (
    <div className="container mx-auto bg-orange-50 rounded-lg p-4 shadow-2xl border-solid border-2 border-green-900">
      <div className="overflow-x-auto shadow-md  rounded-lg border-solid border-2 border-green-600 border-b-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border-solid border-y-2 border-green-600"
                  >
                    {row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 items-center justify-between">
        <div className="flex items-center">
          <button
            className={`px-4 py-2 border rounded-lg ${
              canPreviousPage
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>
          <button
            className={`px-4 py-2 border rounded-lg ml-2 ${
              canNextPage
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={!canNextPage}
          >
            {">"}
          </button>
          <span className="ml-4 text-sm text-gray-700">
            Page {pageIndex + 1} of {Math.ceil(total / pageSize)}
          </span>
        </div>
        {!onKeywordChange || (
          <div className="w-full text-center flex col-span-3 col-start-2">
            <div className="w-7/12">
              <Input
                placeholder="Search..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />  
            </div>
            <Button className="rounded-r-lg" onClick={hanldeSearch}>
              Search
            </Button>
          </div>
        )}

        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-700">Show</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-2 py-1 border rounded-lg bg-white text-gray-700"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Table;
