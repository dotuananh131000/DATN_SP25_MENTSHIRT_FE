import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import OrderTable from "./components/OrderTable";
import SearchFilter from "./components/SearchFilter";
import Tabs from "./components/Tabs";
import OrderService from "../../services/OrderService";
import QRCodeScanner from "../../containers/QRCodeScanner";
import { saveAs } from "file-saver";

function Order() {
  const [size, setSize] = useState(10); // Số lượng bản ghi mỗi trang
  const [isQRScan, setQrScan] = useState(false);

  const handleScan = (decodedText) => {
    console.log(decodedText);
    setFilters({
      trangThai: null,
      ngayBatDau: null,
      ngayKetThuc: null,
      loaiDon: null,
      keyword: decodedText,
    });
    setQrScan(false);
  };

  const [filters, setFilters] = useState({
    trangThai: null,
    ngayBatDau: null,
    ngayKetThuc: null,
    loaiDon: null,
    keyword: "",
  });

  const [orderCounts, setOrderCounts] = useState({
    tong: 0,
    cho_xac_nhan: 0,
    xac_nhan: 0,
    cho_van_chuyen: 0,
    van_chuyen: 0,
    thanh_cong: 0,
    hoan_hang: 0,
    da_huy: 0,
  });

  const fetchOrderCounts = async () => {
    try {
      const data = await OrderService.getOrderCounts(filters);
      setOrderCounts(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu số lượng đơn hàng:", error);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const data = await OrderService.getOrders(
        0,
        size * 100,
        filters.trangThai,
        filters.ngayBatDau,
        filters.ngayKetThuc,
        filters.loaiDon,
        filters.keyword
      );

      if (data.content.length === 0) {
        toast.warn("Dữ liệu trống");
        return;
      }

      const formatedData = data.content.map((order, index) => ({
        STT: index + 1,
        "Mã hóa đơn": order.maHoaDon,
        "Mã nhân viên": order.maNhanVien,
        "Khách hàng": order.tenKhachHang,
        "Số điện thoại": order.soDienThoai,
        "Loại hóa đơn": order.loaiDon,
        "Tổng tiền": `${order.tongTien} đ`,
        "Ngày tạo": order.ngayTao,
        "Trạng thái": order.trangThaiGiaoHang,
      }));
      const workSheet = XLSX.utils.json_to_sheet(formatedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, workSheet, "Orders");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const file = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(file, "DanhSachDonHang.xlsx");
    } catch (error) {
      toast.error("Lỗi Khi xuất dữ liệu:" + error);
    }
  };

  useEffect(() => {
    fetchOrderCounts();
  }, [filters]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Quản lý hóa đơn</h1>
      <SearchFilter
        value={filters}
        onChange={setFilters}
        setQrCodeScan={() => setQrScan(true)}
        onExport={handleExportToExcel}
      />
      <Tabs value={filters} onChange={setFilters} orderCounts={orderCounts} />
      {isQRScan && (
        <QRCodeScanner onScan={handleScan} onClose={() => setQrScan(false)} />
      )}
      <OrderTable
        trangThaiGiaoHang={filters.trangThai}
        ngayBatDau={filters.ngayBatDau}
        ngayKetThuc={filters.ngayKetThuc}
        loaiDon={filters.loaiDon}
        keyword={filters.keyword}
        size={size}
        onSizeChange={setSize}
      />
      <ToastContainer />
    </div>
  );
}
export default Order;
