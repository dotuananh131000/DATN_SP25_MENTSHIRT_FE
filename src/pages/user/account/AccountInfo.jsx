import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoClient from "./component/InfoClient";
import DiaChi from "./component/DiaChi";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { logOutClientSuccess } from "@/features/ClientAuthSlice";
import DoiMaTKhau from "./component/DoiMatKhau";

function AccountInfo(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      dispatch(logOutClientSuccess()); // Xóa client khỏi Redux và localStorage
      navigate("/profile"); 
    };
    return <>
     <motion.div 
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, ease: "easeOut" }}
     className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
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
                        Thông tin tài khoản
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Tabs defaultValue="info"  className="w-full flex mt-4 ">
                <TabsList 
                className="flex flex-col w-1/4 h-full p-4 justify-start gap-y-2 
                bg-gradient-to-b from-orange-50 to-white border-r">
                    <h1 className="text-lg font-semibold mb-8">Quản lý tài khoản</h1>
                    <TabsTrigger value="info" className="w-full mb-4">Thông tin cá nhân</TabsTrigger>
                    <TabsTrigger value="diaChi" className="w-full mb-4">Quản lý địa chỉ</TabsTrigger>
                    <TabsTrigger value="changePassword" className="w-full mb-8">Thay đổi mật khẩu</TabsTrigger>
                    <button
                    onClick={() => handleLogout()}
                    value="" className="w-full mb-8 py-2 rounded-lg hover:bg-gray-600 hover:text-white duration-300">
                        Đăng xuất
                    </button>
                    
                </TabsList>
                <div className="w-3/4 p-4">
                    <TabsContent value="info"><InfoClient /></TabsContent>
                    <TabsContent value="diaChi"><DiaChi /></TabsContent>
                    <TabsContent value="changePassword"><DoiMaTKhau /></TabsContent>
                </div>
            </Tabs>
        </div>
     </motion.div>
    </>
}
export default AccountInfo;