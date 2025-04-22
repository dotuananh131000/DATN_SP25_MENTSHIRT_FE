export default function OrderInfo({order}){
    console.log(order);
    return <div className="bg-white p-4 rounded-lg shadow">
        <h1 className="text-xl">Địa chỉ nhận hàng</h1>
        <div className="mt-2">
            <h1><span className="text-md">Tên người nhân:</span> {order.hoTenNguoiNhan}</h1>
            <h1><span className="text-md">Số điện thoại:</span> {order.soDienThoai}</h1>
            <h1><span className="text-md">Địa chỉ nhận hàng: </span>{order.diaChiNhanHang}</h1>
        </div>
    </div>
}