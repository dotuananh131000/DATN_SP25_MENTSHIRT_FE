import { useCallback, useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import OrderTable from "./components/OrderTable";
import SearchFilter from "./components/SearchFilter";
import PhanTrang from "./components/PhanTrang"
import Tabs from "./components/Tabs";
import OrderService from "../../services/OrderService";
import QRCodeScanner from "../../containers/QRCodeScanner";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import OrderDetail from "./OrderDetail";
import { Link } from "react-router-dom";

function Order() {
  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10); // Số lượng bản ghi mỗi trang
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPageSP] = useState(0);
  const [hoaDons, setHoaDons] = useState([]);
  const [hoaDon, setHoaDon] = useState({});
  const [isQRScan, setQrScan] = useState(false);
  const [filters, setFilters] = useState({
    ngayBatDau: null,
    ngayKetThuc: null,
    keyword: "",
    loaiDon: null,
    trangThaiGiaoHang: null
  });

  // Hàm cập nhật ngày mặc định
  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ngayBatDau: prevFilters.ngayBatDau || dayjs().format("YYYY-MM-DD"),
      ngayKetThuc: prevFilters.ngayKetThuc || dayjs().format("YYYY-MM-DD")
    }));
  }, []);

  // Xử lý quét QR
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

  //Lấy danh sách hóa đơn
  const fetchHoaDons = useCallback( async() => {
    try {
      const response = await OrderService.hoaDons(page, size, filters);
      setHoaDons(response.content)
      setTotalPageSP(response.totalPages)
    }catch (error) {
      console.log("Lỗi khi lấy dữ liệu hóa đơn", error);
      setError(error.message);
    }finally{
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  },[size, page, filters]);

  useEffect(() => {
    setLoading(true);
    fetchHoaDons();
  },[size,page, filters]);

  //Hàm Lấy hóa đơn theo id
  const fetchHoaDonById = async(id) =>{
    try {
      const response = await OrderService.getOrderById(id);
      setHoaDon(response);
    }catch (error) {
      console.log("Không thể lấy được hóa đơn theo Id", error);
    }
  } 

  const handleGetHoaDon =(id) => {
    if(!id){
      toast.error("Không thể lấy được thông tin hóa đơn này");
      return
    }
    fetchHoaDonById(id);
  }
  

  //Hàm đếm số lượng trạng thái hóa đơn
  const fetchOrderCounts = async () => {
    try {
      const data = await OrderService.getOrderCounts(filters);
      setOrderCounts(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu số lượng đơn hàng:", error);
    }
  };

  //Hàm xuất exel
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
        toast.warn("Dữ liệu trống !");
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

  if(isOrderDetail) {
    return <OrderDetail hoaDon={hoaDon}
    setIsOrderDetail={setIsOrderDetail}
    fetchHoaDonById={fetchHoaDonById}
    fetchHoaDons={fetchHoaDons}
    />
  } else {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
         <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-lg cursor-pointer">
                  Danh sách hóa đơn
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        <SearchFilter
          value={filters}
          onChange={setFilters}
          setQrCodeScan={() => setQrScan(true)}
          onExport={handleExportToExcel}
        />
        <Tabs value={filters} onChange={setFilters} orderCounts={orderCounts} setPage={setPage} />
        {isQRScan && (
          <QRCodeScanner onScan={handleScan} onClose={() => setQrScan(false)} />
        )}
        <div className="bg-white p-2 rounded-lg shadow ">
          <OrderTable
            hoaDons={hoaDons}
            page={page}
            size={size}
            filters={filters}
            error={error}
            loading={loading}
            setIsOrderDetail={setIsOrderDetail}
            handleGetHoaDon ={handleGetHoaDon}
          />
          <PhanTrang 
            size={size}
            setSize={setSize}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
        
      </div>
    );
  } 
}
export default Order;
