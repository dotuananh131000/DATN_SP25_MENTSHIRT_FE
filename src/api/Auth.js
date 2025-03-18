import axios from "axios"

const login = {
    async CheckLogin(email, password){
        try{
            const response = await axios.post(`http://localhost:8080/api/auth/token`,
                {
                    email,
                    password,
                }
            )
            return response.data
        }catch(error){
            throw error.response?.data || "Lỗi đăng nhập";
        }
    }
}
export default login;