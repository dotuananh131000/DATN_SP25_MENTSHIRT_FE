import axios from "axios";

const VoucherService = {
    async getAll(page = 0, size = 10, keyword = '', startTime = null, endTime = null, loaiGiam = null, sortKey = 'id', sortDirection = 'desc') {
        try {
            const validSortKeys = ["id", "maKhachHang", "tenDangNhap", "email", "soDienThoai", "ngaySinh"];
            if (!validSortKeys.includes(sortKey)) {
                sortKey = "id"; 
            }
    
            const formattedStartTime = startTime ? new Date(startTime) : null;
            const formattedEndTime = endTime ? new Date(endTime) : null;
    
            const params = {
                page,
                size,
                keyword,
                startTime: formattedStartTime && !isNaN(formattedStartTime) ? formattedStartTime.toISOString() : null,
                endTime: formattedEndTime && !isNaN(formattedEndTime) ? formattedEndTime.toISOString() : null,
                loaiGiam,
                sortKey,
                sortDirection
            };
    
            const response = await axios.get(`http://localhost:8080/api/phieu-giam-gia`, { params });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching vouchers:", error);
            throw error;
        }
    },
    
    

    async getById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/phieu-giam-gia/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching voucher:", error);
            throw error;
        }
    },

    async add(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/phieu-giam-gia`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating voucher:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await axios.put(`http://localhost:8080/api/phieu-giam-gia/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating voucher:", error);
            throw error;
        }
    },


    async toggleStatus(id) {
        try {
            const response = await axios.patch(`http://localhost:8080/api/phieu-giam-gia/toggle-trang-thai/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling voucher status:", error);
            throw error;
        }
    },
};

export default VoucherService;
