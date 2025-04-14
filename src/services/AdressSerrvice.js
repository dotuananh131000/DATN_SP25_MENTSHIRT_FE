import apiClients from "@/api/ApiClient";
import API_ENDPOINTS from "@/api/endPoints";

const Address ={
    async DefaultAdress (idKH){
        try{
            const response = await apiClients.get(API_ENDPOINTS.ADDRESS.DEFAULTADDRESS(idKH));
            return response.data
        }catch (error){
            console.log("Lỗi khi gọi API địa chỉ mặc định", error);
            throw error;
        }
    }
}
export default Address;