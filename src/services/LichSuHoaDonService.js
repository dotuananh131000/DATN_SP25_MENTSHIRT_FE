import apiClients from "@/api/ApiClient";
import API_ENDPOINTS from "@/api/endPoints";

const LichSuHoaDonService = {
    async Create (formData){
        
        const form = {
            idHoaDon: formData.idHoaDon ?? null,
            hanhDong: formData.hanhDong ?? "",
            nguoiThayDoi: formData.nguoiThayDoi ?? "",
        }

        try {
            const response = await apiClients.post(API_ENDPOINTS.ORDERHISTORIES.CREATE, form);
            return response.data.data;
        }catch (error) {
            console.log("Lỗi khi gọi API Tạo lịch sử hóa đơn", error);
            throw error;
        }
    },
    async GetAllByIdHd (id){
        try{
            const response = await apiClients.get(API_ENDPOINTS.ORDERHISTORIES.GETALL(id));
            return response.data.data;
        }catch (error){
            console.log("Lỗi khi gọi API lấy thông tin lịch sử hóa đơn", error);
            throw error
        }
    }
}
export default LichSuHoaDonService;