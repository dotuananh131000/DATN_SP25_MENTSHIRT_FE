import apiClient from "../api/ApiClient";
import API_ENDPOINTS from "../api/endPoints";

const voucherService = {
  getAllVouchers: async () => {
    const response = await apiClient.get(API_ENDPOINTS.VOUCHERS.BASE);
    return response.data;
  },
};
export default voucherService;
