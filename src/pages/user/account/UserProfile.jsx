import {motion} from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import login from "@/api/Auth";
import { loginClientSuccess, logOutClientSuccess } from "@/features/ClientAuthSlice";
import axios from "axios";
import AccountInfo from "./AccountInfo";
function UserProfile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginLost, setLoginLost] = useState(null);
  const client = useSelector((state) => state.authClient?.client);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Hàm validate
  const validate = () => {
    let tempErrors = {};
    if (!email) {
      tempErrors.email = "Email không được để trống";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      tempErrors.email = "Email không hợp lệ";
    }
    if (!password) {
      tempErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      tempErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //Hàm submib form
  const handleSubmit =async (e) => {
    e.preventDefault();
    setLoginLost(null);

    if (validate()) {
      try {
        const response = await login.CheckLoginClient(email, password);

        console.log("Phản hồi thừ API đăng nhập", response.data);

        const token = response.data.token;

        console.log("Token nhân đươc", token);

        const clientRes = await axios.get(`http://localhost:8080/api/khach-hang/myAccount`,
          {
              headers:{Authorization: `Bearer ${token}`}
          }
        );
        console.log("Thông tin tài khoản:", clientRes);

        const clientAccount = {
          token: token,
          ...clientRes.data.data,
        }
        console.log("Đối tượng client được lưu", clientAccount);

        dispatch(loginClientSuccess(clientAccount));
        navigate("/products");
      } catch (error){
        if(error.response){
          setLoginLost(error.response.data.message || "Lỗi đăng nhập từ server");
        } else{
          setLoginLost("Tài khoản hoặc mật khẩu không chính xác.");
        }
      }
    }
  };
  if(client){
    return <AccountInfo />
  }
    return <>
    {loginLost && <p className="error text-red-700">{loginLost}</p>}
      <motion.div className="bg-gradient-to-b from-orange-50 to-white min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}>
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link to="/home" className="hover:text-black">Trang Chủ</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                  <Link to="/profile" className="hover:text-black">Tài khoản</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                  <BreadcrumbLink>Đăng nhập</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          <div className="w-full p-2 mb-4">
            <h1 className="text-center text-2xl font-medium uppercase">Đăng nhập tài khoản</h1>
            <p className="text-center text-sm font-medium p-2">Bạn chưa có tài khoản ? 
              <span className="ml-2">
                <Link to="/sign-up" className="text-gray-800 hover:text-orange-500 font-medium underline">Đăng ký tại đây</Link>
              </span></p>
          </div>
          <motion.form 
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl flex flex-col space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <label className="font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-400'}`}
              placeholder="Nhập email của bạn" 
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            
            <label className="font-medium text-gray-700">Password  <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-400'}`}
              placeholder="Nhập mật khẩu của bạn" 
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            
            <p className="text-sm text-gray-600 text-right">
              Quên mật khẩu? <span className="text-orange-500 hover:underline"><Link to="/change-password">Click vào đây.</Link></span>
            </p>
            
            <Button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300">
              Đăng nhập
            </Button>
          </motion.form>
        </div>
            
      </motion.div>
    </>
  }
  export default UserProfile;