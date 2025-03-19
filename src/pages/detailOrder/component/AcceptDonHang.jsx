import { FaPrint } from "react-icons/fa6";
import { GrFormPreviousLink } from "react-icons/gr";
import { GrFormNextLink } from "react-icons/gr";
export default function AcceptDonHang({chuyenTrangThaiHoaDon, hoaDon}) {
  return (
    <div className="flex items-center px-6 w-full h-[70px] bg-white rounded-lg shadow mb-4 relative ">
        {hoaDon?.loaiDon === 0 && 
        (
          <div className="grid grid-cols-3 w-1/3 gap-4">
          {(hoaDon?.trangThaiGiaoHang !==8 && hoaDon?.trangThaiGiaoHang !==4 && hoaDon?.trangThaiGiaoHang !==5) && (
            <button className="btn bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 duration-200">
            <GrFormPreviousLink className="text-xl" />
              Quay lại
              </button>
          )}
         {(hoaDon?.trangThaiGiaoHang !==5 && hoaDon?.trangThaiGiaoHang !==8) && (
          <>
           <button onClick={chuyenTrangThaiHoaDon}
           className="btn bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 duration-200">
             Chuyển
             <GrFormNextLink className="text-xl" />
           </button>
            <button className="btn hover:scale-105 duration-200">Hủy</button>
          </>
         )}
         {hoaDon?.trangThaiGiaoHang ===5 && (
          <h1 className="text-xl font-bold top-6 text-orange-500 absolute">Đơn hàng đã hoàn thành</h1>
         )}
         
        </div>
        )}
        <div className="absolute right-5 top-3 flex space-x-4">
          <button className="btn bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 duration-200">
            In
            <FaPrint />
          </button>
          <button className="btn bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 duration-200">
            Chi tiết
          </button>
        </div>
    </div>
  );
}
