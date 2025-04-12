import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { motion } from "framer-motion";
function ButtonTrangThai({hoaDon, handleCapNhatDonHang, handleClickHistory, listHistoryHD, setListHistoryHD}){

    console.log(listHistoryHD);
    return <>
     <motion.div className="flex relative space-x-4 w-full bg-white rounded-lg shadow p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
     >
        {hoaDon.loaiDon === 0 && (
            <>
                {hoaDon.trangThaiGiaoHang !== 5 && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200">
                                Chuyển trạng thái
                            </button>
                        </DialogTrigger>
                        <DialogContent className="top-10 max-w-md translate-y-0">
                            <DialogHeader className="text-lg">
                                Xác nhận chuyển trạng thái
                            </DialogHeader>
                            {
                                 hoaDon.trangThaiGiaoHang === 1
                                 ? "Chuyển trạng thái thành: Đã xác nhân"
                                 : hoaDon.trangThaiGiaoHang === 2
                                   ? "Chuyển trạng thái thành: Chờ vận chuyển"
                                   : hoaDon.trangThaiGiaoHang === 3
                                     ? "Chuyển trạng thái đơn hàng thành: Đang vận chuyển"
                                     : hoaDon.trangThaiGiaoHang === 4
                                       ? "Chuyển trạng thái thành: Đã hoàn thành"
                                         : ""
                            }

                           <DialogClose>
                            <button 
                            className="px-4 py-3 text-white bg-orange-600 hover:scale-95 duration-200 rounded-lg w-1/3"
                            onClick={handleCapNhatDonHang}>
                                Xác nhận
                            </button>
                            </DialogClose>
                        </DialogContent>
                    </Dialog>
                   
                )}

                {hoaDon.trangThaiGiaoHang === 5 && (
                    <p className="px-4 py-2 bg-blue-600 rounded-lg text-white "
                    >
                        Thành Công
                    </p>
                )}
            </>
        )}
        {(hoaDon.trangThaiGiaoHang === 1 || hoaDon.trangThaiGiaoHang === 8) && 
            <Dialog>
                <DialogTrigger asChild>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg hover:scale-105 duration-200">
                        Hủy
                    </button>
                </DialogTrigger>
                <DialogContent className="top-10 max-w-md translate-y-0">
                    <DialogHeader>
                        <DialogTitle>
                            Xác nhận hủy đơn hàng!
                        </DialogTitle>
                        <DialogDescription className="text-lg">
                            Bạn thật lòng muốn hủy hóa đơn này ư ?
                        </DialogDescription>
                       
                    </DialogHeader>
                        <DialogClose>
                            <button className="bg-orange-600 px-4 py-3 rounded-lg text-white">Xác nhận</button>
                        </DialogClose>
                </DialogContent>
            </Dialog>
           
        }
        <div className="p-4"></div>
        
        <div className="absolute right-4 space-x-4">
            <button className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200">
                In hóa đơn
            </button>
            <Drawer>
                <DrawerTrigger asChild>
                    <button
                    onClick={handleClickHistory}
                    className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200">
                        Chi tiết
                    </button>
                </DrawerTrigger>
                <DrawerContent className="w-[500px] h-3/4 ml-auto mr-0 overflow-y-auto">
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle className="text-center text-lg">Lịch sử hóa đơn</DrawerTitle>
                        </DrawerHeader>
                        {listHistoryHD.map((item, i) => (
                            <>
                                <hr className="border border-1 bor m-2" />
                                <div className="pl-2">
                                    <h1 className="font-bold text-lg text-gray-500">{item.nguoiThayDoi}</h1>
                                    <p><span className="font-bold text-lg text-gray-500">Thời gian:</span> {item.thoiGianThayDoi}</p>  
                                    <p><span className="font-bold text-lg text-gray-500" >Hành động:</span> {item.hanhDong}</p>
                                </div>
                            </>
                        ))}
                    </div>
                </DrawerContent>
            </Drawer>
            
        </div>
     </motion.div>
    </>

}
export default ButtonTrangThai;