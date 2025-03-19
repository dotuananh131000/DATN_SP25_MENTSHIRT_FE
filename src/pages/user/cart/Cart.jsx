import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve cart data from the cookie
    const cartData = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
    setCartItems(cartData);
  }, []);

  const handleRemoveItem = (sanPhamId, cartAttributes) => {
    // Remove item from cart
    const updatedCart = cartItems.filter(
      (item) =>
        item.sanPhamId !== sanPhamId ||
        JSON.stringify(item.cartAttributes) !== JSON.stringify(cartAttributes)
    );
    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 }); // Update cookie
  };

  const handleQuantityChange = (sanPhamId, cartAttributes, type) => {
    // Update quantity of an item
    const updatedCart = cartItems.map((item) => {
      if (
        item.sanPhamId === sanPhamId &&
        JSON.stringify(item.cartAttributes) === JSON.stringify(cartAttributes)
      ) {
        const newQuantity = type === "increment" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 }); // Update cookie
  };

  const formatAttributeName = (key) => {
    const attributeMap = {
      chatLieu: "Chất liệu",
      coAo: "Cổ áo",
      kichThuoc: "Kích thước",
      mauSac: "Màu sắc",
      tayAo: "Tay áo",
      thuongHieu: "Thương hiệu",
      xuatXu: "Xuất xứ",
    };
    return attributeMap[key] || key;
  };

  const proceedToPayment = () => {
    // Tính tổng tiền
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    
    // Truyền dữ liệu cần thiết sang trang thanh toán
    const checkoutState = {
      items: cartItems, 
      totalAmount: totalAmount,
      totalItems: cartItems.reduce((total, item) => total + item.quantity, 0)
    };
    
    console.log("Checkout State:", checkoutState); // Kiểm tra state trước khi navigate
    
    navigate("/pay", { state: checkoutState });
    
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg mx-auto max-w-3xl mt-10">
        <div className="text-center">
          <div className="mb-6 bg-orange-50 p-6 rounded-full inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">Hãy quay lại cửa hàng để chọn những sản phẩm yêu thích của bạn.</p>
          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Giỏ hàng của bạn
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Header */}
              <div className="hidden md:flex bg-gray-50 px-6 py-4 font-medium text-gray-600 border-b border-gray-200">
                <div className="w-2/5">Sản phẩm</div>
                <div className="w-1/5 text-center">Đơn giá</div>
                <div className="w-1/5 text-center">Số lượng</div>
                <div className="w-1/5 text-right">Thành tiền</div>
              </div>

              {/* Cart items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.sanPhamId}-${index}`}
                    className="px-6 py-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Product info */}
                      <div className="flex items-center w-full md:w-2/5 mb-4 md:mb-0">
                        <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h2 className="text-lg font-medium text-gray-900 hover:text-orange-600 transition-colors duration-200">{item.productName}</h2>
                          {item.cartAttributes && Object.keys(item.cartAttributes).length > 0 && (
                            <p className="mt-1 text-sm text-gray-500">
                              {Object.entries(item.cartAttributes)
                                .map(([key, value]) => (
                                  <span key={key} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700 mr-2 mb-1">
                                    {formatAttributeName(key)}: {value}
                                  </span>
                                ))}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="w-full md:w-1/5 flex md:justify-center my-2 md:my-0">
                        <span className="md:hidden font-medium mr-2">Đơn giá:</span>
                        <span className="text-gray-900 font-medium">{item.price.toLocaleString()}₫</span>
                      </div>

                      {/* Quantity */}
                      <div className="w-full md:w-1/5 flex md:justify-center my-2 md:my-0">
                        <div className="flex items-center border border-gray-300 rounded-md bg-white">
                          <button
                            onClick={() => handleQuantityChange(item.sanPhamId, item.cartAttributes, "decrement")}
                            className="px-3 py-1 text-orange-500 hover:bg-orange-50 transition-colors"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.sanPhamId, item.cartAttributes, "increment")}
                            className="px-3 py-1 text-orange-500 hover:bg-orange-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="w-full md:w-1/5 flex justify-between md:justify-end my-2 md:my-0">
                        <span className="md:hidden font-medium">Thành tiền:</span>
                        <span className="text-orange-600 font-bold">
                          {(item.price * item.quantity).toLocaleString()}₫
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemoveItem(item.sanPhamId, item.cartAttributes)}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-8">
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">Tóm tắt đơn hàng</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Tổng sản phẩm</p>
                    <p className="text-gray-900 font-medium bg-gray-100 px-3 py-1 rounded-full">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Tổng tạm tính</p>
                    <p className="text-gray-900 font-medium">{cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}₫</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <p className="text-gray-900">Tổng tiền</p>
                      <p className="text-2xl text-orange-600">
                        {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}₫
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 text-right">(Đã bao gồm VAT nếu có)</p>
                  </div>
                </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={proceedToPayment}
                    className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-sm transition-colors duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Tiến hành thanh toán
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="w-full mt-3 py-3 px-4 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium rounded-md shadow-sm transition-colors duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Cart;