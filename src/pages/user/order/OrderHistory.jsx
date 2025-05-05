import {motion} from "framer-motion"
import { useEffect, useState } from "react";
import HoaDonOnline from "./services/HoaDonService";
import { useSelector } from "react-redux";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { LuScanQrCode } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import OrderService from "@/services/OrderService";
import ReactPaginate from "react-paginate";


function OrderHistory() {
    const client = useSelector((state) => state.authClient?.client);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPageSP] = useState(0);

    //Hàm gọi hóa đơn của khách hàng
    const fetchHoaDonByKhachHang =async () => {
        if(!client){
            console.log("Vui lòng đăng nhập để có thể theo dõi ");
            return;
        }
        try {
            const response = await HoaDonOnline.HoaDonByKH(page, client.id, keyword, status);
            setOrders(response.content);
            setTotalPageSP(response.totalPages)
        }catch (error){
            console.log("Lỗi khi lấy danh sách hóa đơn", error);
        }
    }
   useEffect(() =>{
    fetchHoaDonByKhachHang();
   },[status, keyword, page]);

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

    // Gọi service cancel hóa đơn
    const handleCancel = async (item) =>{
        const idHD =  item.id || null;
        try {
            const response = await OrderService.cancelInvoice(idHD);
            setOrders((pre) => 
                pre.map((order) =>
                    order.id === idHD ? { ...order, trangThaiGiaoHang: 7 } : order
                )
            );
            toast.success(response.message);
        }catch (err){
            console.log("Không thể hủy hóa đơn",err);
            toast.error("Hủy thất bại đơn hàng!");
        }
    }

    //Lọc theo trạng thái đơn hàng
    const handleStatus = (e) => {
        const newStatus = e.target.dataset.value;
        setStatus(newStatus)
        console.log(newStatus)
    }

    return <motion.div className="bg-gradient-to-b from-orange-50 to-white min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
               <div className="mb-6 flex justify-between items-center">
                <Breadcrumb className="">
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
               
               </div>

               {/* Phần lọc theo trạng thái */}
               <div className=" flex justify-between px-2">
                <div className="flex justify-start items-center space-x-3 bg-white shadow rounded-full px-4">
                    <p data-value="" onClick={(e) => handleStatus(e)}
                    className={`${!status ?"text-orange-500":""} cursor-pointer`}
                    >Tất cả</p>
                    <p data-value="1" onClick={(e) => handleStatus(e)}
                    className={`${status == 1 ?"text-orange-500":""} cursor-pointer`} 
                    >Chờ xác nhận</p>
                    <p data-value="2" onClick={(e) => handleStatus(e)}
                    className={`${status == 2 ?"text-orange-500":""} cursor-pointer`}     
                    >Đã xác nhận</p>
                    <p data-value="3" onClick={(e) => handleStatus(e)}
                    className={`${status == 3 ?"text-orange-500":""} cursor-pointer`}     
                    >Chờ vận chuyển</p>
                    <p data-value="4" onClick={(e) => handleStatus(e)}
                    className={`${status == 4 ?"text-orange-500":""} cursor-pointer`}     
                    >Đang vận chuyển</p>
                    <p data-value="5" onClick={(e) => handleStatus(e)}
                    className={`${status == 5 ?"text-orange-500":""} cursor-pointer`}     
                    >Thành công</p>
                    <p data-value="7" onClick={(e) => handleStatus(e)}
                    className={`${status == 7 ?"text-orange-500":""} cursor-pointer`}     
                    >Đã hủy</p>
                </div>
                <div className="flex items-center justify-center space-x-4">
                    {/* <button className="border border-orange-500 p-1 rounded-lg">
                        <LuScanQrCode  className="text-orange-500 "/>
                    </button> */}

                    <input type="text"
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm kiếm hóa đơn theo..." 
                    className="w-full m-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300" />
               </div>
               </div>
               
               {/* Phần hiển thị danh sách hóa đơn */}
                <table className="table table-auto w-full bg-white rounded-lg shadow text-center text-xs mt-2">
                <thead>
                    <tr className="bg-gray-100">
                        <th>STT</th>
                        <th>Mã đơn hàng</th>
                        <th>Tổng tiền</th>
                        <th>Ngày mua</th>
                        <th>Trạng thái đơn hàng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((item, i) => (
                        <motion.tr 
                        key={item.id}
                        className="hover:bg-gray-100 duration-300 text-center "
                        // initial={{ opacity: 0, y: 10 }}
                        // animate={{ opacity: 1, y: 0 }}
                        // transition={{ duration: 0.3, ease: "easeOut" }}
                        // whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        >
                            <td>{i + 1}</td>
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
                            <td className="flex justify-center ">
                                {item.trangThaiGiaoHang === 1 && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button 
                                        className="px-3 py-2 tooltip" data-tip="Xóa">
                                            <FaRegTrashCan className="text-orange-500 text-lg" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Xác nhận hủy đơn hàng  !
                                            </DialogTitle>
                                                <DialogDescription>
                                                    Bạn có muốn hủy đơn hàng {item.maHoaDon} không ?
                                                    (Trường hợp khách hàng đã thanh toán đơn hàng, vui lòng liên hệ:  0868.444.644 để
                                                    được nhân viên hỗ trợ.)
                                                </DialogDescription>                                            
                                        </DialogHeader>
                                        <div className="flex justify-end space-x-4">
                                            <DialogClose className="bg-gray-300 px-3 py-2 rounded-lg hover:bg-gray-400 duration-200">
                                                Thoát
                                            </DialogClose>

                                            <DialogClose 
                                            onClick={() => handleCancel(item)}
                                            className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 duration-200">
                                                Hủy
                                            </DialogClose>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                )}
                                
                                <button 
                                onClick={() => handleClick(item)}
                                className="px-3 py-2 tooltip" data-tip="Chi tiết">
                                    <FaEdit className="text-orange-500 text-lg active:scale-95 duration-200" />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>

            <div className="flex items-center mt-4 px-2 relative">
                <div className="flex items-center absolute right-2 top-2">
                    <ReactPaginate
                    previousLabel="<"
                    nextLabel=">"
                    breakLabel="..."
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(e) => setPage(e.selected)}
                    forcePage={page}
                    containerClassName="flex justify-center items-center space-x-2"
                    pageClassName="border border-gray-300 rounded"
                    pageLinkClassName="px-3 py-1"
                    activeClassName="bg-orange-500 text-white"
                    previousClassName="border border-gray-300 rounded px-3 py-1"
                    nextClassName="border border-gray-300 rounded px-3 py-1"
                    disabledClassName="text-gray-300"
                    />
                </div>
            </div>
            
            </div>
            
    </motion.div>;
  }
  export default OrderHistory;