import { motion } from "framer-motion";
function ButtonTrangThai({hoaDon, handleCapNhatDonHang}){

    return <>
     <motion.div className="flex relative space-x-4 w-full bg-white rounded-lg shadow p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
     >
        {hoaDon.loaiDon === 0 && (
            <>
                <button className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:scale-105 duration-200 cursor-not-allowed"
                disabled
                >Quay lại</button>
                <button className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200"
                onClick={handleCapNhatDonHang}
                >
                    Chuyển
                </button>
            </>
        )}
        {(hoaDon.trangThaiGiaoHang === 1 || hoaDon.trangThaiGiaoHang === 8) && 
            <button className="px-4 py-2 bg-gray-200 rounded-lg hover:scale-105 duration-200">
                Hủy
            </button>
        }
        <div className="p-4"></div>
        
        <div className="absolute right-4 space-x-4">
            <button className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200">
                In hóa đơn
            </button>
            <button className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200">
                Chi tiết
            </button>
        </div>
     </motion.div>
    </>

}
export default ButtonTrangThai;