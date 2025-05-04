import axios from "axios";
import API_ENDPOINTS from "../api/endPoints";
import apiClients from "@/api/ApiClient";


const CustomerService = {
    async signUp (formSignUp){
        const form = {
            tenKhachHang: formSignUp.tenKhachHang ?? null,
            soDienThoai: formSignUp.soDienThoai ?? null,
            email: formSignUp.email ?? null,
            password: formSignUp.password ?? null,
            confirmPassword: formSignUp.confirmPassword ?? null
        }
        try {
            const response = await axios.post(API_ENDPOINTS.CUSTOMER.SIGNUP, form);
            return response.data;
        }catch (err){
            console.log("Lỗi khi gọi API Sign up", err);
            throw err;
        }
    },

    async themNhanh (form) {
        const formThemNhanh = {
            tenKhachHang: form.tenKhachHang ?? null,
            soDienThoai: form.soDienThoai ?? null,
            email: form.email ?? null,
        }
        try {
            const response = await apiClients.post(API_ENDPOINTS.CUSTOMER.THEMNHANH, formThemNhanh);
            return response.data;
        }catch (err) {
            console.log("Lỗi khi gọi API thêm nhanh khách hàng", err);
            throw err;
        }
    }
}
export default CustomerService;