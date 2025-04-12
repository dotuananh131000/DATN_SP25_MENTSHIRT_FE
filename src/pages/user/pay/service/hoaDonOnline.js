import axios from "axios"

const Order = {
    async createOrder(orderData){
        try {

            const formattedOrderData = {
                ghiChu: orderData.ghiChu || "",
                idKhachHang: orderData.idKhachHang ?? null,
                idPhieuGiamGia: orderData.idPhieuGiamGia ?? null,
                hoTenNguoiNhan: orderData.hoTenNguoiNhan,
                soDienThoai: orderData.soDienThoai,
                email: orderData.email || "",
                diaChiNhanHang: orderData.diaChiNhanHang,
                phuongThucThanhToan: orderData.phuongThucThanhToan,
                phiShip: orderData.phiShip ?? 0.0,
                danhSachChiTiet: orderData.danhSachChiTiet.map(item => ({
                    sanPhamChiTietId: item.sanPhamChiTietId,
                    soLuong: item.soLuong
                }))
            };
            console.log("formattedOrderData", formattedOrderData);
            const response = await axios.post(`http://localhost:8080/creatOrder`,formattedOrderData,
                {headers:{
                    "Content-Type":"application/json"
                }}
             )
            return response.data.data
        }catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    async createPaymentUrl(maHD) {
        try {
            const response = await axios.post(`http://localhost:8080/payment/create-payment-url/${maHD}`);
            return response.data;
        } catch (error) {
            console.error("Error creating payment URL:", error);
            throw error;
        }
    },


}
export default Order;