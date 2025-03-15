import { FaPrint } from "react-icons/fa6";
export default function AcceptDonHang() {
  return (
    <div className="w-full h-[70px] bg-white rounded-lg shadow mb-4 ">
      <div className="flex justify-between items-center h-full px-6">
        <div className="flex space-x-4">
          <button className="btn bg-orange-500 text-white hover:bg-orange-600">
            Xác nhận
          </button>
          <button className="btn">Hủy</button>
        </div>
        <div className="flex space-x-4">
          <button className="btn bg-orange-500 text-white hover:bg-orange-600">
            In
            <FaPrint />
          </button>
          <button className="btn bg-orange-500 text-white hover:bg-orange-600">
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
