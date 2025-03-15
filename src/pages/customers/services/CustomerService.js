import axios from "axios";

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
    
            const response = await axios.get(`http://localhost:8080/api/khach-hang`, { params });
            console.log(response);

            return response.data.data;
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/khach-hang/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching employee data:", error);
            throw error;
        }
    },

    async add(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/khach-hang`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating employee:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await axios.put(`http://localhost:8080/api/khach-hang/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating employee:", error);
            throw error;
        }
    },

    async toggleStatus(id) {
        try {
            const response = await axios.patch(`http://localhost:8080/api/khach-hang/toggle-trang-thai/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling employee status:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/khach-hang/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting employee:", error);
            throw error;
        }
    },

    async resetPassword(id) {
        try {
            const response = await axios.post(`http://localhost:8080/api/khach-hang/reset-password/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error resetting password:", error);
            throw error;
        }
    }
};

export default EmployeeService;