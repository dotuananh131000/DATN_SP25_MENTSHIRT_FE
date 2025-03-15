export default function Button() {
  return (
    <div className="flex space-x-4">
      {/* Button Quét mã */}
      <button className="px-4 py-1 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white">
        Quét mã
      </button>

      {/* Button Tạo Hóa Đơn */}
      <button className="px-4 py-1 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white">
        Tạo Phiếu giảm giá
      </button>
    </div>
  );
}
