import React from "react";
import ReactPaginate from "react-paginate";
export default function PhanTrang({
  size,
  onSizeChange,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex justify-between mt-4">
      <div className="flex items-center space-x-2">
        <p>Xem</p>
        <select
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="border-1 border-orange-500 rounded px-4 py-2 bg-orange-100 text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <p>hóa đơn</p>
      </div>
      <div className="flex items-center">
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={(e) => onPageChange(e.selected)}
          forcePage={currentPage}
          containerClassName="flex justify-center items-center space-x-2"
          pageClassName="border border-gray-300 rounded"
          pageLinkClassName="px-3 py-1"
          activeClassName="bg-orange-500 text-white"
          previousClassName="border border-gray-300 rounded px-3 py-1"
          nextClassName="border border-gray-300 rounded px-3 py-1"
          disabledClassName="text-gray-300"
        />
      </div>
    </div>
  );
}
