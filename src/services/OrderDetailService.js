import apiClients from "@/api/ApiClient";
import API_ENDPOINTS from "@/api/endPoints";

const OrderDetailService = {
    async GetByIdHd (idHD) {
        try {
            const response = await apiClients.get(API_ENDPOINTS.DETAILORDERS.GETBYID(idHD));
            return response.data;
        }catch (err){
            console.log("Lỗi khi gọi API danh sách hóa đơn chi tiết",err);
        }
    },

    async Add (formData) {
        const form = {
            idHoaDon: formData.idHoaDon ?? "",
            idSPCT: formData.idSPCT ?? "",
            soLuong: formData.soLuong ?? "",
        }
        try {
            const response = await apiClients.post(API_ENDPOINTS.DETAILORDERS.ADD, form);
            return response.data;
        }catch (err){
            console.log("Lỗi khi gọi API thêm hóa đơn chi tiết", err);
            throw err;
        }
    }
}
export default OrderDetailService;