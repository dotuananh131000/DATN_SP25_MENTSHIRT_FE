import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import StepsTrangThaiHoaDon from "./components/orderDetailComponents/StepsTrangThaiHoaDon";
import Cart from "./components/orderDetailComponents/Cart";
import { useCallback, useEffect, useState } from "react";
import HoaDonChiTietService from "../detailOrder/service/HoaDonChiTietService";
import ButtonTrangThai from "./components/orderDetailComponents/ButtonTrangThai";
import OrderInfo from "./components/orderDetailComponents/OrderInfo";
import LichSuThanhToan from "../detailOrder/service/LichSuThanhToan";
import { toast } from "react-toastify";
import HoaDonService from "../detailOrder/service/HoaDonService";

function OrderDetail({hoaDon, setIsOrderDetail, fetchHoaDonById}){

    const [gioHang, setGioHang] = useState([]);
    const [lichSuThanhToan, setLichSuThanhToan] = useState([]);
    // Lấy dữ liệu giỏ hàng của hóa đơn
    useEffect(() => {
        const fetchGioHang = async() => {
            try {
                if(!hoaDon.id){
                    return;
                }
                const response = await HoaDonChiTietService.getSPCTByIDHoaDon(hoaDon.id);
                setGioHang(response);
            }catch (error) {
                console.log("Không thể lấy được giỏ hàng", error);
            }
        }
        fetchGioHang();
    }, [hoaDon]);
   
    //Lấy dữ liệu lịch sử thanh toán
    useEffect(() => {
        const fetchLichSuThanhToan = async() => {
            try{
                if(!hoaDon.id){
                    return;
                }
                const response = await LichSuThanhToan.getAll(hoaDon.id);
                setLichSuThanhToan(response);
            }catch (error) {
                console.log("Lỗi khi gọi api lịch sử thanh toán", error);
            }
        }
        fetchLichSuThanhToan();
    }, [hoaDon]);

    //Hàm update trạng thái đơn hàng
    const handleCapNhatDonHang = useCallback(() => {
        const fetchCapNhatDonHang = async () => {
            try {
                if(!hoaDon.id){
                    toast.error("Lỗi hóa đơn, vui lòng thử lại.")
                    return;
                }
                const response = await HoaDonService.UpdateTrangThaiDonHang(hoaDon.id);
                fetchHoaDonById(hoaDon.id);
                toast.success("Trạng thái đã được cập nhật");
            }catch (error) {
                toast.error("Lỗi khi cập nhật trạng thái, vui lòng thử lại.")
                console.log("Lỗi cập nhật trạng thái", error);
            }
        }
        fetchCapNhatDonHang();
    },[hoaDon])
    
    return <>
        <div className="p-6 bg-gray-50 min-h-screen">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <h1 onClick={() => setIsOrderDetail(false)}
                        className="cursor-pointer text-lg"
                        >
                            Danh sách hóa đơn
                        </h1>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink className="cursor-pointer">{hoaDon.maHoaDon}</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <StepsTrangThaiHoaDon
                hoaDon={hoaDon} />
            <ButtonTrangThai hoaDon={hoaDon} handleCapNhatDonHang={handleCapNhatDonHang} />
            <OrderInfo hoaDon={hoaDon} lichSuThanhToan={lichSuThanhToan} />
            <Cart gioHang={gioHang}/>
        </div>
    </>
}
export default OrderDetail;