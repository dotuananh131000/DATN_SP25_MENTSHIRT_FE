import dayjs from "dayjs";
import { memo, useMemo} from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";


function OrderTable({hoaDons, page, size, filters, error, loading, setIsOrderDetail, handleGetHoaDon}) {

  //Hàm lấy hóa đơn theo id
  const hanldleHoaDon = (id) => {
    setIsOrderDetail(true)
    handleGetHoaDon(id)
  }
  
  //Hàm xử lý ngày tháng
  const formatDate = (dateString) => {
    return dayjs(dateString).format("HH:mm:ss DD/MM/YYYY");
  };

  const renderRow = useMemo(() => {
    return <>
    {hoaDons.map((hd, i) => (
            <tr key={hd.id} className="hover:bg-gray-100">
              <td className="px-4 py-4">{page * size + i + 1}</td>
              <td className="px-4 py-4">{hd.maHoaDon}</td>
              <td className="px-4 py-4">{hd.maNhanVien}</td>
              <td className="px-4 py-4">{hd.tenKhachHang}</td>
              <td className="px-4 py-4">{hd.soDienThoai}</td>
              <td className="px-4 py-4">
              <span
                className={`px-2 py-1 rounded-lg text-xs ${
                hd.loaiDon == 0
                  ? "bg-orange-400 text-white"
                  : hd.loaiDon === 1 ? "bg-orange-500 text-white ":"bg-orange-600 text-white"
                }`}
              >
              {hd.loaiDon ===0 ?"Giao hàng" 
              : hd.loaiDon === 1 ? "Tại quầy":"Online"}
        </span>
              </td>
              <td className="px-4 py-4">
                {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                }).format(hd.tongTien)}
                </td>
              <td className="px-4 py-4">{formatDate(hd.ngayTao)}</td>
              <td className="px-4 py-4">
                <span className={`px-2 py-1 rounded-lg text-xs ${
                  hd.trangThaiGiaoHang === 8
                    ? "bg-blue-600 text-white" //Đây là trạng thái tạo hóa đơn
                    : hd.trangThaiGiaoHang === 1
                      ? "bg-orange-400 text-white" //Đây là trạng thái chờ xác nhận
                      : hd.trangThaiGiaoHang === 2
                        ? "bg-green-400 text-white" //Đây là trạng thái xác nhận
                        : hd.trangThaiGiaoHang === 3
                          ? "bg-orange-500 text-white" //Đây là trạng thái chờ vận chuyển
                          : hd.trangThaiGiaoHang === 4
                            ? "bg-blue-400 text-white" //Đây là trạng thái vận chuyển
                            : hd.trangThaiGiaoHang === 5
                             ? "bg-orange-600 text-white" //Đây là trạng thái thành công
                             : hd.trangThaiGiaoHang === 6
                              ? "bg-red-400 text-white" //Đây là trạng thái hoàn hàng
                              : hd.trangThaiGiaoHang === 7
                                ? "bg-gray-500 text-white" //Đây là trạng thái đã hủy
                                : "bg-green-600 text-white" //Đây là trạng thái đã thanh toán
                }`}>
                  {hd.trangThaiGiaoHang === 8
                    ? "Tạo hóa đơn"
                    : hd.trangThaiGiaoHang === 1
                      ? "Chờ xác nhận"
                      : hd.trangThaiGiaoHang === 2
                        ? "Đã xác nhận"
                        : hd.trangThaiGiaoHang === 3
                          ? "Chờ vận chuyển"
                          : hd.trangThaiGiaoHang === 4
                            ? "Vận chuyển"
                            : hd.trangThaiGiaoHang === 5
                              ? "Thành công"
                              : hd.trangThaiGiaoHang === 6
                                ? "Hoàn hàng"
                                : hd.trangThaiGiaoHang === 7
                                  ? "Đã hủy"
                                  : "Đã thanh toán"
                  }
                </span>
              </td>
              <td className="px-4 py-4">
                <p className="flex justify-center tooltip tooltip-bottom tooltip-accent"
                data-tip="Xem chi tiết"
                >
                  {/* <Link to={`/admin/detailOrder/${hd.maHoaDon}`}>
                    <FaEye className="text-xl text-orange-500 cursor-pointer" />
                  </Link> */}
                 
                    <FaEye onClick={() => hanldleHoaDon(hd.id)} className="text-xl text-orange-500 cursor-pointer" />
                 
                </p>
              </td>
            </tr>
          ))}
    </>
  },[size, page, filters,hoaDons])

  if(error) return (<p className="text-red-600">Lỗi: {error}</p>);
  if(loading) return (<p className="text-green-700 h-full">Loading...</p>)
  return <>
    <table className="table w-full bg-white rounded-lg shadow ">
        <thead className="bg-gray-100 ">
          <tr className="text-center">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã hóa đơn</th>
            <th className="px-4 py-2">Mã nhân viên</th>
            <th className="px-4 py-2">Khách hàng</th>
            <th className="px-4 py-2">Số điện thoai</th>
            <th className="px-4 py-2">Loại đơn</th>
            <th className="px-4 py-2">Tổng tiền</th>
            <th className="px-4 py-2">Ngày tạo</th>
            <th className="px-4 py-2">trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {renderRow}
        </tbody>
      </table>
  </>
}
export default memo(OrderTable);
