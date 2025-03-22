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
  thongTinDonHang,
  setThongTinDongHang,
}) {
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [provinceID, setProvinceID] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [districtID, setDistrictID] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardCOde, setWardCode] = useState("");
  const [wardName, setWardName] = useState("");
  const [isTotal, setIsTotal] = useState(false);
  const [isPGG, setPGG] = useState(false);
  const [serviceId, setServiceId] = useState(0);
  const [fee, setFee] = useState(0);
  const [HDPTTT, setHDPTTT] = useState([]);
  const [diaChiKH, setDiaChiKH] = useState({});
  const [diaChiCuThe, setDiaChiCuThe] = useState("");
  // console.log(diaChiKH[0]?.diaChiChiTiet);
  
  //Hàm lấy địa chỉ để đưa vào hóa đơn
  useEffect(()=>{
    if(provinceID){
      const selectProvince = province.find(prov => prov.ProvinceID === Number(provinceID));
      if(selectProvince){
        setProvinceName(selectProvince.ProvinceName);
        if(districtID){
          const selectDistrict = district.find(dis => dis.DistrictID === Number(districtID));
          if(selectDistrict){
            setDistrictName(selectDistrict.DistrictName)
            if(wardCOde){
              const selectWard = ward.find(ward => ward.WardCode === wardCOde );
              if(selectWard){
                setWardName(selectWard.WardName);
              }
            }
          }
        }
      }
    }
  },[provinceID, province, districtID, districtName, district, ward, wardCOde])
  // console.log(provinceName)
  // console.log(districtName)
  // console.log(wardName)

  // console.log(thongTinDonHang);
  const handleHoTenNguoiNhan = (e) => {
    const newThongTinNguoiNhan = e.target.value;
      setThongTinDongHang((prev) => ({
        ...prev,
        hoTenNguoiNhan: newThongTinNguoiNhan,
      }));
  };

  const handleSDT = (e) => {
    const newSDT = e.target.value;

      setThongTinDongHang((prev) => ({
        ...prev,
        sdt: newSDT,
      }));
  };

  const handleEmail = (e) => {
    const newEmail = e.target.value;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  
    setThongTinDongHang((prev) => ({
      ...prev,
      email: newEmail,
    }));
  
    // Validate ngay khi nhập
    if (!regex.test(newEmail)) {
      toast.error('Email không hợp lệ!');
      setThongTinDongHang((prev) => ({
        ...prev,
        email: "",
      }));
      return;
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
    try {
      const response = await api_giaoHangNhanh.getFeeGHN(
        serviceId,
        Number(districtID),
        wardCOde.toString()
      );
      console.log(response.data.service_fee)
      setFee(response.data.service_fee);
    } catch (error) {
      console.log("Không thể tính được phí ship.", error);
    }
  };

  //Goi API tính phí ship
  useEffect(() => {
    if (billToday[selectedTab]?.loaiDon === 0) {
      setIsChecked(true);
    }
  }, [billToday[selectedTab]]);

  useEffect(() => {
    updateLoaiDon(isChecked);
  }, [isChecked]);
  console.log(isChecked)

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
   if(!hdHienTai?.idKhachHang){
    setDistrictID(''); 
    setWardCode('');
    setDistrictName("");
    setWardName("");
    setDiaChiCuThe("");
   }
    setFee(0);
    setThongTinDongHang((prev)=>({...prev, phiShip:0, diaChiNhanHang:""}))
    setDistrict([]); 
    setWard([]); 
    fetchAPIDistrict();
  }, [provinceID]);

  useEffect(() => {
    if(districtID){
      if(!hdHienTai?.idKhachHang){
        setWardCode('');
        setWardName("");
      }
      setFee(0);
      fetchAPIWard();
    }
  }, [districtID]);
  useEffect(() => {
    setThongTinDongHang((pre) => ({
      ...pre,
      hoTenNguoiNhan: hdHienTai?.tenKhachHang || "",
      sdt: hdHienTai?.soDienThoai || "",
      email: hdHienTai?.email || ""
    }));
  }, [hdHienTai]);

  useEffect(()=>{
    if (diaChiCuThe && wardName && districtName && provinceName) {
      setThongTinDongHang((prev) => ({
        ...prev,
        diaChiNhanHang: `${diaChiCuThe}, ${wardName}, ${districtName}, ${provinceName}`,
      }));
      if(isChecked){
        fetchFee();
        setThongTinDongHang((pre) => ({
          ...pre,
          phiShip: Math.round(fee / 500) * 500,
        }));
      }else{
        setThongTinDongHang((pre) => ({
          ...pre,
          diaChiNhanHang:"",
          phiShip: 0,
        }));
      }
      
    }
  },[ provinceID, districtID, district, wardCOde, wardName, ward, diaChiCuThe, isChecked, fee])
  
  useEffect(() => {
    if(districtID && wardCOde){
      setThongTinDongHang((pre) => ({
        ...pre,
        phiShip: Math.round(fee / 500) * 500,
      }));
    }else{
      setThongTinDongHang((pre) => ({
        ...pre,
        phiShip: 0,
      }));
    }
  }, [fee]);
  console.log(thongTinDonHang);

  const fetchDiaChiKH = async (id) => {
    try {
      const response = await DiaChiKhacHangService.diaChi(id);
      const diaChi = response.data;
      console.log("Dữ liệu địa chỉ khách hàng:", diaChi);  // Kiểm tra dữ liệu
      if (diaChi && diaChi.length > 0) {
        setDiaChiKH(diaChi[0]);
  
        setProvinceID(diaChi[0]?.tinhThanhId);
        setDistrictID(diaChi[0]?.quanHuyenId);
        setWardCode(diaChi[0]?.phuongXaId);
        setDiaChiCuThe(diaChi[0]?.diaChiChiTiet);
        setProvinceName(diaChi[0]?.tinhThanh);
        setWardName(diaChi[0]?.phuongXa);
      }
    } catch (err) {
      console.log("Không thể lấy địa chỉ khách hàng", err);
    }
  };
  useEffect(() => {
    if (!hdHienTai?.idKhachHang) {
      return;
    }
    fetchDiaChiKH(hdHienTai?.idKhachHang);
  }, [hdHienTai?.idKhachHang]);

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
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <h1 className="text-orange-500">Phí ship</h1>
            <h1 className="text-orange-500">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(thongTinDonHang?.phiShip)}
            </h1>
          </div>
        </>
      );
  };

  const adress = () => {
    if (!isChecked) {
      // {setThongTinDongHang((pre)=>({...pre, phiShip: 0}))}
      return <div className=""></div>;
    }
    if (isChecked) {
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
                onChange={(e) => handleHoTenNguoiNhan(e)}
                type="text"
                value={thongTinDonHang.hoTenNguoiNhan}
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
                defaultValue={thongTinDonHang.sdt}
                type="text"
                placeholder="Số điện thoại"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="row w-full">
            <label htmlFor="sdt" className="flex">
                <p className="text-red-500 text-lg">*</p>
                <h1>Email</h1>
              </label>
              <input
                id="email"
                // onBlur={(e) => handleSDT(e)}
                defaultValue={thongTinDonHang.email}
                type="email"
                onBlur={(e)=>handleEmail(e)}
                placeholder="email"
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
                <option defaultChecked>Tỉnh / Thành Phố</option>
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
                <option defaultChecked>Huyện / Quận</option>
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
                <option defaultChecked>Xã / Phường</option>
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

  // console.log(hdHienTai?.id);
  const xacNhanHoaDon= ()=>{
    if(!wardName || !diaChiCuThe){
      toast.warn("Vui long nhập thông tin đầy đủ.")
      return
    }

    if(!thongTinDonHang.email){
      toast.error("Vui lòng nhập email.");
      return;
    }
    const phoneRegex = /^0\d{9}$/;
    // if (phoneRegex.test(newSDT)) {
    if(!phoneRegex.test(thongTinDonHang.sdt)){
      toast.warn("Không đúng định dạng số diện thoại.");
      return;
    }
    if (thongTinDonHang.hoTenNguoiNhan.length >= 50) {
      toast.warning("Tên người nhận quá dài. Vui lòng nhập lại");
      setThongTinDongHang((pre) => ({
        ...pre,
        hoTenNguoiNhan: "",
      }));
      return ;
    }
    if (/[0-9]/.test(thongTinDonHang.hoTenNguoiNhan)) {
      toast.warning("Tên người nhận không được chứa số.");
      setThongTinDongHang((pre) => ({
        ...pre,
        hoTenNguoiNhan: "",
      }));
      return;
    }
    if(!thongTinDonHang.hoTenNguoiNhan){
      toast.warn("Vui lòng nhập đầy đủ tin.");
      return;
    }
    if (soTienConLai > 0) {
      toast.warning("Vui lòng thanh toán số tiền còn lại");
      return;
    }
    isOpenConfirm(true);
  }

  // console.log(soTienConLai);
  //Check sản phẩm khi thanh toán
  const btnAccetpHD = () => {
    if (isChecked) {
      return (
        <button
          onClick={xacNhanHoaDon}
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
