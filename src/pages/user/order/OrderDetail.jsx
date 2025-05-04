import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useLocation, useParams } from "react-router-dom";
import {motion} from "framer-motion";
import { useEffect, useState } from "react";
import apiClients from "@/api/ApiClient";
import OrderService from "@/services/OrderService";
import StepsTrangThaiHoaDon from "@/pages/orders/components/orderDetailComponents/StepsTrangThaiHoaDon";
import ButtonDetail from "./components/ButtonDetail";
import OrderInfo from "./components/OrderInfo";
import ProductModal from "./components/ProductModal";
import CartOfOrder from "./components/CartOfOrder";
import OrderDetailService from "@/services/OrderDetailService";
import HDPTTTService from "@/services/HDPTTTService";
import ConfirmOrder from "./components/ConfirmOrder";
function OrderDetail(){
    const { id } = useParams(); 
    const [order, setOrder] = useState({});

    const [cartItems, setCartItems] = useState([]);

    const fetchOrder = async () => {
        try {
            const response = await OrderService.getOrderById(id);
            setOrder(response)
        }catch (err){
            console.log("Không thể lấy được hóa đơn", err);
        }
    }
    useEffect(() => { 
        fetchOrder(); 
    },[id]);

    // Lấy danh scahs lịch sử thanh toán
    const [historyPayment, setHistoryPayMent] = useState([]);

    const fetchLichSuThanhToanByHD = async (id) => {
        try {
            if(!id) return;
            const response = await HDPTTTService.getAllByIdHd(id);
            setHistoryPayMent(response);
        }catch (err){
            console.log("Không thể lấy được danh sách lịch sử thanh toán.", err);
        }
    }
    useEffect(() => {
        fetchLichSuThanhToanByHD(order.id);
    },[order.id])

    // Hàm gọi giỏ hàng của hóa đơn
    const fetchItemOfCart = async () => {
        try {
            const response = await OrderDetailService.GetByIdHd(id);
            setCartItems(response);
        }catch (err){
            console.log("Không thể lấy được danh sách hóa đơn, vui lòng thử lại", err);
        }
    }
    useEffect(() => {
        fetchItemOfCart();
    }, [])


    return <>
        <motion.div className="bg-gradient-to-b from-orange-50 to-white min-h-screen"
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
                        <Link to="/order-history" >Lịch sử mua hàng</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                       Hóa đơn: {order.maHoaDon}
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
                <StepsTrangThaiHoaDon hoaDon={order}/>
                <ButtonDetail order={order} setOrder={setOrder} historyPayment={historyPayment}  />
                <OrderInfo order={order} />
                <ProductModal setCartItems={setCartItems} order={order} />
                <div className="bg-white p-4 rounded-lg shadow">
                    <CartOfOrder cartItems={cartItems} order={order} />
                    <ConfirmOrder order={order} historyPayment={historyPayment} setOrder={setOrder} />
                </div>
                
            </div>
    </motion.div>;
    </>
}
export default OrderDetail;