import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the checkout state passed from the Cart page
  const { items, totalAmount, totalItems } = location.state || {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  };

  // State cho form thanh toán
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    note: ""
  });

  // Phí vận chuyển cố định (có thể thay đổi thành tính toán động)
  const shippingFee = 30000;
  
  // Danh sách voucher mẫu
  const voucherOptions = [
    { value: "NONE", label: "Không sử dụng voucher", discount: 0 },
    { value: "WELCOME10", label: "WELCOME10 - Giảm 10% tối đa 50K", discount: Math.min(totalAmount * 0.1, 50000) },
    { value: "FREESHIP", label: "FREESHIP - Miễn phí vận chuyển", discount: shippingFee },
    { value: "SALE100K", label: "SALE100K - Giảm 100K cho đơn từ 1 triệu", discount: totalAmount >= 1000000 ? 100000 : 0 }
  ];

  // Danh sách địa chỉ mẫu
  const addressOptions = [
    { value: "home", label: "Nhà riêng - 123 Nguyễn Văn Linh, Q.7, TP.HCM" },
    { value: "office", label: "Văn phòng - 456 Lê Lợi, Q.1, TP.HCM" },
    { value: "other", label: "Địa chỉ khác" }
  ];

  // State cho voucher và địa chỉ đã chọn
  const [selectedVoucher, setSelectedVoucher] = useState(voucherOptions[0]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [customAddress, setCustomAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Tính toán tổng tiền sau khi áp dụng voucher
  const voucherDiscount = selectedVoucher ? selectedVoucher.discount : 0;
  const finalTotal = totalAmount + shippingFee - voucherDiscount;

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
    setTimeout(() => {
      navigate("/");
    }, 3000);
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

            {/* Địa chỉ giao hàng */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                Địa chỉ giao hàng
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn địa chỉ <span className="text-red-500">*</span></label>
                <Select
                  options={addressOptions}
                  value={selectedAddress}
                  onChange={(option) => setSelectedAddress(option)}
                  placeholder="Chọn địa chỉ giao hàng"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isClearable
                />
              </div>
              
              {(!selectedAddress || selectedAddress.value === "other") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Nhập địa chỉ giao hàng chi tiết"
                    required
                  />
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
                
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
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
                </label>
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã giảm giá</label>
                <Select
                  options={voucherOptions}
                  value={selectedVoucher}
                  onChange={(option) => setSelectedVoucher(option)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              
              {/* Tính toán chi phí */}
              <div className="space-y-2 py-3 border-t border-b">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tạm tính ({totalItems} sản phẩm):</span>
                  <span className="text-sm font-medium">{totalAmount.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phí vận chuyển:</span>
                  <span className="text-sm font-medium">{shippingFee.toLocaleString()}đ</span>
                </div>
                {selectedVoucher && selectedVoucher.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Giảm giá ({selectedVoucher.value}):</span>
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
                disabled={!formData.fullName || !formData.phone || (!selectedAddress && !customAddress)}
                className={`w-full py-3 px-4 rounded-md text-white text-base font-medium shadow-md 
                  ${(!formData.fullName || !formData.phone || (!selectedAddress && !customAddress)) 
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