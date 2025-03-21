export default function ChiTietHoaDon({ hoaDon }) {
  const itemChiTietDongHang = (title, content) => {
    return (
      <div className="w-1/3 px-4 py-3 m-4 border rounded-lg bg-white shadow-lg">
        <h1 className="text-center font-bold text-gray-700">{title}</h1>
        <p className="font-bold text-orange-700 text-center pt-2">{content}</p>
      </div>
    );
  };

  const itemThongTinKhachHang = (title, content) => {
    return (
      <div className="bg-white shadow border rounded-lg p-2 m-4 h-[80px] bg-white shadow-lg">
        <h1 className="font-bold text-gray-700">{title}</h1>
        <p className=" pt-2 text-sm text-orange-700">{content}</p>
      </div>
    );
  };
  // console.log(hoaDon);
  return (
    <div className="bg-white rounded-lg shadow px-4 py-4 mb-4">
      <h1 className="text-2xl text-orange-600 text-center font-bold mb-4">
        Chi tiết hóa đơn
      </h1>
      <div className="">
        <div className="flex mb-4 ">
          {itemChiTietDongHang("Mã hóa đơn", hoaDon?.maHoaDon)}
          {itemChiTietDongHang(
            "Phí vận chuyển",
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(hoaDon?.phiShip)
          )}
          {itemChiTietDongHang(
            "Giảm giá",
            hoaDon?.giaTriGiam != null
              ? hoaDon?.hinhThucPhieuGiamGia === 0
                ? `${hoaDon?.giaTriGiam}%`
                : new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(hoaDon?.giaTriGiam)
              : "Không có giảm giá"
          )}
          {itemChiTietDongHang(
            "Tổng tiền",
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(hoaDon?.tongTien)
          )}
        </div>
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold mt-4">Thông tin hóa đơn</h1>
          <button className="btn text-base font-normal bg-orange-500 hover:bg-orange-600 text-white ">
            Thay đổi thông tin
          </button>
        </div>
        <div className="flex space-x-2 ">
          <div className="w-1/2">
          {itemThongTinKhachHang(
          "Tên khách hàng",
          hoaDon.loaiDon === 0
              ? (!hoaDon?.hoTenNguoiNhan ? "Khách lẻ" : hoaDon?.hoTenNguoiNhan)
              : (!hoaDon?.tenKhachHang ? "Khách lẻ" : hoaDon?.tenKhachHang)
            )}
            {itemThongTinKhachHang(
              "Email người nhận",
              !hoaDon?.email ? "Không có" : hoaDon?.email
            )}
          </div>
          <div className="w-1/2">
            {itemThongTinKhachHang(
              "Số điện thoại",
              hoaDon?.loaiDon === 0
              ? (!hoaDon?.soDienThoai ? "Không có" : hoaDon?.soDienThoai)
              : (hoaDon?.sdtKH)
              
            )}
            {itemThongTinKhachHang(
              "Địa chỉ nhận hàng",
              !hoaDon?.diaChiNhanHang ? "Không có" : hoaDon?.diaChiNhanHang
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
