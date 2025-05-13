import UseFormatMoney from "@/lib/useFormatMoney";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaCartPlus, FaRegTrashAlt } from "react-icons/fa";
import OrderDetailService from "@/services/OrderDetailService";
import { toast } from "react-toastify";
import { FaCaretUp, FaCaretDown  } from "react-icons/fa";
import { useRef } from "react";
function CartOfBill ({ cartItems, setCartItems, order }) {

    //Gọi hàm xóa sản phẩm chi tiết
    const fetchDelete = async (idHDCT) => {
        try{
            const response = await OrderDetailService.delete(idHDCT);
            setCartItems(response.data);
            toast.success("Đã loại sản phẩm ra khỏi giỏ hàng.");
        }catch (err){
            console.log("Không thể xóa sản phẩm", err);
            toast.error("Có lỗi khi xóa. vui long thử lại.")
        }
    }

    // Gọi hàm cập nhật số lượng sản phẩm
    const timeoutRef = useRef(null);

    const giamSoLuong = (itemHDCT, soLuongMoi) => {
        if(soLuongMoi === 0) return;

        let khoangSoLuong = itemHDCT.soLuong - soLuongMoi;

        setCartItems(prev =>
            prev.map(item =>
                item.id === itemHDCT.id ? {...item, soLuong: soLuongMoi, soLuongTon: itemHDCT.soLuongTon + khoangSoLuong} : item
            )
        );

        // Hủy timeout cũ nếu có
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Đặt timeout mới
        timeoutRef.current = setTimeout(() => {
            fetchUpdateSoLuong(itemHDCT.id, soLuongMoi);
        }, 500);
    }

    const tangSoLuong = (itemHDCT, soLuongMoi) => {
        if(soLuongMoi === 0 || itemHDCT.soLuongTon <= 0) return;

        let khoangSoLuong = itemHDCT.soLuong - soLuongMoi;

        setCartItems(prev =>
            prev.map(item =>
                item.id === itemHDCT.id ? {...item, soLuong: soLuongMoi, soLuongTon: itemHDCT.soLuongTon + khoangSoLuong} : item
            )
        );

        // Hủy timeout cũ nếu có
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Đặt timeout mới
        timeoutRef.current = setTimeout(() => {
            fetchUpdateSoLuong(itemHDCT.id, soLuongMoi);
        }, 500);
    }

    const capNhatSoLuong = (itemHDCT, soLuongMoi) => {
        if(soLuongMoi === 0 ) return;

        if(!soLuongMoi) {
            soLuongMoi = 1;
        }

        let khoangSoLuong = itemHDCT.soLuong - soLuongMoi;

        let updateSLTon = itemHDCT.soLuongTon + khoangSoLuong

        if(updateSLTon < 0) return;

        setCartItems(prev =>
            prev.map(item =>
                item.id === itemHDCT.id ? {...item, soLuong: soLuongMoi, soLuongTon: updateSLTon} : item
            )
        );

        // Hủy timeout cũ nếu có
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Đặt timeout mới
        timeoutRef.current = setTimeout(() => {
            fetchUpdateSoLuong(itemHDCT.id, soLuongMoi);
        }, 500);

    };
    const fetchUpdateSoLuong = async (idHDCT, soLuong) => {
        try {
            const response = await OrderDetailService.updateQuantity(idHDCT, soLuong);
            const updateItem = response.data;
            console.log("Đây là hóa đơn chi tiết khi update", updateItem);

            setCartItems(prev =>
                prev.map(item =>
                    item.id === idHDCT ? {...item, ...updateItem} : item
                )
            );


        }catch(err) {
            console.log("Lỗi khi thay đổi số lượng sản phẩm.", err);
            toast.error("Không thể thay đổi số lượng sản phẩm!")
        }
    }

    console.log(cartItems);
    return <>
        <div className="bg-white rounded-lg shadow p-2 mb-4">
            <h1 className="text-lg font-bold mb-2">Giỏ hàng</h1>
            {/* Nếu như giỏ hàng trống */}
            {cartItems.length <= 0 && (
                <div className="bg-gray-200 h-64 flex justify-center items-center rounded-lg ">
                    <FaCartPlus className="text-9xl" />
                </div>
            )}
            
            {/* Nếu có sản phẩm trong giỏ hàng */}
            {cartItems.length > 0 && (
                <div>
                    <table className="table table-auto w-full bg-white rounded-lg shadow text-center text-xs mt-2">
                        <thead className="bg-gray-200">
                            <tr className="text-center">
                                <th className="px-4 py-2">STT</th>
                                <th className="px-4 py-2">Hình ảnh</th>
                                <th className="px-4 py-2">Tên sản phẩm</th>
                                <th className="px-4 py-2">Số lượng</th>
                                <th className="px-4 py-2">Thành tiền</th>
                                <th className="px-4 py-2">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, i) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2">{i + 1}</td>
                                    <td className="px-4 py-2 flex justify-center">
                                        <img 
                                        className="skeleton h-32 w-32 object-cover"
                                        src={item.hinhAnh} alt="" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <p className="text-base font-bold">
                                            {item.tenSanPham} [{item.tenMauSac} - {item.tenKichThuoc}]
                                        </p>
                                        <p>Mã SP: SPCT{item.idSPCT}</p>
                                        <p>
                                            Đơn giá:{" "}
                                            <strong className="text-orange-600">
                                                {UseFormatMoney(item.donGia)}
                                            </strong>
                                        </p>
                                        {item.donGiaCu && (
                                            <div className="flex justify-center space-x-1">
                                                <p>Giá cũ:</p>
                                                <span class="line-through text-gray-500">
                                                    {UseFormatMoney(item.donGiaCu)}
                                                </span>
                                            </div>
                                        )}
                                        <span>Kho: {item.soLuongTon}</span>
                                    </td>
                                    <td>
                                       <div className="flex justify-center">
                                            <input 
                                            value={item.soLuong}
                                            onChange={(e) => capNhatSoLuong(item, parseInt(e.target.value))}
                                            className="w-1/5 text-center m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                                            type="text" />

                                            <div className="relative">
                                                <button 
                                                onClick={() => tangSoLuong(item, item.soLuong + 1)}
                                                className="absolute top-1 text-lg active:text-orange-500 duration-150">
                                                    <FaCaretUp />
                                                </button>
                                                <button 
                                                onClick={() => giamSoLuong(item, item.soLuong - 1)}
                                                className=" absolute bottom-1 text-lg active:text-orange-500 duration-150">
                                                    <FaCaretDown />
                                                </button>
                                            </div>
                                       </div>
                                    </td>
                                    <td>{UseFormatMoney(item.thanhTien)}</td>
                                    <td>
                                        {order.trangThaiGiaoHang === 8 && (
                                            <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="bg-orange-">
                                                    <FaRegTrashAlt className="text-orange-500 text-lg cursor-pointer"/>
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="fixed top-1/3 left-1/2 -translate-x-1/2 w-1/4 max-w-2xl bg-white p-6 rounded-lg shadow-lg">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Xác nhận xóa sản phẩm  !
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Bạn có muốn xóa sản phẩm này ra khỏi giỏ hàng không ?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex justify-end space-x-4">
                                                    <DialogClose className="bg-gray-300 px-3 py-2 rounded-lg hover:bg-gray-400 duration-200">
                                                        Hủy
                                                    </DialogClose>

                                                    <DialogClose 
                                                    onClick={() => fetchDelete(item.id)}
                                                    className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 duration-200">
                                                        Xóa
                                                    </DialogClose>
                                                </div>
                                            </DialogContent>
                                            </Dialog>
                                        )}
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </>
}
export default CartOfBill;