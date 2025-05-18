import UseFormatMoney from "@/lib/useFormatMoney";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OrderService from "@/services/OrderService";
import { toast } from "react-toastify";

export default function ConfirmOrder({order, historyPayment, setOrder, cartItems}){
    
    // Tính tổng số tiền đã thanh toán
    const soTienDaThanhToan = historyPayment.reduce((tong, item) => tong + item.soTienThanhToan, 0)


    const tongTienHang = (cartItems) => {

        if(cartItems.length <= 0) return 0;

        return cartItems.reduce((tong, item) => {
            return tong + item.thanhTien;
        }, 0);
    };

    const tinhSoTienGiam = (order, tongTienHang) => {

        if(!order.hinhThucGiamGia) return 0;

        if(order.hinhThucGiamGia === 0) {
            let tienGiam = (order.tongTien * order.giaTriGiam) / 100;
            tienGiam = Math.min(tienGiam, order.soTienGiamToiDa);
            return Math.min(tienGiam, tongTienHang);
        }else {
            return Math.min(order.giaTriGiam, tongTienHang);
        }

    }

    const phuPhi = typeof order.phuPhi === "string"
        ? Number(order.phuPhi)
        : order.phuPhi ?? 0;

    // Gọi service cancel hóa đơn
    const handleCancel = async (order) =>{
        const idHD =  order.id || null;
        try {
            const response = await OrderService.cancelInvoice(idHD);
            setOrder(response.data);
            toast.success(response.message);
        }catch (err){
            console.log("Không thể hủy hóa đơn",err);
            toast.error("Hủy thất bại đơn hàng!");
        }
    }

    return <>
        {order.phuPhi && (
            <div className="flex space-x-1 items-center shadow rounded-lg mt-4 p-3 bg-orange-100">
                <p>Đã trả </p>
                <p className="text-red-500 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTienDaThanhToan) }</p>
                <p>bằng phí VNPay,</p>
                <p>và phải trả thêm</p>
                <p className="text-red-500 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(phuPhi) }
                    </p>
                <p>khi nhận hàng</p>
            </div>
        )}
        <div className="grid grid-cols-3 mt-4 ">
            <div className="col-span-1"></div>
            <div className="col-span-1 text-center">
                <h1 className="text-xl">Thông tin đơn hàng</h1>
                <div className="flex justify-center items-center space-x-3 p-2">
                    <p>Tổng tiền hàng: </p>
                    <p className="font-bold">{UseFormatMoney(tongTienHang(cartItems) || 0)}</p>
                </div>

                <div className="flex justify-center items-center space-x-3 p-2">
                    <p>Phí ship:</p>
                    <p className="font-bold">{UseFormatMoney(order.phiShip || 0)}</p>
                </div>

                <div className="flex justify-center items-center space-x-3 p-2">
                    <p>Giảm giá:</p>
                    <p className="font-bold">{UseFormatMoney(tinhSoTienGiam(order, tongTienHang(cartItems)) || 0)}</p>
                </div>

                <div className="flex justify-center items-center space-x-3 p-2">
                    <p>Phụ phí:</p>
                    <p className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(phuPhi) }</p>
                </div>

                <div className="flex justify-center items-center space-x-3 p-2">
                    <p>Tổng tiền:</p>
                    <p className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongTien)}</p>
                </div>

                <div className="flex justify-center items-center space-x-3 p-2">
                    <p>Đã thanh toán:</p>
                    <p className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTienDaThanhToan)}</p>
                </div>

               {order.trangThaiGiaoHang === 1 && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="bg-gray-200 px-2 py-3 rounded-lg hover:scale-95 duration-200 ">Hủy đơn hàng</button>
                    </DialogTrigger>
                    <DialogContent className="fixed top-1/3 left-1/2 -translate-x-1/2 w-1/4 max-w-2xl bg-white p-6 rounded-lg shadow-lg">
                        <DialogHeader>
                            <DialogTitle>
                                Xác nhận hủy đơn hàng  !
                            </DialogTitle>
                            <DialogDescription>
                                Bạn có muốn hủy đơn hàng này không ?
                                (Trường hợp khách hàng đã thanh toán đơn hàng, vui lòng liên hệ:  0868.444.644 để
                                được nhân viên hỗ trợ.)
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-4">
                            <DialogClose className="bg-gray-300 px-3 py-2 rounded-lg hover:bg-gray-400 duration-200">
                                Thoát
                            </DialogClose>

                            <DialogClose 
                            onClick={() => handleCancel(order)}
                            className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 duration-200">
                                Hủy
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
               )}                 
                 
            </div>
            <div className="col-span-4"></div>
            
        </div>
    </>
}