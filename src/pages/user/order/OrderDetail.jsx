import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import {motion} from "framer-motion";
function OrderDetail(){
    return <>
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
                        <Link to="/order-history" >Lịch sử mua hàng</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                       Hóa đơn: mã hóa đơn
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
            </div>
    </motion.div>;
    </>
}
export default OrderDetail;