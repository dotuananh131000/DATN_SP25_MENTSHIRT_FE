import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import Voucher from "./service/Voucher";
import api_giaoHangNhanh from "../../counterSales/services/GiaoHangNhanhService";
import Order from "./service/hoaDonOnline";
import { useSelector } from "react-redux";
import HoaDonOnline from "../order/services/HoaDonService";
import Address from "@/services/AdressSerrvice";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Cookies from "js-cookie";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const client = useSelector((state) => state.authClient?.client);

  // Retrieve the checkout state passed from the Cart page
  const { items, totalAmount, totalItems } = location.state || {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  };

  // State cho form thanh toán
  const [formData, setFormData] = useState({
    fullName: !client ?"":client.tenKhachHang,
    phone: !client ?"":client.soDienThoai,
    email:  !client ?"":client.email,
    note: "",
    diaChi: "" ,
  });


  //Hàm lấy địa chỉ khi khách hàng đăng nhập
  const [addressDefault, setAddressDefault] = useState({});
  useEffect(() => {
    const fetchDiaChi = async () => {
      try {
        const response = await Address.DefaultAdress(client.id);
        setAddressDefault(response.data);
      }catch (err) {
        console.log("Không thể lấy địa chỉ mặc định của khách hàng")
      }
    }
    fetchDiaChi();
  },[])

  // Hàm lấy danh sách địa chỉ của khách hàng
  const [addressList, setAddressList] = useState([]);
  const fetchListDiaChi = async () => {
    try {
      const response = await Address.getListByKH(client.id);
      setAddressList(response.data);
    }catch (err) {
      console.log("Không thể lấy danh sách địa chỉ khách hàng", err);
    }
  }

  //Hàm sử lý khi khách hàng thay đổi địa chỉ
  const handleChangAddress = (item) => {
    setAddressDefault(item);
  }

  //Hàm điều hướng để thêm địa chỉ mới
  const navigateAddAddress = () => {
    navigate("/profile")
  }

  /// * phần xử lys voucher
  const [listVoucher, setListVoucher] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState({});

  //Lấy ra danh sách voucher
  useEffect(() => {
    const fetchListVoucher =async ()=>{
      try {
        const response = await Voucher.lisVoucher(client.id);
        setListVoucher(response);
      }catch (error){
        console.log("Không thể lấy được danh sách voucher");
      }
    }
    fetchListVoucher();
  },[])

  console.log(listVoucher)

  const handleGetVoucher = (voucher) =>{
    if(!voucher){
      setSelectedVoucher({})
      return;
    }
    setSelectedVoucher(voucher);

  }

  // Phí vận chuyển cố định (có thể thay đổi thành tính toán động)
  
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // * Xử lý phần địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [provinceID, setProvinceID] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtID, setDistrictID] = useState("");
  const [ward, setWard] = useState([]);
  const [wardID, setWardID] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [specific, setSpecific] = useState("");
  const [serviceID, setServiceID] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  //phần tỉnh
 
  useEffect(() => {
    const fetchProvince = async() => {
      try {
        const response = await api_giaoHangNhanh.getProvince();
        setProvinces(response);
      } catch (error) {
        console.log("Lỗi khi gọi API Tỉnh");
      }
    }
    fetchProvince();
  },[])

  //Phần huyện
  useEffect(() => {
    const fetchDistrict = async() => {
      if(!provinceID) return;
      try {
        const response = await api_giaoHangNhanh.getDistrict(Number(provinceID));
        setDistricts(response);
      } catch (error) {
        console.log("Lỗi khi gọi API huyện")
      }
    }
    fetchDistrict();
  },[provinceID])
 
   //Phần xã
   useEffect(() => {
    const fetchWard = async() => {
      if(!districtID) return;
      try {
        const response = await api_giaoHangNhanh.getWard(Number(districtID));
        setWard(response);
      } catch (error) {
        console.log("Lỗi khi gọi API xã", error)
      }
    }
    fetchWard();
  },[districtID])

  //Gọi API service để tính phí ship
  useEffect(() => {
    const fetchService = async () => {
      try {
        if(client) {
          if(Object.keys(addressDefault).length > 0) {
            const response = await api_giaoHangNhanh.getServiceId(Number(addressDefault.quanHuyenId))
            setServiceID(response.data[0].service_id)
          }
        }else {
          if(!districtID) return;

          const response = await api_giaoHangNhanh.getServiceId(Number(districtID));
          setServiceID(response.data[0].service_id)
        }
      }catch (error){
        console.log("Lỗi khi gọi API service", error);
      }
    }
    fetchService();
  },[districtID, addressDefault])
  
  const fetchShippingFee = async() => {
    try{
      if(client){
        if(Object.keys(addressDefault).length > 0){
          const response =
          await api_giaoHangNhanh.getFeeGHN(Number(serviceID), Number(addressDefault.quanHuyenId), String(addressDefault.phuongXaId));
          setShippingFee(response.data.service_fee);
        }
      }else {
        const response = await api_giaoHangNhanh.getFeeGHN(Number(serviceID), Number(districtID), wardID);
        setShippingFee(response.data.service_fee);
      }
    } catch (error) {
      console.log("Lỗi khi gọi API tính phí ship", error);
    }
  }

  //Xử lý khi tỉnh thay đổi
  useEffect(() => {
    setDistrictID("");
    setWard([]);
    setWardID("");
    setShippingFee(0);
    setServiceID("");
    setDistrictName("");
    setWardName("");
  },[provinceID])

  //Xủa lý khi thay đổi huyện
  useEffect(() => {
    setWardID("")
    setWardName("")
  },[districts,districtID])

  //Hàm lấy địa chỉ để đưa vào hóa đơn
  useEffect(()=>{
    if(provinceID){
      const selectProvince = provinces.find(prov => prov.ProvinceID === Number(provinceID));
      if(selectProvince){
        setProvinceName(selectProvince.ProvinceName);
        if(districtID){
          const selectDistrict = districts.find(dis => dis.DistrictID === Number(districtID));
          if(selectDistrict){
            setDistrictName(selectDistrict.DistrictName)
            if(wardID){
              const selectWard = ward.find(ward => ward.WardCode === wardID );
              if(selectWard){
                setWardName(selectWard.WardName);
              }
            }
          }
        }
      }
    }
  },[provinceID, districtID, districts, ward, wardID])

  //Hàm lấy địa chỉ và tính phí ship
  useEffect(() => {
   if(provinceName && districtName && wardName && specific){
    if(!client){
      setFormData((prev) => ({
        ...prev,
        diaChi : `${specific}, ${wardName}, ${districtName}, ${provinceName}.`
      }))
      fetchShippingFee();
    }
   }else {
    if(Object.keys(addressDefault).length === 0){
      setFormData((prev) => ({
        ...prev,
        diaChi : ""
      }))
    }else{
      setFormData((prev) => ({
        ...prev,
        diaChi : `${addressDefault.diaChiChiTiet}, ${addressDefault.phuongXa}, ${addressDefault.quanHuyen}, ${addressDefault.tinhThanh}`
      }))
      fetchShippingFee();
    }
   }
  },[districts, districtID, ward, wardID, specific, wardName, addressDefault, serviceID]);


  // Tính toán tổng tiền sau khi áp dụng voucher
  const caculatorDiscount = (voucher, totalAmount) => {
    if(!voucher) return 0;

    if(voucher.hinhThucGiamGia === 1){
      //Giảm theo số tiền
      return Math.min(voucher.giaTriGiam, voucher.soTienGiamToiDa);
    } else if (voucher.hinhThucGiamGia === 0){
      //Giảm theo phần trăm
      const discountAmount = (totalAmount * voucher.giaTriGiam) / 100;
      return Math.min(discountAmount, voucher.soTienGiamToiDa);
    }

    return 0;
  }
  const voucherDiscount = caculatorDiscount(selectedVoucher, totalAmount);
  const finalTotal = totalAmount + shippingFee - voucherDiscount ;

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //Hàm xóa sản phẩm ra khỏi giỏ hàng khi đặt hàng thành công
   const [cartItems, setCartItems] = useState([]);
   useEffect(() => {
      // Retrieve cart data from the cookie
      const cartData = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
      setCartItems(cartData);
    }, []);

    const removeOrderedItemsFromCart = () => {
      //Tạo Set chứa khóa duy nhât cho sản phẩm
      const orderedSet = new Set(
        items.map(
         (item) => `${item.detailId}`
        )
      );
      //Lọc lại giỏ hàng
      const updatedCart = cartItems.filter((itemsInCart) => {
        const key = `${itemsInCart.detailId}`;
        return !orderedSet.has(key);
      });
      console.log("Đây là giỏ hang khi update",updatedCart);
      setCartItems(updatedCart);
      Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
    }

  
  // Xử lý submit form
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    const orderData = {
      ghiChu: formData.note || "",
      idKhachHang: client?.id || "",
      idPhieuGiamGia: selectedVoucher ? selectedVoucher.id : null ,
      hoTenNguoiNhan: formData.fullName || "",
      soDienThoai: formData.phone || "",
      email: formData.email || "",
      diaChiNhanHang: formData.diaChi || "",
      phuongThucThanhToan: paymentMethod === "cod" ? 3 : 4,
      phiShip: shippingFee || "",
      danhSachChiTiet: items.map((item) => ({
        sanPhamChiTietId: item.detailId,
        soLuong: item.quantity,
      }))
    };

    try{
      const response = await Order.createOrder(orderData);
      const orderResponse = response;

      removeOrderedItemsFromCart();

      if(orderResponse?.id){
        toast.success("Đặt hàng thành công!");

        //Diều hướng nếu chọn thanh toán VNPay
        if(orderData.phuongThucThanhToan === 4){

          console.log("Đang xử lý VNPay");

          const paymentUrl = await Order.createPaymentUrl(orderResponse.maHoaDon);
          window.location.href = paymentUrl;

        }else{
          setTimeout(() => navigate("/"), 1500);
        }
      }else{
        toast.error("Đặt hàng thất bại, vui lòng thử lại.");
      }

    }catch (error){
      console.log("Có lỗi khi đặt hàng", error);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg mx-auto max-w-3xl mt-10">
        <h2 className="text-2xl font-bold text-gray-900">Không có sản phẩm nào để thanh toán</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-orange-600 text-white font-medium rounded-md shadow-md hover:bg-orange-700 transition-colors"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <ToastContainer />
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột bên trái - Thông tin khách hàng và phương thức thanh toán */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin khách hàng */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                Thông tin khách hàng
              </h2>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                Địa chỉ giao hàng
              </h2>
               {/* Địa chỉ giao hàng */}
              {!client && (
                <>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="">
                          <label htmlFor="tinh" className="flex">
                            <p className="text-red-500 text-lg">*</p>
                            <h1 className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</h1>
                          </label>
                          <select
                          id="tinh"
                          className="select select-bordered w-full max-w-xs"
                          onChange={(e) => setProvinceID(e.target.value)}
                          value={provinceID}
                          >
                            <option defaultChecked>Tỉnh / Thành phố</option>
                            {provinces.map((pro) => (
                              <option key={pro.ProvinceID} value={pro.ProvinceID}>
                              {pro.ProvinceName}
                            </option>
                            ))}
                          </select>
                        </div>

                        <div className="">
                          <label htmlFor="huyen" className="flex">
                            <p className="text-red-500 text-lg">*</p>
                            <h1 className="block text-sm font-medium text-gray-700 mb-1">Huyện / Quận</h1>
                          </label>
                          <select
                          id="huyen"
                          className="select select-bordered w-full max-w-xs"
                          onChange={(e) => setDistrictID(e.target.value)}
                          value={districtID}
                          >
                            <option defaultChecked>Huyện / Quận</option>
                            {districts.map((dis) => (
                              <option key={dis.DistrictID} value={dis.DistrictID}>
                              {dis.DistrictName}
                            </option>
                            ))}
                          </select>
                        </div>

                        <div className="">
                          <label htmlFor="xa" className="flex">
                            <p className="text-red-500 text-lg">*</p>
                            <h1 className="block text-sm font-medium text-gray-700 mb-1">Xã / Phường</h1>
                          </label>
                          <select
                          id="xa"
                          className="select select-bordered w-full max-w-xs"
                          onChange={(e) => setWardID(e.target.value)}
                          value={wardID}
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
                    <div className="my-4">
                      <label htmlFor="place" className="flex">
                        <p className="text-red-500 text-lg">*</p>
                        <h1 className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</h1>
                      </label>
                      <input
                        id="place"
                        value={specific}
                        onChange={(e) => setSpecific(e.target.value)}
                        type="text"
                        placeholder="Địa chỉ cụ thể"
                        className="input input-bordered w-[400px]"
                      />
                </div>
                </>
              )}

              {client && (
                <div className="flex justify-between space-x-2 items-center">
                  <input type="text"
                  value={formData.diaChi}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                      onClick={fetchListDiaChi}
                      className="bg-orange-600 px-3 py-1.5 text-white rounded-lg">Khác</button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                      <div>
                        {addressList.map((item) => (
                          <div key={item.id}>
                            <p
                            onClick={() => handleChangAddress(item)}
                            className={`${item.id === addressDefault.id ? "bg-gray-200":""} 
                            p-2 rounded-lg cursor-pointer active:scale-95 duration-200`}
                            key={item.id}>{item.diaChiChiTiet}, {item.phuongXa}, {item.quanHuyen}, {item.tinhThanh}</p>
                            <hr className="border border-gray-200 my-2" />
                          </div>
                        ))}
                      </div>
                        <Dialog>
                          <DialogTrigger asChild>
                          <button
                          onClick={navigateAddAddress}
                          className="text-gray-400">Thêm đia chỉ mới...</button>
                          </DialogTrigger>
                         
                        </Dialog>
                    
                    </PopoverContent>
                  </Popover>
                </div>
                
              )}
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                />
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900 block">Thanh toán khi nhận hàng (COD)</span>
                    <span className="text-sm text-gray-500">Bạn chỉ phải thanh toán khi nhận được hàng</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="banking"
                    checked={paymentMethod === "banking"}
                    onChange={() => setPaymentMethod("banking")}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900 block">Chuyển khoản ngân hàng</span>
                    <span className="text-sm text-gray-500">Thông tin tài khoản sẽ được gửi sau khi đặt hàng</span>
                  </div>
                </label>
                
                {/* <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900 block">Ví MoMo</span>
                    <span className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</span>
                  </div>
                </label> */}
              </div>
            </div>
          </div>

          {/* Cột bên phải - Thông tin đơn hàng và thanh toán */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>
              
              {/* Danh sách sản phẩm */}
              <div className="max-h-60 overflow-y-auto mb-4 pr-2">
                <div className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <div key={index} className="py-3 flex items-start">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{item.productName}</h3>
                        <div className="flex flex-wrap mt-1">
                          {Object.entries(item.cartAttributes).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 mr-1 mb-1"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mã giảm giá */}
              <label htmlFor="" className="text-sm">Phiếu giảm giá</label>
              <div className="flex space-x-2 mb-4">
                    <input type="text" value={selectedVoucher?.maPhieuGiamGia|| ""} className="input" disabled />
                    <button className="btn"   onClick={()=>document.getElementById('my_modal_2').showModal()}>Khác</button>
              </div>
              <dialog id="my_modal_2" className="modal">
                  <div className="modal-box w-1/2 h-full max-w-none relative">
                      <h1 className="text-center mb-4 text-lg">Phiếu giảm giá</h1>
                      <button className="absolute top-3 right-3 px-4 py-2 text-white bg-orange-400 rounded-lg 
                      hover:scale-105 duration-200"
                      onClick={() => handleGetVoucher()}>
                        Không áp dụng phiếu giảm gía
                      </button>
                      <table className="table">
                        <thead className="table-header-group">
                          <tr >
                            <th className="px-4 py-3 text-center">Mã phiếu</th>
                            <th className="px-4 py-3 text-center">Tên</th>
                            <th className="px-4 py-3 text-center">Chi tiết</th>
                            <th className="px-4 py-3 text-center">Chọn</th>
                          </tr>
                        </thead>
                        <tbody className="table-row-group">
                          {listVoucher.map((voucher) => (
                            <tr className={`${voucher?.id === selectedVoucher?.id ?"text-red-600 font-bold":""}`} 
                            key={voucher.id || ""}>
                              <td className="px-4 py-3 text-center">{voucher?.maPhieuGiamGia || ""}</td>
                              <td className="px-4 py-3 text-center">{voucher?.tenPhieuGiamGia || ""}</td>
                              <td className="px-4 py-3 text-center">
                                {`Giảm ${voucher?.hinhThucGiamGia ===1 
                                          ?`${voucher?.giaTriGiam} đ`
                                          :`${voucher?.giaTriGiam} %`
                                        }
                                  Với đơn hàng tối thiếu ${voucher?.soTienToiThieuHd} đ
                                  và tối đa ${voucher?.soTienGiamToiDa} đ
                                `}
                              </td>
                              {(totalAmount >= voucher.soTienToiThieuHd) &&
                              (<td>
                                <button className="px-4 py-2 bg-gray-300 rounded-lg hover:scale-105 duration-150"
                                onClick={() => handleGetVoucher(voucher)}
                                >
                                  chọn
                                </button>
                              </td>)
                              }
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                          {/* if there is a button in form, it will close the modal */}
                          <button>✕</button>
                  </form>
              </dialog>
              
              {/* Tính toán chi phí */}
              <div className="space-y-2 py-3 border-t border-b">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tạm tính ({totalItems} sản phẩm):</span>
                  <span className="text-sm font-medium">{totalAmount.toLocaleString()}đ</span>
                </div>
                <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Phí vận chuyển:</span>
                    <img src="/public/imagesGHN.jpg" 
                    className="w-9 h-9 object-cover rounded-lg"
                    alt="" />
                 </div>
                  <span className="text-sm font-medium">{shippingFee.toLocaleString()}đ</span>
                </div>
                {selectedVoucher && voucherDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Giảm giá ({selectedVoucher.hinhThucGiamGia ===1
                                                        ?`${selectedVoucher.giaTriGiam.toLocaleString()} đ`
                                                        :`${selectedVoucher.giaTriGiam.toLocaleString()} %`}):</span>
                    <span className="text-sm font-medium">-{voucherDiscount.toLocaleString()}đ</span>
                  </div>
                )}
              </div>
              
              {/* Tổng thanh toán */}
              <div className="flex justify-between items-center py-3">
                <span className="text-base font-medium text-gray-900">Tổng thanh toán:</span>
                <span className="text-xl font-bold text-orange-600">{finalTotal.toLocaleString()}đ</span>
              </div>

              {/* Nút đặt hàng */}
              <button
                onClick={handleSubmit}
                disabled={!formData.fullName || !formData.phone || !formData.diaChi}
                className={`w-full py-3 px-4 rounded-md text-white text-base font-medium shadow-md 
                  ${(!formData.fullName || !formData.phone || !formData.email) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700 transition-colors'}`}
              >
                Đặt hàng ngay
              </button>
              
              {/* Điều khoản */}
              <p className="text-xs text-gray-500 mt-3 text-center">
                Bằng cách đặt hàng, bạn đồng ý với các 
                <a href="#" className="text-orange-600 hover:underline"> điều khoản </a> 
                và 
                <a href="#" className="text-orange-600 hover:underline"> chính sách </a> 
                của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;