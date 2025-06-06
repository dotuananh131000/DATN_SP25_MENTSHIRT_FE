import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import CustomerService from "@/services/CustomerService";
import {motion} from "framer-motion"
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
function SignUp(){

    const  [form, setForm] = useState({tenKhachHang:"", soDienThoai:"", email:"", password:"", confirmPassword: ""});
    const [errors, setErrors] = useState({});
    
      //Hàm validate
      const validate = () => {
        let tempErrors = {};

        if (!form.email) {
          tempErrors.email = "Email không được để trống";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
          tempErrors.email = "Email không hợp lệ";
        }

        const phoneRegex = /^[0-9]{10,11}$/; 
        if(!phoneRegex.test(form.soDienThoai)){
          tempErrors.soDienThoai = "Số điện thoại không hợp lệ";
        }

        if (!form.password) {
          tempErrors.password = "Mật khẩu không được để trống";
        } else if (password.length < 6) {
          tempErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        if(form.password !== form.confirmPassword){
          tempErrors.confirmPassword = "Mật khẩu xác nhận  không khớp."
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
      };

      const handleChange = (e) => {
        setForm((prev) => ({...prev, [e.target.id]: e.target.value}))
      }
    
      //Hàm submib form
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
         
          const formData = {
            tenKhachHang: form.tenKhachHang || "",
            soDienThoai: form.soDienThoai || "",
            email: form.email || "",
            password: form.password || "",
            confirmPassword: form.confirmPassword || "",
          }
          try {
            const response = await CustomerService.signUp(formData);
            toast.success(response.message);
            setForm((prev) => ({...prev, tenKhachHang: "", soDienThoai: "", email: "", password: "", confirmPassword: ""}));
          }catch (err){
            console.log("Lỗi khi tạo tài khoản. Vui lòng thử lại.");
            toast.error("Lỗi khi tạo tài khoản. Vui lòng thử lại.");
          }
        }
      };
    return<>
         <motion.div className="bg-gradient-to-b from-orange-50 to-white min-h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
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
                    <BreadcrumbLink>Đăng kí</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
                <div className="w-full p-2 mb-4">
                    <h1 className="text-center text-2xl font-medium uppercase">Đăng Ký tài khoản</h1>
                    <p className="text-center text-sm font-medium p-2">Bạn đã có tài khoản ? 
                    <span className="ml-2">
                        <Link to="/profile" className="text-gray-800 hover:text-orange-500 font-medium underline">Đăng nhập tại đây.</Link>
                    </span></p>
                </div>
                {/* Form đang ký */}
                <motion.form 
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl flex flex-col space-y-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                    <label className="font-medium text-gray-700">Họ và Tên <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        id="tenKhachHang"
                        value={form.tenKhachHang}
                        onChange={(e) => handleChange(e)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-400'}`}
                        placeholder="Nhập họ tên của bạn" 
                    />
                    {errors.tenKhachHang && <p className="text-red-500 text-sm">{errors.tenKhachHang}</p>}

                    <label className="font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        value={form.soDienThoai}
                        id="soDienThoai"
                        onChange={(e) => handleChange(e)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-400'}`}
                        placeholder="Nhập số điện thoại của bạn" 
                    />
                    {errors.soDienThoai && <p className="text-red-500 text-sm">{errors.soDienThoai}</p>}

                    <label className="font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        value={form.email}
                        id="email"
                        onChange={(e) => handleChange(e)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-400'}`}
                        placeholder="Nhập email của bạn" 
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            
                    <label className="font-medium text-gray-700">Password  <span className="text-red-500">*</span></label>
                    <input 
                        type="password" 
                        value={form.password}
                        id="password"
                        onChange={(e) => handleChange(e)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-400'}`}
                        placeholder="Nhập mật khẩu của bạn" 
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    <input 
                        type="password" 
                        value={form.confirmPassword}
                        id="confirmPassword"
                        onChange={(e) => handleChange(e)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-400'}`}
                        placeholder="Nhập mật khẩu của bạn" 
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                            
                            
                    <Button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300">
                        Đăng nhập
                    </Button>
                </motion.form>
            </div>
         </motion.div>
    </>
}
export default SignUp;