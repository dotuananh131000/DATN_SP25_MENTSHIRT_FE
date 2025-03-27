import { motion } from "framer-motion";
import { LuClock5, LuNotebookPen } from "react-icons/lu";
import { FcAcceptDatabase } from "react-icons/fc";
import { MdOutlineTimeToLeave } from "react-icons/md";
import { FaTruckFast } from "react-icons/fa6";
import { AiOutlineCheck, AiFillCheckCircle } from "react-icons/ai";
import { memo } from "react";
function StepsTrangThaiHoaDon({hoaDon}){

    console.log(hoaDon);
    
    const orderSteps =[
        {id:1 , status: "Chờ xác nhận", icon: <LuClock5 className="text-gray-500 text-2xl" /> },
        {id:2 , status: "Xác nhận", icon: <FcAcceptDatabase className="text-green-500 text-2xl" /> },
        {id:3 , status: "Chờ vận chuyển", icon: <MdOutlineTimeToLeave className="text-blue-500 text-2xl" /> },
        {id:4 , status: "Đang vận chuyển", icon: <FaTruckFast className="text-yellow-500 text-2xl" /> },
        {id:5 , status: "Thành công", icon: <AiOutlineCheck className="text-green-600 text-2xl" /> },
    ]

    const billSteps =[
        {id:9 , status: "Đã xác nhận", icon: <AiOutlineCheck className="text-green-600 text-2xl" /> },
        {id:9 , status: "Đã thanh toán", icon: <AiFillCheckCircle className="text-orange-600 text-2xl" /> },
    ]
    

    if(hoaDon.loaiDon ===1){
        return <>
        <div className="flex justify-center space-x-28 w-full px-4 bg-white rounded-lg shadow p-4 mb-4">
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <div 
            className="p-4 flex flex-col items-center border rounded-lg 
            shadow-md transition-all duration-300 border-green-500 bg-green-50">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full`}>
                    <LuNotebookPen className="text-purple-500 text-2xl" />
                </div>
                <div className="mt-2 text-center font-semibold">Tạo hóa đơn</div>
                <div className="absolute top-1/2 left-full w-28 h-1 bg-green-500" ></div>
            </div>
        </motion.div>
       {billSteps.map((step, index) =>(
        <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 1) * 0.2 }}
        >
          <div
            className={`p-4 flex flex-col items-center border rounded-lg shadow-md transition-all duration-300 ${
              step.id <= hoaDon.trangThaiGiaoHang  ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"
            }`}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full`}>
              {step.icon}
            </div>
            <div className="mt-2 text-center font-semibold">{step.status}</div>
          </div>
          {index < billSteps.length - 1 && (
            <div
              className={`absolute top-1/2 left-full w-28 h-1 ${
                step.id <= hoaDon.trangThaiGiaoHang ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          )} 
          
        </motion.div>
       ))}
       </div>
      
        </>
    } else{
        return <>
        <div className="flex justify-between w-full px-4 bg-white rounded-lg shadow p-4 mb-4">
         <motion.div
             className="relative"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
         >
             <div 
             className="p-4 flex flex-col items-center border rounded-lg 
             shadow-md transition-all duration-300 border-green-500 bg-green-50">
                 <div className={`w-12 h-12 flex items-center justify-center rounded-full`}>
                     <LuNotebookPen className="text-purple-500 text-2xl" />
                 </div>
                 <div className="mt-2 text-center font-semibold">Tạo hóa đơn</div>
             </div>
             <div className="absolute top-1/2 left-full w-28 h-1 bg-green-500" ></div>
         </motion.div>
        {orderSteps.map((step, index) =>(
         <motion.div
             key={index}
             className="relative"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: (index + 1) * 0.2 }}
         >
           <div
             className={`p-4 flex flex-col items-center border rounded-lg shadow-md transition-all duration-300 ${
               index + 1 <= hoaDon.trangThaiGiaoHang ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"
             }`}
           >
             <div className={`w-12 h-12 flex items-center justify-center rounded-full`}>
               {step.icon}
             </div>
             <div className="mt-2 text-center font-semibold">{step.status}</div>
           </div>
           {index < orderSteps.length - 1 && (
             <div
               className={`absolute top-1/2 left-full w-28 h-1 ${
                index + 1 < hoaDon.trangThaiGiaoHang ? "bg-green-500" : "bg-gray-300"
               }`}
             ></div>
           )} 
         </motion.div>
        ))}
        </div>
     </>
    }
   
}
export default memo(StepsTrangThaiHoaDon);