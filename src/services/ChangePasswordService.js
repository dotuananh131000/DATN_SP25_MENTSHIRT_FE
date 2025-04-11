import API_ENDPOINTS from "@/api/endPoints";
import apiClient from "../api/ApiClient";

const ChangePasswordService = {
    async changePasswordEmployee(id, formChange){

        const form = {
            oldPassword: formChange.oldPassword ?? "",
            newPassword: formChange.newPassword ?? "",
        }
        try {
            const response = await apiClient.put(API_ENDPOINTS.CHANGEPASSWORD(id),form);
            return response.data.data;
        }catch (error) {
            console.log("Lỗi khi gọi API đổi mật khẩu");
            throw error;
        }
    }
}
export default ChangePasswordService;