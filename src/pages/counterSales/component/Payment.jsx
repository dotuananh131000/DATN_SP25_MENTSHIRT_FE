import { useEffect, useState } from "react";
import { AiFillCreditCard } from "react-icons/ai";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { MdPlace } from "react-icons/md";
import api_giaoHangNhanh from "../services/GiaoHangNhanhService";
import TotalModal from "./TotalModal";
import ListPhieuGiamGia from "./ListPhieuGiamGia";
import HoaDonService from "../services/HoaDonService";
import { toast } from "react-toastify";
import HoaDonPhuongThucThanhToan from "../services/HoaDonPhuongThucThanhToanService";
import DiaChiKhacHangService from "../services/DiaChiKhachHangService";
export default function Payment({
  billToday,
  selectedTab,
  isOpenConfirm,
  isChecked,
  setIsChecked,
  pggs,
  pggkh,
  handleUpdateTrangThaiHoaDon,
  phieuGiamGiaTN,
  sanPhamGioHang,
  hdHienTai,
}) {
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [provinceID, setProvinceID] = useState();
  const [districtID, setDistrictID] = useState();
  const [wardCOde, setWardCode] = useState();
  const [isTotal, setIsTotal] = useState(false);
  const [isPGG, setPGG] = useState(false);
  const [serviceId, setServiceId] = useState(0);
  const [fee, setFee] = useState(0);
  const [HDPTTT, setHDPTTT] = useState([]);
  const [diaChiKH, setDiaChiKH] = useState([]);
  const [diaChiCuThe, setDiaChiCuThe] = useState("");

  const fetchDiaChiKH = async (id) => {
    try {
      const response = await DiaChiKhacHangService.diaChi(id);
      const diaChi = response.data;
      setDiaChiKH(diaChi);
      setProvinceID(diaChi[0]?.tinhThanhId);
      setDistrictID(diaChi[0]?.quanHuyenId);
      setWardCode(diaChi[0]?.phuongXaId);
    } catch (err) {
      console.log("Không thể lấy địa chỉ khách hàng", err);
    }
  };
  useEffect(() => {
    if (!hdHienTai?.idKhachHang) {
      return;
    }
    fetchDiaChiKH(hdHienTai?.idKhachHang);
  }, [hdHienTai]);

  // console.log(diaChiKH);
  // console.log(diaChiKH[0]?.diaChiChiTiet);

  const [thongTinDonHang, setThongTinDongHang] = useState({
    hoTenNguoiNhan: hdHienTai?.tenKhachHang,
    sdt: "",
    diaChiNhanHang: "",
    phiShip: 0,
  });
  useEffect(() => {
    setThongTinDongHang((pre) => ({
      ...pre,
      hoTenNguoiNhan: hdHienTai?.tenKhachHang || "",
      sdt: hdHienTai?.soDienThoai || "",
    }));
  }, [hdHienTai]);
  useEffect(() => {
    setThongTinDongHang((pre) => ({
      ...pre,
      phiShip: Math.round(fee / 500) * 500,
    }));
  }, [fee]);

  // console.log(thongTinDonHang);
  const handleHoTenNguoiNhan = (e) => {
    const newThongTinNguoiNhan = e.target.value;
    if (newThongTinNguoiNhan.length >= 50) {
      toast.warning("Tên người nhận quá dài. Vui lòng nhập lại");
      return (e.target.value = "");
    }
    if (/[0-9]/.test(newThongTinNguoiNhan)) {
      toast.warning("Tên người nhận không được chứa số.");
      return;
    }
    if (newThongTinNguoiNhan)
      setThongTinDongHang((prev) => ({
        ...prev,
        hoTenNguoiNhan: newThongTinNguoiNhan,
      }));
  };

  const handleSDT = (e) => {
    const newSDT = e.target.value;

    // 🛠 Regex kiểm tra số điện thoại: Bắt đầu bằng `0`, có đúng 13 số
    const phoneRegex = /^0\d{10}$/;

    if (phoneRegex.test(newSDT)) {
      setThongTinDongHang((prev) => ({
        ...prev,
        sdt: newSDT,
      }));
    } else {
      toast.warning("Số điện thoại phải bắt đầu bằng 0 và có đúng 13 số.");
    }
  };

  const fetchHoaDonPhuongThuc = async () => {
    if (!billToday[selectedTab]?.id) {
      return;
    }
    try {
      const response = await HoaDonPhuongThucThanhToan.getList(
        billToday[selectedTab]?.id
      );
      setHDPTTT(response);
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu hóa đơn phương thức thanh toán", error);
    }
  };

  const handleToggle = () => {
    setIsChecked((prevState) => {
      // Khi người dùng click, đảo ngược giá trị của isChecked
      return !prevState;
    });
  };

  const updateLoaiDon = async (isChecked) => {
    if (isChecked) {
      // Gọi API cập nhật loại đơn online
      if (!billToday[selectedTab]?.id) {
        return;
      } else {
        try {
          await HoaDonService.UpdateLoaiDonOnline(billToday[selectedTab]?.id);
          // console.log("đổi thành công");
        } catch (err) {
          console.log("Khong thể đổi loại đơn hàng", err);
        }
      }
    } else {
      if (!billToday[selectedTab]?.id) {
        return;
      } else {
        try {
          await HoaDonService.UpdateLoaiDonOffline(billToday[selectedTab]?.id);
          // console.log("đổi thành công");
        } catch (err) {
          console.log("Khong thể đổi loại đơn hàng", err);
        }
      }
    }
  };

  const fetchServiceIdDistrict = async () => {
    if (!districtID) {
      return;
    }
    try {
      const response = await api_giaoHangNhanh.getServiceId(Number(districtID));
      setServiceId(response.data[0]?.service_id);
    } catch (error) {
      console.log("Không thể lấy id Service. vui long thử lại");
    }
  };
  useEffect(() => {
    fetchServiceIdDistrict();
  }, [districtID]);
  //Lấy service id giao hàng nhanh
  const fetchFee = async () => {
    if (!serviceId || !districtID) {
      return;
    }
    try {
      const response = await api_giaoHangNhanh.getFeeGHN(
        serviceId,
        Number(districtID),
        wardCOde.toString()
      );
      setFee(response.data.service_fee);
    } catch (error) {
      console.log("Không thể tính được phí ship.", error);
    }
  };

  useEffect(() => {
    fetchFee();
  }, [ward]);

  // console.log(fee);
  //Goi API tính phí ship
  useEffect(() => {
    if (billToday[selectedTab]?.loaiDon === 0) {
      setIsChecked(true);
    }
  }, [billToday[selectedTab]]);

  useEffect(() => {
    updateLoaiDon(isChecked);
  }, [isChecked]);

  //Goi API province
  const fetchAPIProvince = async () => {
    try {
      const response = await api_giaoHangNhanh.getProvince();
      setProvince(response);
    } catch (error) {
      console.log("Không thể lấy được dữ liệu province", error);
    }
  };
  //Gọi API district
  const fetchAPIDistrict = async () => {
    if (!provinceID) {
      return;
    }
    try {
      const response = await api_giaoHangNhanh.getDistrict(provinceID);
      setDistrict(response);
    } catch (error) {
      console.log("Không thể lấy được dữ liệu district", error);
    }
  };
  //Gọi API ward
  const fetchAPIWard = async () => {
    if (typeof districtID === "undefined") {
      return;
    }
    try {
      const response = await api_giaoHangNhanh.getWard(districtID);
      setWard(response);
    } catch (error) {
      console.log("Không thể lấy được dữ liệu ward", error);
    }
  };

  useEffect(() => {
    fetchHoaDonPhuongThuc();
  }, [billToday[selectedTab]?.id]);

  useEffect(() => {
    fetchAPIProvince();
  }, []);

  useEffect(() => {
    fetchAPIDistrict();
  }, [provinceID]);

  useEffect(() => {
    fetchAPIWard();
  }, [districtID]);

  const tongTien = billToday[selectedTab]?.tongTien;
  const discountAmount =
    phieuGiamGiaTN?.hinhThucGiamGia === 1
      ? phieuGiamGiaTN?.giaTriGiam
      : Math.min(
          (billToday[selectedTab]?.tongTien * phieuGiamGiaTN?.giaTriGiam) / 100,
          phieuGiamGiaTN?.soTienGiamToiDa
        );

  const soTienDaThanhToan = HDPTTT.reduce(
    (tong, item) => tong + item.soTienThanhToan,
    0
  );

  const khachPhaiThanhToan =
    tongTien - discountAmount + Math.round(fee / 500) * 500;

  const soTienConLai =
    (!khachPhaiThanhToan ? 0 : khachPhaiThanhToan) - soTienDaThanhToan;
  const soTienHoi = () => {
    if (soTienConLai >= 0) {
      return (
        <div className="flex justify-between mb-2">
          <h1 className="text-red-600">Tiền thiếu:</h1>
          <h1 className="text-red-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(soTienConLai || 0)}
          </h1>
        </div>
      );
    } else {
      return (
        <div className="flex justify-between mb-2">
          <h1 className="text-green-500">Tiền dư:</h1>
          <h1 className="text-green-500">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Math.abs(soTienConLai) || 0)}
          </h1>
        </div>
      );
    }
  };

  const radioGiaoHang = () => {
    if (billToday[selectedTab]?.tenKhachHang === null) {
      return null;
    } else {
      return (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-orange-500">Giao hàng:</h1>
            <div className="flex items-center mr-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleToggle}
                className="toggle border-white bg-white [--tglbg:gray] hover:bg-white checked:[--tglbg:green]"
                defaultChecked
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <h1 className="text-orange-500">Phí ship</h1>
            <h1 className="text-orange-500">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Math.round(fee / 500) * 500)}
            </h1>
          </div>
        </>
      );
    }
  };

  const adress = () => {
    if (!isChecked) {
      return <div className=""></div>;
    }
    if (isChecked && billToday[selectedTab]?.tenKhachHang !== null) {
      return (
        <div className="w-full p-4">
          <div className="flex flex-1">
            <div className="w-full"></div>
            <h1 className="flex items-center w-1/3">
              <MdPlace /> Chọn địa chỉ
            </h1>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="row w-1/2">
              <label htmlFor="name" className="flex">
                <p className="text-red-500 text-lg">*</p>
                <h1>Họ và Tên</h1>
              </label>

              <input
                id="name"
                onBlur={(e) => handleHoTenNguoiNhan(e)}
                type="text"
                defaultValue={billToday[selectedTab]?.tenKhachHang}
                placeholder="Họ và Tên"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="row w-1/2">
              <label htmlFor="sdt" className="flex">
                <p className="text-red-500 text-lg">*</p>
                <h1>Số điện thoại</h1>
              </label>
              <input
                id="sdt"
                onBlur={(e) => handleSDT(e)}
                defaultValue={billToday[selectedTab]?.soDienThoai}
                type="text"
                placeholder="Số điện thoại"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <div className="w-1/3">
              <label htmlFor="tp" className="flex">
                <p className="text-red-500 text-lg">*</p>
                <h1>Tỉnh / Thành Phố</h1>
              </label>
              <select
                id="tp"
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setProvinceID(e.target.value)}
                value={provinceID}
              >
                <option disabled>Tỉnh / Thành Phố</option>
                {province.map((prov) => (
                  <option key={prov.ProvinceID} value={prov.ProvinceID}>
                    {prov.ProvinceName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3">
              <label htmlFor="huyen" className="flex">
                <p className="text-red-500 text-lg">*</p>
                <h1>Huyện / Quận</h1>
              </label>
              <select
                id="huyen"
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setDistrictID(e.target.value)}
                value={districtID}
              >
                <option disabled>Huyện / Quận</option>
                {district.map((dis) => (
                  <option key={dis.DistrictID} value={dis.DistrictID}>
                    {dis.DistrictName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3">
              <label htmlFor="xa" className="flex">
                <p className="text-red-500 text-lg">*</p>
                <h1>Xã / Phường</h1>
              </label>
              <select
                id="xa"
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setWardCode(e.target.value)}
                value={wardCOde}
              >
                <option disabled>Xã / Phường</option>
                {ward.map((w) => (
                  <option key={w.WardCode} value={w.WardCode}>
                    {w.WardName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="place" className="flex">
              <p className="text-red-500 text-lg">*</p>
              <h1>Địa chỉ cụ thể</h1>
            </label>
            <input
              id="place"
              value={diaChiCuThe}
              onChange={(e) => setDiaChiCuThe(e.target.value)}
              type="text"
              placeholder="Địa chỉ cụ thể"
              className="input input-bordered w-[400px]"
            />
          </div>
        </div>
      );
    }
  };
  const reComment = () => {
    if (billToday[selectedTab]?.idPhieuGiamGia == null) {
      return null;
    } else {
      return (
        <>
          <div className=" flex justify-between bg-orange-400 text-white items-center border border-gray-300 shadow p-2 my-2 rounded-md ">
            <p>
              Áp dụng thành công phiếu giảm giá{" "}
              <strong>{phieuGiamGiaTN?.tenPhieuGiamGia}</strong> <br />
              giảm {phieuGiamGiaTN?.giaTriGiam}
              {phieuGiamGiaTN?.hinhThucGiamGia === 0 ? "%" : "đ"} đơn tối thiểu{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(phieuGiamGiaTN?.soTienToiThieuHd)}
            </p>
          </div>
        </>
      );
    }
  };

  const handleHoaTatHoaDon = () => {
    if (sanPhamGioHang.length <= 0) {
      toast.warn("Giỏ hàng trống !");
      return;
    }
    if (soTienConLai > 0) {
      toast.warning("Vui lòng thanh toán số tiền còn lại");
      return;
    }
    isOpenConfirm(true);
  };

  const validateGioHang = () => {
    if (sanPhamGioHang.length <= 0) {
      toast.warn("Chưa có sản phẩm nào trong giỏ hàng !");
      return;
    }
    setIsTotal(true);
  };

  // console.log(soTienConLai);
  //Check sản phẩm khi thanh toán
  const btnAccetpHD = () => {
    if (isChecked) {
      return (
        <button
          onClick={() => isOpenConfirm(true)}
          className="btn w-full mb-4 bg-orange-500 hover:bg-orange-600 text-white"
        >
          Xác nhân đơn hàng
        </button>
      );
    } else {
      return (
        <button
          onClick={() => handleHoaTatHoaDon()}
          className="btn w-full mb-4 bg-orange-500 hover:bg-orange-600 text-white"
        >
          Hoàn tất hóa đơn
        </button>
      );
    }
  };

  return (
    <>
      <div className="w-full bg-white rounde-md mt-4 border-opacity-50">
        <h1 className="text-orange-500 font-bold text-lg p-4">
          Thông tin thanh toán
        </h1>
        <hr />
        <div className="flex flex-1">
          {/* đây là bên trái */}
          <div className="w-full p-4">{adress()}</div>
          {/* đây là bên phải */}
          <div className="w-3/5 p-2 mb-4">
            <div className=" flex items-center border border-gray-300 shadow p-4 my-2 rounded-md ">
              <h1 className="text-2xl text-orange-500 ">
                <BiPurchaseTagAlt />
              </h1>
              <h1>Mã giảm giá :</h1>
              <input
                type="text"
                value={phieuGiamGiaTN?.maPhieuGiamGia || ""}
                placeholder=""
                className="input input-bordered mx-2 w-[170px]"
                disabled
              />
              <button onClick={() => setPGG(true)} className="btn">
                Chọn mã
              </button>
            </div>
            <div className="flex justify-between py-2">
              <h1 className="text-orange-500">Tiền hàng</h1>
              <h1 className="text-orange-500">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(tongTien || 0)}
              </h1>
            </div>
            <div className="flex justify-between py-2">
              <h1 className="text-orange-500">Giảm giá</h1>
              <h1 className="text-orange-500">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(discountAmount || 0)}
              </h1>
            </div>
            {reComment()}
            {radioGiaoHang()}
            <div className="flex justify-between py-2">
              <h1 className="text-orange-500">Khách đã thanh toán:</h1>
              <h1 className="text-orange-500">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(soTienDaThanhToan)}
              </h1>
            </div>
            <div className="flex justify-between items-center py-2">
              <h1 className="text-orange-500">Khách thanh toán</h1>
              <button onClick={() => validateGioHang()} className="btn">
                <AiFillCreditCard />
              </button>
              <h1 className="text-orange-500">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(khachPhaiThanhToan || 0)}
              </h1>
            </div>
            {soTienHoi()}
            {btnAccetpHD()}
          </div>
        </div>
      </div>
      {isTotal && (
        <TotalModal
          isClose={() => setIsTotal(false)}
          idHD={billToday[selectedTab]?.id}
          khachPhaiThanhToan={soTienConLai > 0 ? soTienConLai : 0}
          fetchHoaDonPhuongThuc={fetchHoaDonPhuongThuc}
          HDPTTT={HDPTTT}
        />
      )}
      {isPGG && (
        <ListPhieuGiamGia
          pggPublic={pggs}
          pggkh={pggkh}
          isClose={() => setPGG(false)}
          billToday={billToday}
          selectedTab={selectedTab}
        />
      )}
    </>
  );
}
