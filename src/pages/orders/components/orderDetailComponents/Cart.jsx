import { FaRegTrashAlt } from "react-icons/fa";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";
import { useState } from "react";
function Cart({gioHang}){

    const [isEditing, setIsEditing] = useState(false);
    const [quantity, setQuantity] = useState(0);

    const handleBlur = () => {
        setIsEditing(false);
    };

    return <>
        <motion.div className="bg-white rounded-lg shadow w-full p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="text-lg mb-2">
                        Giỏ hàng
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <table className="table table-auto rounded-lg shadow">
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

                </tbody>
                <tbody>
                    {gioHang.map((item, i) => (
                        <tr key={item.id} className="text-center">
                            <td className="px-4 py-2">{i + 1}</td>
                            <td className="px-4 py-2 flex justify-center">
                                <img src={item.hinhAnh} alt="Đây là ảnh" className="skeleton h-32 w-32 object-cover" />
                            </td>
                            <td className="px-4 py-2">
                                <p className="text-base font-bold">
                                    {item.tenSanPham} [{item.tenMauSac} - {item.tenKichThuoc}]
                                </p>
                                <p>Mã SP: SPCT{item.idSPCT}</p>
                                <p>
                                    Đơn giá:{" "}
                                    <strong className="text-orange-600">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(item.donGia)}
                                    </strong>
                                </p>
                            </td>
                            <td className="px-4 py-2 ">
                                
                                <div className="p-4 flex justify-center items-center space-x-4">
                                <button className="px-4 py-1 bg-gray-200 rounded-lg text-lg">-</button>
                                    {isEditing ? (
                                        <motion.input
                                            type="number"
                                            value={quantity}
                                            autoFocus
                                            onChange={(e) => setQuantity(e.target.value)}
                                            onBlur={handleBlur}
                                            className="border border-gray-300 rounded p-1 w-20"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                        />
                                    ) : (
                                        <motion.p 
                                            onDoubleClick={() => setIsEditing(true)} 
                                            className="cursor-pointer hover:underline px-4 py-1"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                        >
                                            {quantity}
                                        </motion.p>
                                    )}
                                <button className="px-4 py-1 bg-gray-200 rounded-lg text-lg">+</button>
                                </div>
                                
                            </td>
                            <td className="px-4 py-2">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(item.thanhTien)}
                            </td>
                            <td className="text-center">
                                <button>
                                    <FaRegTrashAlt className="text-orange-500 text-lg" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    </>

}
export default Cart;