import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import UseFormatMoney from "@/lib/useFormatMoney";
import { motion } from "framer-motion";
function OrderInfo({hoaDon, lichSuThanhToan, gioHang}){
   
    const tongTienHang = (gioHang) => {

        if(gioHang.length <= 0) return 0;

        return gioHang.reduce((tong, item) => {
            return tong + item.thanhTien;
        }, 0);
    };

    const soTienGiam = (order, tongTienHang) => {

        if(!order.maPhieuGiamGia) return 0;

        if(order.hinhThucGiamGia === 0) {
            let tienGiam = (tongTienHang * order.giaTriGiam) / 100;
            tienGiam = Math.min(tienGiam, order.soTienGiamToiDa);
            return Math.min(tienGiam, tongTienHang);
        }else {
            return Math.min(order.giaTriGiam, tongTienHang);
        }

    }

    // Tính tổng số tiền đã thanh toán
    const soTienDaThanhToan = lichSuThanhToan.reduce((tong, item) => tong + item.soTienThanhToan, 0);

    const phuPhi = typeof hoaDon.phuPhi === "string"
    ? Number(hoaDon.phuPhi)
    : hoaDon.phuPhi ?? 0;
    
    const itemsInfo = (text, content) => {
        return <div className="w-1/4 border border-gray-200 shadow text-center rounded-lg p-4">
            <h1 className="text-md text-gray-500">{text}</h1>
            <p className="text-lg text-orange-500">{content}</p>
        </div>
    }

    const customerInfo = (text, content) => {
        return <div className="border border-gray-200 shadow rounded-lg p-4 my-4">
            <h1 className="text-md text-gray-500">{text}</h1>
            <p className="text-lg text-orange-500">{content}</p>
        </div>
    }

    return <>
        <motion.div className="w-full bg-white rounded-lg shadow p-4 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="text-lg mb-2">
                        Thông tin hóa đơn
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex justify-between items-center space-x-4 p-4">
                {itemsInfo("Mã hóa đơn",hoaDon.maHoaDon)}
                {itemsInfo("Giảm giá",new Intl.NumberFormat("vi-VN", {style: "currency",currency: "VND",}).format(soTienGiam(hoaDon, tongTienHang(gioHang))))}
                {itemsInfo("Phí vận chuyển",
                    new Intl.NumberFormat("vi-VN", {style: "currency",currency: "VND",}).format(hoaDon.phiShip))}
                {itemsInfo("Tổng tiền",
                new Intl.NumberFormat("vi-VN", {style: "currency",currency: "VND",}).format(hoaDon.tongTien))}
                {(hoaDon?.phuPhi > 0) && (
                    itemsInfo("Phụ Phí", UseFormatMoney(hoaDon.phuPhi))
                )}
            </div>
                <div className="relative mb-4">
                    <h1 className="w-full text-lg text-gray-500 ">Thông tin khách hàng</h1>
                    {/* {((hoaDon.loaiDon ===0 || hoaDon.loaiDon ===2 ) && hoaDon.trangThaiGiaoHang < 2) && (
                        <button className="absolute right-4 top-[-8px] px-4 py-2 bg-orange-500 text-white rounded-lg hover:scale-105 duration-200">
                            Thay đổi thông tin
                        </button>
                    )} */}
                </div>
                <div className="flex justify-center space-x-4">
                    <div className="w-1/2 border border-gray-200 shadow rounded-lg p-4">
                        <h1 className="text-md text-gray-500">Mã khách hàng</h1>
                        <p className="text-lg text-orange-500">{hoaDon.maKhachHang || "Khách lẻ"}</p>
                    </div>
                    <div className="w-1/2 border border-gray-200 shadow rounded-lg p-4">
                        <h1 className="text-md text-gray-500">Họ tên khách hàng</h1>
                        <p className="text-lg text-orange-500">{hoaDon.tenKhachHang || "Khách lẻ"}</p>
                    </div>
                </div>
                {(hoaDon.loaiDon ===0 || hoaDon.loaiDon ===2 ) && (
                <>
                    <div className="flex justify-center space-x-4">
                    <div className="w-1/2">
                        {customerInfo("Người nhận hàng",hoaDon.hoTenNguoiNhan || "khách lẻ")}
                        {customerInfo("Email",hoaDon.email || "khách lẻ")}
                    </div>
                    <div className="w-1/2">
                        {customerInfo("Số điện thoại",hoaDon.soDienThoai || "khách lẻ")}
                        {customerInfo("Địa chỉ nhận hàng",hoaDon.diaChiNhanHang || "khách lẻ")}
                    </div>
                </div>
                </>
                )}
        </motion.div>
        <div className="w-full bg-white rounded-lg shadow p-4 mb-2">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="text-lg mb-2">
                        Lịch sử hóa đơn
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <table className="table table-auto rounded shadow text-center">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">STT</th>
                        <th className="px-4 py-2">Mã giao dịch</th>
                        <th className="px-4 py-2">Số tiền thanh toán</th>
                        <th className="px-4 py-2">Thời gian</th>
                        <th className="px-4 py-2">Phương thức</th>
                        <th className="px-4 py-2">Người xác nhận</th>
                    </tr>
                </thead>
                <tbody>
                    {lichSuThanhToan.map((item, i) => (
                        <tr key={i}>
                            <td className="px-4 py-2">{i + 1}</td>
                            <td className="px-4 py-2">{item.maGiaoDich || 0}</td>
                            <td className="px-4 py-2">{new Intl.NumberFormat("vi-VN", {style: "currency",currency: "VND",}).format(item.soTienThanhToan) || 0}</td>
                            <td className="px-4 py-2">{item.ngayThucHienThanhToan}</td>
                            <td className="px-4 py-2">{item.tenPhuongThuc}</td>
                            <td className="px-4 py-2">{item.nguoiXacNhan}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {hoaDon?.maPhieuGiamGia && (
            <div className="p-2 mb-2 border rounded-lg bg-orange-200">
                <p>
                    Đã áp dụng phiếu giảm giá <span className="font-bold">{hoaDon.tenPhieuGiamGia}</span>: giảm 
                    <span className="font-bold">  {hoaDon.hinhThucGiamGia === 1  
                    ? UseFormatMoney(hoaDon.giaTriGiam):`${hoaDon.giaTriGiam } %`} </span>
                     cho đơn hàng từ 
                    <span className="font-bold">  {UseFormatMoney(hoaDon.soTienToiThieuHd)}</span>
                    {hoaDon.hinhThucGiamGia === 0 && (
                        <span className="font-bold">, giảm tối đa {UseFormatMoney(hoaDon.soTienGiamToiDa)}</span>
                    )}
                </p>
            </div>
        )}

        {(hoaDon.phuPhi || hoaDon.phuPhi > 0) && (
            <div className="flex space-x-1 items-center shadow rounded-lg mt-2 p-3 bg-orange-200">
                <p>Đã trả </p>
                <p className="text-red-500 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTienDaThanhToan) }</p>
                <p>bằng phí VNPay,</p>
                {hoaDon.phuPhi > 0 && (
                    <>
                        <p>và phải trả thêm</p>
                        <p className="text-red-500 font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(phuPhi) }
                            </p>
                        <p>khi nhận hàng</p>
                    </>
                )}

                {hoaDon?.phuPhi < 0 && (
                     <>
                        <p>và Shop phải trả lại</p>
                        <p className="text-red-500 font-bold">
                            {UseFormatMoney(Math.abs(phuPhi))}
                        </p>
                    </>
                )}
                
            </div>
        )}
    </>
}
export default OrderInfo;