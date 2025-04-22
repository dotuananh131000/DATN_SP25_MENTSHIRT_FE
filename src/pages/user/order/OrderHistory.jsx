import {motion} from "framer-motion"
import { useEffect, useState } from "react";
import HoaDonOnline from "./services/HoaDonService";
import { useSelector } from "react-redux";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function OrderHistory() {
    const client = useSelector((state) => state.authClient?.client);
    const navigate = useNavigate();
    const [order, setOrder] = useState([]);
    //Hàm gọi hóa đơn của khách hàng
    const fetchHoaDonByKhachHang =async () => {
        if(!client){
            console.log("Vui lòng đăng nhập để có thể theo dõi ");
            return;
        }
        try {
            const response = await HoaDonOnline.HoaDonByKH(client.id);
            setOrder(response.content);
        }catch (error){
            console.log("Lỗi khi lấy danh sách hóa đơn", error);
        }
    }
   useEffect(() =>{
    fetchHoaDonByKhachHang();
   },[]);
    //hàm xử lý ngày tháng
    const formatDate = (dateString) => {
       return dayjs(dateString).format("HH:mm:ss DD/MM/YYYY");
     };

    //Hàm xử lý khi nhấn vào hàng
    const handleClick = (item) => {
        navigate(`/order-detail/${item.id}`,{
            state: {
                order: item,
            }
        });
    }

    return <motion.div className="bg-gradient-to-b from-orange-50 to-white min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <Link to="/home" className="hover:text-black">Trang Chủ</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <Link to="" >Lịch sử mua hàng</Link>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
                <table className="table table-auto w-full bg-white rounded-lg shadow text-center text-xs mt-2">
                <thead>
                    <tr className="bg-gray-100">
                        <th>Mã đơn hàng</th>
                        <th>Tổng tiền</th>
                        <th>Ngày mua</th>
                        <th>Trạng thái đơn hàng</th>
                    </tr>
                </thead>
                <tbody>
                    {order.map((item) => (
                        <motion.tr 
                        onClick={() => handleClick(item)}
                        key={item.id}
                        className="hover:bg-gray-100 text-center cursor-pointer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        >
                            <td className="p-4">{item.maHoaDon}</td>
                            <td>{new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                }).format(item.tongTien)}
                            </td>
                            <td>{formatDate(item.ngayTao)}</td>
                            <td className="px-4 py-4">
                                <span className={`px-2 py-1 rounded-lg text-xs ${
                                item.trangThaiGiaoHang === 8
                                    ? "bg-blue-600 text-white" //Đây là trạng thái tạo hóa đơn
                                    : item.trangThaiGiaoHang === 1
                                    ? "bg-orange-400 text-white" //Đây là trạng thái chờ xác nhận
                                    : item.trangThaiGiaoHang === 2
                                        ? "bg-green-400 text-white" //Đây là trạng thái xác nhận
                                        : item.trangThaiGiaoHang === 3
                                        ? "bg-orange-500 text-white" //Đây là trạng thái chờ vận chuyển
                                        : item.trangThaiGiaoHang === 4
                                            ? "bg-blue-400 text-white" //Đây là trạng thái vận chuyển
                                            : item.trangThaiGiaoHang === 5
                                            ? "bg-orange-600 text-white" //Đây là trạng thái thành công
                                            : item.trangThaiGiaoHang === 6
                                            ? "bg-red-400 text-white" //Đây là trạng thái hoàn hàng
                                            : item.trangThaiGiaoHang === 7
                                                ? "bg-gray-500 text-white" //Đây là trạng thái đã hủy
                                                : "bg-green-600 text-white" //Đây là trạng thái đã thanh toán
                                }`}>
                                {item.trangThaiGiaoHang === 8
                                    ? "Tạo hóa đơn"
                                    : item.trangThaiGiaoHang === 1
                                    ? "Chờ xác nhận"
                                    : item.trangThaiGiaoHang === 2
                                        ? "Đã xác nhận"
                                        : item.trangThaiGiaoHang === 3
                                        ? "Chờ vận chuyển"
                                        : item.trangThaiGiaoHang === 4
                                            ? "Vận chuyển"
                                            : item.trangThaiGiaoHang === 5
                                            ? "Thành công"
                                            : item.trangThaiGiaoHang === 6
                                                ? "Hoàn hàng"
                                                : item.trangThaiGiaoHang === 7
                                                ? "Đã hủy"
                                                : "Đã thanh toán"
                                }
                                </span>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
            </div>
            
    </motion.div>;
  }
  export default OrderHistory;