import { useEffect, useState } from "react";
import HoaDonPhuongThucThanhToan from "../services/HoaDonPhuongThucThanhToanService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function TotalModal({
  isClose,
  idHD,
  khachPhaiThanhToan,
  fetchHoaDonPhuongThuc,
  HDPTTT,
}) {
  const tenNhanVien = useSelector((state)=> state.auth.user.tenNhanVien) 
  const [idPTTT, setIdPTTT] = useState(1);
  const [soTienNhap, setSoTienNhap] = useState(khachPhaiThanhToan);
  const [newHDPTTT, setHDPTTTOB] = useState({
    hoaDonId: idHD,
    phuongThucThanhToanId: idPTTT,
    soTienThanhToan: soTienNhap,
    nguoiXacNhan: tenNhanVien,
  });
  

  const fectAddHDPTTT = async () => {
    if (!soTienNhap) {
      toast.warning("Vui lòng nhập số tiền cần thanh toán.");
      return;
    }
    try {
      const response = await HoaDonPhuongThucThanhToan.AdHDPTTT(newHDPTTT);
      fetchHoaDonPhuongThuc();
      toast.success(`Hóa đơn đã thanh toán số tiền là ${soTienNhap}`);
    } catch (error) {
      console.log("Lỗi khi tạo hóa đơn phương thức thanh toán", error);
    }
  };

  const handleThanhToan = () => {
    isClose();
    fectAddHDPTTT();
  };

  const handleSoTienChange = (e) => {
    const newSoTien = e.target.value;
    setSoTienNhap(newSoTien); // Cập nhật soTienNhap
    setHDPTTTOB((prevState) => ({
      ...prevState,
      soTienThanhToan: Number(newSoTien), // Cập nhật giá trị soTienThanhToan trong newHDPTTT
    }));
  };

  const inputThanhToan = () => {
    if (newHDPTTT.phuongThucThanhToanId === 1) {
      return (
        <>
          <h1 className="text-sm mt-2">Số tiền:</h1>
          <input
            value={soTienNhap}
            onChange={handleSoTienChange}
            type="number"
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 "
          />
          <div className="flex space-x-4 items-center mt-2">
            <h1 className="text-sm ">
              {khachPhaiThanhToan >= soTienNhap
                ? "Tiền Thiếu :"
                : "Tiền Thừa :"}
            </h1>
            <p className="text-sm">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(khachPhaiThanhToan - soTienNhap)}
            </p>
          </div>
        </>
      );
    } else {
      return (
        <div className="mt-2 flex flex-1">
          <div className=" w-1/2">
            <h1 className="text-sm mt-2">Số tiền:</h1>
            <input
              value={soTienNhap}
              onChange={handleSoTienChange}
              type="number"
              className="w-36 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 "
            />
          </div>
          <div>
            <h1 className="text-sm mt-2">Mã giao dịch:</h1>
            <input
              type="text"
              className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 "
            />
          </div>
        </div>
      );
    }
  };

  // console.log(newHDPTTT);
  // console.log(billToday);

  return (
    <div className="modal modal-open">
      <div className="modal-box relative w-[600px]">
        <button
          onClick={isClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h1 className="text-lg text-orange-500 font-medium">Thanh toán</h1>
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-sm">Tổng tiền cần thanh toán:</h1>
          <h1>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(khachPhaiThanhToan)}
          </h1>
        </div>
        {inputThanhToan()}
        <div className="flex justify-center space-x-4 p-4">
          <input
            type="radio"
            name="my_tabs_1"
            onClick={() =>
              setHDPTTTOB((prev) => ({
                ...prev,
                phuongThucThanhToanId: 1,
              }))
            }
            role="tab"
            className="hidden peer/tien-mat"
            id="tien-mat"
            checked={newHDPTTT.phuongThucThanhToanId === 1}
          />
          <label
            htmlFor="tien-mat"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer 
        peer-checked/tien-mat:bg-orange-500 peer-checked/tien-mat:text-white peer-checked/tien-mat:border-orange-500 transition-all"
          >
            Tiền Mặt
          </label>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="hidden peer/chuyen-khoan"
            id="chuyen-khoan"
            onClick={() =>
              setHDPTTTOB((prev) => ({
                ...prev,
                phuongThucThanhToanId: 2,
              }))
            }
            checked={newHDPTTT.phuongThucThanhToanId === 2}
          />
          <label
            htmlFor="chuyen-khoan"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer 
        peer-checked/chuyen-khoan:bg-orange-500 peer-checked/chuyen-khoan:text-white peer-checked/chuyen-khoan:border-orange-500 transition-all"
          >
            Chuyển khoản
          </label>
        </div>
        <h1 className="text-center text-lg text-orange-500">
          Lịch sử thanh toán
        </h1>
        <table className="table">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center">STT</th>
              <th className="px-4 py-2 text-center">Mã giao dịch</th>
              <th className="px-4 py-2 text-center">Phương thức</th>
              <th className="px-4 py-2 text-center">Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {HDPTTT.map((tt, i) => (
              <tr key={tt.hoaDonPhuongThucThanhToan_id}>
                <td className="px-4 py-2 text-center">{i + 1}</td>
                <td className="px-4 py-2 text-center"></td>
                <td className="px-4 py-2 text-center">{tt.tenPhuongThuc}</td>
                <td className="px-4 py-2 text-center">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(tt.soTienThanhToan)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-1 mt-4">
          <div className="w-2/3"></div>
          <div className="flex space-x-4 ">
            <button onClick={isClose} className="btn">
              Hủy
            </button>
            <button
              onClick={() => handleThanhToan()}
              className="btn bg-orange-500 hover:bg-orange-600 text-white"
            >
              Xác nhận
            </button>
          </div>
        </div>
        {/* {nút xác nhận} */}
      </div>
    </div>
  );
}
