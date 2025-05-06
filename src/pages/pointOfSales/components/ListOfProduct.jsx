import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LuScanQrCode } from "react-icons/lu";
function ListOfProduct ({ order }) {
    return <>
        <div className="bg-white rounded-lg shadow p-2 mb-4 flex justify-between items-center">
            <h1 className="text-lg font-bold">Hóa đơn: {order.maHoaDon}</h1>
            <div className="flex space-x-4">
                <Dialog>
                    <DialogTrigger>
                        <button className="bg-orange-500 px-3 py-2 text-white rounded-lg active:scale-95 duration-200">
                            Thêm sản phẩm
                        </button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-5xl max-h-[700px] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg">
                                Danh sách sản phẩm
                            </DialogTitle>
                        </DialogHeader>
                        <div>
                            Đây là danh sách
                        </div>
                    </DialogContent>
                </Dialog>
                <button className="bg-orange-500 px-3 py-2 text-white rounded-lg active:scale-95 duration-200">
                   <LuScanQrCode/>
                </button>
            </div>
        </div>
    </>
}
export default ListOfProduct;