import axios from "axios";
//Tạo instance axios
const apiClients = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
// Interceptor để thêm Authorization token vào tất cả request
apiClients.interceptors.request.use(
  (config)=>{
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    if(token){
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
  },
  (error)=>{
    return Promise.reject(error);
  }
  
)
export default apiClients;
