import apiClients from "@/api/ApiClient";
import API_ENDPOINTS from "@/api/endPoints";
const HDPTTTService = {
    async Add (request){
        const data = {
            hoaDonId: request.hoaDonId ?? null,
            phuongThucThanhToanId: request.phuongThucThanhToanId ?? null,
            soTienThanhToan: request.soTienThanhToan ?? null,
            nguoiXacNhan:  request.nguoiXacNhan ?? null,
        }
        try{
           
            const ressponse = await apiClients.post(API_ENDPOINTS.HDPTTTT.ADD, data);
            return ressponse.data;
        }catch (err) {
            console.log("Lỗi khi thanh toán hóa đơn", err);
            throw err;
        }
    },
    async getAllByIdHd (idHD){
        try {
            const response = await apiClients.get(API_ENDPOINTS.HDPTTTT.GETALLBYIDHD(idHD));
            return response.data;
        }catch (err){
            console.log("Lỗi khi lấy danh sách lịch sử thanh toán",err);
            throw err;
        }
    }
}
export default HDPTTTService;