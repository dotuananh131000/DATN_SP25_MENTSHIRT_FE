import axios from "axios";

const CustomerVoucherService = {
    // Lấy phiếu giảm giá theo ID
    async getById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/phieu-giam-gia-khach-hang/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching customer voucher by ID:", error);
            throw error;
        }
    },

    async getByVoucherId(voucherId) {
        try {
            const response = await axios.get(`http://localhost:8080/api/phieu-giam-gia-khach-hang/voucher/${voucherId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching customer vouchers by customer ID:", error);
            throw error;
        }
    },

    // Lấy danh sách phiếu giảm giá của khách hàng theo ID khách hàng
    async getByCustomerId(khachHangId) {
        try {
            const response = await axios.get(`http://localhost:8080/api/phieu-giam-gia-khach-hang/khach-hang/${khachHangId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching customer vouchers by customer ID:", error);
            throw error;
        }
    },

    // Tạo nhiều phiếu giảm giá
    async createMultiple(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/phieu-giam-gia-khach-hang/batch`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating multiple customer vouchers:", error);
            throw error;
        }
    },

    // Xóa nhiều phiếu giảm giá
    async deleteMultiple(ids) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/phieu-giam-gia-khach-hang/batch`, { data: ids });
            return response.data;
        } catch (error) {
            console.error("Error deleting multiple customer vouchers:", error);
            throw error;
        }
    }
};

export default CustomerVoucherService;
