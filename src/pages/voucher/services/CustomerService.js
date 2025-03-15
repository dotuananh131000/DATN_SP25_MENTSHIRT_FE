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

            return response.data.data;
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    },

    async getByVoucherId(id, page = 0, size = 10, search = "") {
        try {
            const url = `http://localhost:8080/api/khach-hang/voucher/${id}?page=${page}&size=${size}&search=${search}`;
    
            const response = await axios.get(url);
    
            return response.data.data;
        } catch (error) {
            console.error("Error fetching customer data:", error);
            throw error;
        }
    }
    
};

export default EmployeeService;