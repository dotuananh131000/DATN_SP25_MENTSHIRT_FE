import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function OrderRow({ index, order }) {
  return (
    <tr {...(index == 1)} className="hover:bg-gray-100">
      <td className="border p-2 text-center">{index}</td>
      <td className="border p-2 text-center">{order.maHoaDon}</td>
      <td className="border p-2 text-center">{order.maNhanVien}</td>
      <td className="border p-2 text-center">{order.tenKhachHang}</td>
      <td className="border p-2 text-center">{order.soDienThoai}</td>
      <td className="border p-2 text-center">
        <span
          className={`px-2 py-1 rounded-lg text-xs ${
            order.loaiDon == "Online"
              ? "bg-orange-400 text-white"
              : "bg-orange-600 text-white"
          }`}
        >
          {order.loaiDon}
        </span>
      </td>
      <td className="border p-2 text-center">{order.tongTien} đ</td>
      <td className="border p-2">{order.ngayTao}</td>

      <td className="border p-2 text-center">
        <span
          className={`px-2 py-1 rounded-lg text-xs ${
            order.trangThaiGiaoHang === "Chờ Xác Nhận"
              ? "bg-orange-300 text-black"
              : order.trangThaiGiaoHang === "Xác Nhận"
                ? "bg-green-400 text-white"
                : order.trangThaiGiaoHang === "Chờ Vận Chuyển"
                  ? "bg-orange-500 text-white"
                  : order.trangThaiGiaoHang === "Vận Chuyển"
                    ? "bg-blue-400 text-white"
                    : order.trangThaiGiaoHang === "Thành Công"
                      ? "bg-orange-600 text-white"
                      : order.trangThaiGiaoHang === "Hoàn Hàng"
                        ? "bg-red-400 text-white"
                        : order.trangThaiGiaoHang === "Đã Hủy"
                          ? "bg-gray-500 text-white"
                          : order.trangThaiGiaoHang === "Đã thanh toán"
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 text-white"
          }`}
        >
          {order.trangThaiGiaoHang}
        </span>
      </td>
      <td className="border p-2 text-center">
        <div
          className="tooltip tooltip-bottom tooltip-accent"
          data-tip="Xem chi tiết"
        >
          <Link to={`/admin/detailOrder/${order.maHoaDon}`}>
            <button className="btn bg-white text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white transition duration-300">
              <FaEye />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
}
