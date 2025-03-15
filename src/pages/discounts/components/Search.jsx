export default function Search() {
  return (
    <div className="flex items-center bg-white border border-orange-500 rounded-lg pr-4  shadow-sm w-32rem max-w-full">
      {/* Button */}
      <button className="text-orange-500 px-4 py-1 mr-2 bg-white-100 rounded-md hover:bg-orange-100">
        Tìm kiếm
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder="Tìm Phiếu Giảm Giá...."
        className="flex-1 outline-none placeholder-gray-400 text-gray-700"
      />
    </div>
  );
}
