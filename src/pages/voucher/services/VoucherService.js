import axios from "axios";
import apiClients from "../../../api/ApiClient";

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
    
            const response = await apiClients.get(`/phieu-giam-gia`, { params });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching vouchers:", error);
            throw error;
        }
    },
    
    

    async getById(id) {
        try {
            const response = await apiClients.get(`/phieu-giam-gia/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching voucher:", error);
            throw error;
        }
    },

    async add(data) {
        try {
            const response = await apiClients.post(`/phieu-giam-gia`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating voucher:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await apiClients.put(`/phieu-giam-gia/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating voucher:", error);
            throw error;
        }
    },


    async toggleStatus(id) {
        try {
            const response = await apiClients.patch(`/phieu-giam-gia/toggle-trang-thai/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling voucher status:", error);
            throw error;
        }
    },
};

export default VoucherService;
