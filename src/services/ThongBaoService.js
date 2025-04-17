import API_ENDPOINTS from "@/api/endPoints";
import apiClient from "../api/ApiClient";
const ThongBaoService = {
    
    async GetAll (id) {
        try {
            const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.GETALL(id));
            return response.data.data;
        }catch (err){
            console.log("Lỗi khi gọi API danh sách thông báo", err);
            throw err
        }
    },
    async SEEN (id) {
        try {
            const response = await apiClient.put(API_ENDPOINTS.NOTIFICATION.SEEN(id));
            return response.data.data;
        }catch (err) {
            console.log("Lỗi khi đọc", err);
            throw err;
        }
    }
}
export default ThongBaoService;