import apiClients from "@/api/ApiClient";
import API_ENDPOINTS from "@/api/endPoints";

const Productdetail = {
    async getAllActive (){
        try {
            const response = await apiClients.get(API_ENDPOINTS.PRODUCT.GETALLACTIVE);
            return response.data;
        }catch (err){
            console.log("Lỗi khi gọi API lấy danh sánh sản phẩm ACTIVE", err);
            throw err;
        }
    }
}
export default Productdetail;