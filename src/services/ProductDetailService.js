import apiClients from "@/api/ApiClient";
import API_ENDPOINTS from "@/api/endPoints";

const Productdetail = {
    async getAllActive (page, size = 10, keyword){
        try {
            const params = {
                page,
                size,
                search: keyword || null
            }
            const response = await apiClients.get(API_ENDPOINTS.PRODUCT.GETALLACTIVE,
                {params}
            );
            return response.data;
        }catch (err){
            console.log("Lỗi khi gọi API lấy danh sánh sản phẩm ACTIVE", err);
            throw err;
        }
    },

    async getProductById(id) {
        try {
            const response = await apiClients.get(API_ENDPOINTS.PRODUCT.GETBYID(id));
            return response.data;
        } catch(err) {
            console.log("Lỗi khi gọi API sản phẩm chi tiết",err);
            throw err;
        }
    }
}
export default Productdetail;