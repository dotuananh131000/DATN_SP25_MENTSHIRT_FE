import axios from "axios";
import apiClients from "../../../api/ApiClient";

const EmployeeService = {
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
    
            const response = await apiClients.get(`/khach-hang`, { params });
            console.log(response);

            return response.data.data;
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await apiClients.get(`/khach-hang/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching employee data:", error);
            throw error;
        }
    },

    async add(data) {
        try {
            const response = await apiClients.post(`/khach-hang`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating employee:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await apiClients.put(`/khach-hang/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating employee:", error);
            throw error;
        }
    },

    async toggleStatus(id) {
        try {
            const response = await apiClients.patch(`/khach-hang/toggle-trang-thai/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling employee status:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await apiClients.delete(`/khach-hang/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting employee:", error);
            throw error;
        }
    },

    async resetPassword(id) {
        try {
            const response = await apiClients.post(`/khach-hang/reset-password/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error resetting password:", error);
            throw error;
        }
    }
};

export default EmployeeService;