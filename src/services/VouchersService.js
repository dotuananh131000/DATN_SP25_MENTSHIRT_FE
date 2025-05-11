import apiClient from "../api/ApiClient";
import API_ENDPOINTS from "../api/endPoints";

const voucherService = {
  getAllVouchers: async () => {
    const response = await apiClient.get(API_ENDPOINTS.VOUCHERS.BASE);
    return response.data;
  },

  async lisVoucherByKH(idKH) {
    
        try {
            const response = await apiClient.get('http://localhost:8080/phieu-giam-gia', {
                params: { idKH }
            });
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy phiếu giảm giá:", error);
            throw error;
        }
    },

    async theBestVoucher (idKH, tongTien) {
        try {
            const params = {
                idKH: idKH,
                tongTien: tongTien,
            }

            const response = await apiClient.get('http://localhost:8080/phieu-giam-gia-tot-nhat',
                {
                    params
                }
            )
            return response.data;
        } catch(err) {
            console.log("Lỗi khi gọi API phiếu giảm giá tốt nhất", err);
            throw err;
        }
    }
};
export default voucherService;
