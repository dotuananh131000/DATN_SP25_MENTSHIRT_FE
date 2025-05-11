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
    },

    async getAll(page = 0, size = 10, keyword = '', trangThai = null, sortKey = 'id', sortDirection = 'desc') {
        try {
            const validSortKeys = ["id", "maKhachHang", "tenDangNhap", "tenDangNhap", "email", "soDienThoai", "ngaySinh"];
            if (!validSortKeys.includes(sortKey)) {
                sortKey = "id"; 
            }
    
            const params = {
                page,
                size,
                keyword,
                sort: sortKey,
                direction: sortDirection
            };
    
            if (trangThai !== null && !isNaN(trangThai)) {
                params.trangThai = parseInt(trangThai, 10);
            }
    
            const response = await apiClients.get(API_ENDPOINTS.CUSTOMER.GETALL, { params });
            console.log(response);

            return response.data.data;
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    },

    async getCustomerById (idKH){
        try {
            const response = await apiClients.get(API_ENDPOINTS.CUSTOMER.GETBYID(idKH));
            return response.data;
        }catch (err){
            console.log("Lỗi khi gọi API tìm khách hang theo Id", err);
            throw err;
        }
    }
}
export default CustomerService;