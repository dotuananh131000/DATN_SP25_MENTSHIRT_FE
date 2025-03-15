import { memo, useCallback, useEffect, useState, useMemo } from "react";
import OrderRow from "./OrderRow";
import PhanTrang from "./phanTrang";
import OderService from "../../../services/OrderService";

function OrderTable({
  trangThaiGiaoHang,
  ngayBatDau,
  ngayKetThuc,
  loaiDon,
  keyword,
  size,
  onSizeChange,
}) {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dữ liệu từ API
  const fetchOrders = useCallback(async () => {
    if (totalPages > 0 && currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
      return;
    }

    setLoading(true);
    try {
      const data = await OderService.getOrders(
        currentPage,
        size,
        trangThaiGiaoHang,
        ngayBatDau,
        ngayKetThuc,
        loaiDon,
        keyword
      );
      setOrders(data.content || []);
      setCurrentPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    size,
    trangThaiGiaoHang,
    ngayBatDau,
    ngayKetThuc,
    loaiDon,
    keyword,
  ]);

  // Gọi API khi `fetchOrders` thay đổi
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset `currentPage` về 0 khi `size` thay đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [size]);

  // Tối ưu danh sách đơn hàng bằng `useMemo`
  const renderedOrders = useMemo(() => {
    return orders.map((order, index) => (
      <OrderRow
        key={order.maHoaDon}
        index={currentPage * size + index + 1}
        order={order}
      />
    ));
  }, [orders, currentPage, size]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <div className="bg-white rounded shadow p-4">
      <table className="table table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">STT</th>
            <th className="border p-2">Mã hóa đơn</th>
            <th className="border p-2">Mã nhân viên</th>
            <th className="border p-2">Khách hàng</th>
            <th className="border p-2">Số điện thoại</th>
            <th className="border p-2">Loại hóa đơn</th>
            <th className="border p-2">Tổng tiền</th>
            <th className="border p-2">Ngày tạo</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>{renderedOrders}</tbody>
      </table>

      {/* Component phân trang */}
      <PhanTrang
        size={size}
        onSizeChange={onSizeChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

// Dùng `memo` để ngăn component re-render nếu không có props thay đổi
export default memo(OrderTable);
