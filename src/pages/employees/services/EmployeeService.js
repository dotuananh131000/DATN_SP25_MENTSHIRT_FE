import axios from "axios";

const EmployeeService = {
    async getAll(page = 0, size = 10, keyword = '', trangThai = null, sortKey = 'id', sortDirection = 'desc') {
        try {
            const validSortKeys = ["id", "maNhanVien", "tenDangNhap", "tenNhanVien", "email", "soDienThoai"];
            if (!validSortKeys.includes(sortKey)) {
                sortKey = "id"; // Mặc định về id nếu key không hợp lệ
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
    
            const response = await axios.get(`http://localhost:8080/api/nhan-vien`, { params });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/nhan-vien/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching employee data:", error);
            throw error;
        }
    },

    async add(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/nhan-vien`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating employee:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await axios.put(`http://localhost:8080/api/nhan-vien/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating employee:", error);
            throw error;
        }
    },

    async toggleStatus(id) {
        try {
            const response = await axios.patch(`http://localhost:8080/api/nhan-vien/toggle-trang-thai/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling employee status:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/nhan-vien/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting employee:", error);
            throw error;
        }
    },

    async resetPassword(id) {
        try {
            const response = await axios.post(`http://localhost:8080/api/nhan-vien/reset-password/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error resetting password:", error);
            throw error;
        }
    }
};

export default EmployeeService;