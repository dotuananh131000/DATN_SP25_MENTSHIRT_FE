import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UseFormatMoney from "@/lib/useFormatMoney";
import { FaRegTrashAlt } from "react-icons/fa";

export default function CartOfOrder ({cartItems}) {
    console.log(cartItems);
    return <div className="bg-white p-4 rounded-lg shadow">
        <div>
            <table className="table table-auto w-full bg-white rounded-lg shadow text-center text-xs mt-2">
                <thead className="bg-gray-200">
                    <tr className="text-center">
                        <th className="px-4 py-2">STT</th>
                        <th className="px-4 py-2">Hình ảnh</th>
                        <th className="px-4 py-2">Tên sản phẩm</th>
                        <th className="px-4 py-2">Số lượng</th>
                        <th className="px-4 py-2">Thành tiền</th>
                        <th className="px-4 py-2">Trạng thái</th>
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
                            </td>
                            <td>
                                <input 
                                value={item.soLuong}
                                className="w-1/3 m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                                type="text" />
                            </td>
                            <td>{UseFormatMoney(item.thanhTien)}</td>
                            <td className="text-center align-middle">
                                <p
                                className={`${item.trangThai === 1?"bg-orange-500 text-white":"bg-gray-400 text-white"} 
                                p-1 rounded-lg w-28 mx-auto`}
                                >{item.trangThai === 1 ? "Đã thanh toán":"chưa thanh toán"}</p>
                            </td>
                            <td>
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

                                            <DialogClose className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 duration-200">
                                                Xóa
                                            </DialogClose>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
}