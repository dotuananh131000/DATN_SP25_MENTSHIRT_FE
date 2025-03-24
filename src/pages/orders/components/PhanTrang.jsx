import ReactPaginate from "react-paginate";
export default function PhanTrang ({size,setSize, page, setPage, totalPages}) {
  return (
   <>
    <div className="flex items-center mt-4 px-2 relative">
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="select select-bordered "
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <div className="flex items-center absolute right-2">
          <ReactPaginate
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(e) => setPage(e.selected)}
            forcePage={page}
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
   </>
  );
}
