import { useEffect, useState } from "react";
import CartOfBill from "./components/CartOfBill";
import CustomerOfBill from "./components/CustomerOfBill";
import ListOfProduct from "./components/ListOfProduct";
import PayMentOfBill from "./components/PaymentOfBill";
import TabOrder from "./components/TabOrders";
import OrderService from "@/services/OrderService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import OrderDetailService from "@/services/OrderDetailService";
import Productdetail from "@/services/ProductDetailService";

function PointOfSales (){
    const nhanVienID = useSelector((state)=> state.auth.user.id) 
    const [order, setOrder] = useState({});
    const [productList, setProductList] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [customer, setCustomer] = useState({});

    // Lấy hóa đơn chờ
    const [waitOrder, setWaitOrder] = useState([]);
    const fetchWaitOrder = async () => {
       try {
        const response = await OrderService.hoaDonCho();
        setWaitOrder(response.data);
        //
        if(Object.keys(order).length === 0){
            fetchOrder(response.data[0].id);
        }
       }catch (err){
        console.log("Không thể tải hóa đơn chờ", err);
       }
    }
    useEffect(() => {
        fetchWaitOrder();
    },[]);

    // Thêm một hóa đơn
    const fetchAddHoaDon = async () => {
        try {
            const response = await OrderService.addHoaDonTaiQuay(nhanVienID);
            const newHoaDon = response.data;
            setOrder(newHoaDon);
            setWaitOrder((prev)=> ([...prev, {id: newHoaDon.id, soLuong: 0}]));
            toast.success("Tạo hóa đơn thành công");
        }catch(err) {
            console.log("Lỗi khi thêm hóa đơn",err);
            toast.error("Lỗi khi tạo hóa đơn mới.");
        }
    }

    // Tìm hóa đơn theo id
    const fetchOrder = async (id) => {
        try {
            const response = await OrderService.getOrderById(id);
            setOrder(response);
        }catch (err) {
            console.log("Không thể lấy thông tin hóa đơn", err);
        }
    }

    // Lấy ra danh sách sản phẩm
    const [totalPages, setTotalPageSP] = useState(0);
    const fetchProductList = async (page, size, keyword) => {
        try {
            const response = await Productdetail.getAllActive(page, size, keyword);
            setProductList(response.data.content)
            setTotalPageSP(response.data.totalPages)
        }catch(err) {
            console.log("Lỗi khi lấy danh sách sản phẩm", err);
            toast.error("Có lối khi lấy danh sách sản phẩm");
        }
    }

    // Danh sách sản phẩm có trong giỏ hàng
    const fetchCartOfItems = async (id) => {
        try {
            if(!id) return;
            const response = await OrderDetailService.GetByIdHd(id);
            setCartItems(response);
        }catch(err) {
            console.log("Lỗi khi lấy sản phẩm của giỏ hàng", err);
        }
    }
    useEffect(() => {
        fetchCartOfItems(order.id);
    },[order.id]);

    return <>
        <div className="p-6 bg-gray-50 min-h-screen relative">
            <h1 className="text-xl font-bold mb-4">Bán hàng tại quầy</h1>
            <TabOrder waitOrder={waitOrder} fetchOrder={fetchOrder} fetchAddHoaDon={fetchAddHoaDon}/>
            <ListOfProduct setCartItems={setCartItems} 
            order={order} 
            setWaitOrder={setWaitOrder} 
            fetchProductList={fetchProductList} 
            productList={productList}
            setProductList={setProductList}
            totalPages={totalPages}
            />
            <CartOfBill 
            cartItems={cartItems} 
            setCartItems={setCartItems} 
            order={order} 
            />
            <CustomerOfBill  
            customer={customer} 
            setCustomer={setCustomer} 
            order={order}
            setOrder={setOrder}
            />
            <PayMentOfBill order={order}
            cartItems={cartItems}
            customer={customer}
            />
        </div>
    </>
}
export default PointOfSales;