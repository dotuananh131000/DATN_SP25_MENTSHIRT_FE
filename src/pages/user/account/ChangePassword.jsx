import {motion} from "framer-motion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
function ChangePassword() {
   const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
  
    //Hàm validate
    const validate = () => {
      let tempErrors = {};
      if (!email) {
        tempErrors.email = "Email không được để trống";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        tempErrors.email = "Email không hợp lệ";
      }
      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
    };
  
    //Hàm submib form
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        console.log("Đang tiến hành lấy lại mật khẩu");
      }
    };
    return <motion.div className="bg-gradient-to-b from-orange-50 to-white min-h-screen"
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
                  <BreadcrumbLink>Quên mật khẩu</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className="w-full p-2 mb-4">
            <h1 className="text-center text-2xl font-medium uppercase">Đăng nhập tài khoản</h1>
            <p className="text-center text-sm font-medium py-2">Bạn chưa có tài khoản ? 
            <span className="ml-2">
              <Link to="/sign-up" className="text-gray-800 hover:text-orange-500 font-medium underline">Đăng ký tại đây</Link>
            </span></p>
        </div>

        <div className="w-full p-2 mb-4">
            <h1 className="text-center text-xl font-medium uppercase">Đặt lại mật khẩu</h1>
            <p className="text-center text-sm font-medium py-2">
              Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc đặt lại mật khẩu.
           </p>
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
              
              <Button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300">
                  Lấy lại mật khẩu
              </Button>
             
        </motion.form>
        <div className="w-full flex justify-center p-2">  
            <Link className="hover:text-purple-900" to="/profile"> Quay lại</Link>
        </div>
      </div>
    </motion.div>;
  }
  export default ChangePassword;