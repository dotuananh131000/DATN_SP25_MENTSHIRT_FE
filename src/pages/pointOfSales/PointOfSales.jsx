import { useEffect, useState } from "react";
import CartOfBill from "./components/CartOfBill";
import CustomerOfBill from "./components/CustomerOfBill";
import ListOfProduct from "./components/ListOfProduct";
import PayMentOfBill from "./components/PaymentOfBill";
import TabOrder from "./components/TabOrders";
import OrderService from "@/services/OrderService";

function PointOfSales (){
    const [order, setOrder] = useState({});
    // Lấy hóa đơn chờ
    const [waitOrder, setWaitOrder] = useState([]);
    const fetchWaitOrder = async () => {
       try {
        const response = await OrderService.hoaDonCho();
        setWaitOrder(response.data);
       }catch (err){
        console.log("Không thể tải hóa đơn chờ", err);
       }
    }
    useEffect(() => {
        fetchWaitOrder();
    },[]);

    // Tìm hóa đơn theo id
    const fetchOrder = async (id) => {
        try {
            const response = await OrderService.getOrderById(id);
            setOrder(response);
        }catch (err) {
            console.log("Không thể lấy thông tin hóa đơn", err);
        }
    }

    console.log(order);

    return <>
        <div className="p-6 bg-gray-50 min-h-screen relative">
            <h1 className="text-xl font-bold mb-4">Bán hàng tại quầy</h1>
            <TabOrder waitOrder={waitOrder} fetchOrder={fetchOrder}/>
            <ListOfProduct order={order} />
            <CartOfBill />
            <CustomerOfBill />
            <PayMentOfBill />
        </div>
    </>
}
export default PointOfSales;