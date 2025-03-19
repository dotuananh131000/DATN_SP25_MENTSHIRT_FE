import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DetailService from "./services/DetailService";
import Cookies from "js-cookie"; // Import js-cookie
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

function ProductDetail() {
  const { sanPhamId } = useParams();
  const [attributes, setAttributes] = useState({});
  const [productDetail, setProductDetail] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({
    chatLieuId: null,
    coAoId: null,
    kichThuocId: null,
    mauSacId: null,
    tayAoId: null,
    thuongHieuId: null,
    xuatXuId: null,
  });
  const [cartAttributes, setCartAttributes] = useState({
    chatLieu: null,
    coAo: null,
    kichThuoc: null,
    mauSac: null,
    tayAo: null,
    thuongHieu: null,
    xuatXu: null,
  });
  const [quantity, setQuantity] = useState(1); // State for quantity

  useEffect(() => {
    fetchAttributes();
  }, [sanPhamId]);

  useEffect(() => {
    if (Object.values(selectedAttributes).every((attr) => attr !== null)) {
      fetchProductDetail();
    }
  }, [selectedAttributes]);

  const fetchAttributes = async () => {
    try {
      const response = await DetailService.getAttributesByProductId(sanPhamId);
      setAttributes(response.data);
      setSelectedAttributes({
        detailId: response.data.id,
        chatLieuId: response.data.chatLieus[0]?.id || null,
        coAoId: response.data.coAos[0]?.id || null,
        kichThuocId: response.data.kichThuocs[0]?.id || null,
        mauSacId: response.data.mauSacs[0]?.id || null,
        tayAoId: response.data.tayAos[0]?.id || null,
        thuongHieuId: response.data.thuongHieus[0]?.id || null,
        xuatXuId: response.data.xuatXus[0]?.id || null,
      });
      setCartAttributes({
        detailId: response.data.id,
        chatLieu: response.data.chatLieus[0]?.tenChatLieu || null,
        coAo: response.data.coAos[0]?.tenCoAo || null,
        kichThuoc: response.data.kichThuocs[0]?.tenKichThuoc || null,
        mauSac: response.data.mauSacs[0]?.tenMauSac || null,
        tayAo: response.data.tayAos[0]?.tenTayAo || null,
        thuongHieu: response.data.thuongHieus[0]?.tenThuongHieu || null,
        xuatXu: response.data.xuatXus[0]?.tenXuatXu || null,
      });       
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

  const fetchProductDetail = async () => {
    try {
      const response = await DetailService.getProductDetail(
        sanPhamId,
        selectedAttributes.chatLieuId,
        selectedAttributes.coAoId,
        selectedAttributes.kichThuocId,
        selectedAttributes.mauSacId,
        selectedAttributes.tayAoId,
        selectedAttributes.thuongHieuId,
        selectedAttributes.xuatXuId
      );
      setProductDetail(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };

  const handleAttributeChange = (attribute, value, name) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attribute]: value,
    }));
  
    setCartAttributes((prev) => ({
      ...prev,
      [attribute]: name,
    }));
  };
  

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "increment") {
        return Math.min(prev + 1, productDetail.soLuong);
      }
      return Math.max(1, prev - 1);
    });
  };  

  const isSameProduct = (item1, item2) => {
    if (!item1 || !item2 || !item1.selectedAttributes || !item2.selectedAttributes) {
      return false;
    }
    
    return (
      item1.sanPhamId === item2.sanPhamId &&
      Object.keys(item1.selectedAttributes).every(
        (key) => item1.selectedAttributes[key] === item2.selectedAttributes[key]
      )
    );
  };
  
  
  const handleAddToCart = () => {
    if (!productDetail.sanPham || productDetail.soLuong < 1) {
      toast.error("Sản phẩm không khả dụng.");
      return;
    }
  
    const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
  
    const newItem = {
      sanPhamId,
      detailId: productDetail.id,
      productName: productDetail.sanPham.tenSanPham,
      image: productDetail.hinhAnh,
      price: productDetail.donGia,
      quantity: Math.min(quantity, productDetail.soLuong),
      cartAttributes: cartAttributes || {}, // Đảm bảo không bị undefined
    };
  
    const existingItem = cart.find((item) => isSameProduct(item, newItem));
  
    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, productDetail.soLuong);
    } else {
      cart.push(newItem);
    }
  
    Cookies.set("cart", JSON.stringify(cart), { expires: 7 });
    toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };
  
  
  

  if (!attributes || !productDetail) {
    return <div className="text-center text-gray-500">Không có sản phẩm nào phù hợp.</div>;
  }

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Toast container */}
        <ToastContainer />

        {/* Breadcrumb navigation */}
        <div className="mb-6 text-sm text-gray-600">
          <span className="hover:text-orange-500 cursor-pointer">Trang chủ</span> / 
          <span className="hover:text-orange-500 cursor-pointer"> Sản phẩm</span> / 
          <span className="text-orange-500"> {productDetail.sanPham?.tenSanPham}</span>
        </div>
        
        {/* Main product section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Product image gallery */}
            <div className="lg:col-span-3 p-6">
              <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-50">
                <img
                  src={productDetail.hinhAnh}
                  alt={productDetail.sanPham?.tenSanPham}
                  className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Mới
                </div>
              </div>
            </div>
            
            {/* Product details */}
            <div className="lg:col-span-2 p-6 border-l border-gray-100">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{productDetail.sanPham?.tenSanPham}</h1>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-orange-600">{productDetail.donGia?.toLocaleString()}₫</span>
              </div>
              
              <div className="space-y-6">
                {/* Attributes selection */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Chọn thuộc tính</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
                    <div className="flex flex-wrap gap-2">
                      {attributes.mauSacs?.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleAttributeChange("mauSacId", item.id, item.tenMauSac)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedAttributes.mauSacId === item.id 
                              ? "border-orange-500 bg-orange-50 text-orange-700 font-medium" 
                              : "border-gray-200 hover:border-orange-300"
                          }`}
                        >
                          {item.tenMauSac}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kích thước</label>
                    <div className="flex flex-wrap gap-2">
                      {attributes.kichThuocs?.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleAttributeChange("kichThuocId", item.id, item.tenKichThuoc)}
                          className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-all ${
                            selectedAttributes.kichThuocId === item.id 
                              ? "border-orange-500 bg-orange-50 text-orange-700 font-medium" 
                              : "border-gray-200 hover:border-orange-300"
                          }`}
                        >
                          {item.tenKichThuoc}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chất liệu</label>
                      <div className="flex flex-wrap gap-2">
                        {attributes.chatLieus?.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleAttributeChange("chatLieuId", item.id, item.tenChatLieu)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedAttributes.chatLieuId === item.id 
                                ? "border-orange-500 bg-orange-50 text-orange-700 font-medium" 
                                : "border-gray-200 hover:border-orange-300"
                            }`}
                          >
                            {item.tenChatLieu}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cổ áo</label>
                      <div className="flex flex-wrap gap-2">
                        {attributes.coAos?.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleAttributeChange("coAoId", item.id, item.tenCoAo)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedAttributes.coAoId === item.id 
                                ? "border-orange-500 bg-orange-50 text-orange-700 font-medium" 
                                : "border-gray-200 hover:border-orange-300"
                            }`}
                          >
                            {item.tenCoAo}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tay áo</label>
                      <div className="flex flex-wrap gap-2">
                        {attributes.tayAos?.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleAttributeChange("tayAoId", item.id, item.tenTayAo)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedAttributes.tayAoId === item.id 
                                ? "border-orange-500 bg-orange-50 text-orange-700 font-medium" 
                                : "border-gray-200 hover:border-orange-300"
                            }`}
                          >
                            {item.tenTayAo}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
                      <div className="flex flex-wrap gap-2">
                        {attributes.thuongHieus?.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleAttributeChange("thuongHieuId", item.id, item.tenThuongHieu)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedAttributes.thuongHieuId === item.id 
                                ? "border-orange-500 bg-orange-50 text-orange-700 font-medium" 
                                : "border-gray-200 hover:border-orange-300"
                            }`}
                          >
                            {item.tenThuongHieu}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Xuất xứ</label>
                      <div className="flex flex-wrap gap-2">
                        {attributes.xuatXus?.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleAttributeChange("xuatXuId", item.id, item.tenXuatXu)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedAttributes.xuatXuId === item.id 
                                ? "border-orange-500 bg-orange-50 text-orange-700 font-medium" 
                                : "border-gray-200 hover:border-orange-300"
                            }`}
                          >
                            {item.tenXuatXu}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                </div>
                
                {/* Add to cart section */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange("decrement")}
                        className="px-4 py-2 text-orange-500 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        className="w-12 text-center border-0 focus:outline-none"
                        readOnly
                      />
                      <button
                        onClick={() => handleQuantityChange("increment")}
                        className="px-4 py-2 text-orange-500 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="ml-4 text-gray-500">Còn lại: {productDetail.soLuong} sản phẩm</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
                    >
                      Thêm vào giỏ hàng
                    </button>
                    <button className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium py-3 px-6 rounded-lg transition-colors">
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product description */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-lg inline-flex items-center justify-center text-white mr-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
            Mô tả sản phẩm
          </h2>
          
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {productDetail.sanPham?.moTa}
          </div>
          
          {/* Product specifications */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Thông số sản phẩm</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex">
                <div className="w-40 text-gray-600">Thương hiệu:</div>
                <div className="font-medium">{attributes.thuongHieus?.find(item => item.id === selectedAttributes.thuongHieuId)?.tenThuongHieu || "Chưa chọn"}</div>
              </div>
              <div className="flex">
                <div className="w-40 text-gray-600">Xuất xứ:</div>
                <div className="font-medium">{attributes.xuatXus?.find(item => item.id === selectedAttributes.xuatXuId)?.tenXuatXu || "Chưa chọn"}</div>
              </div>
              <div className="flex">
                <div className="w-40 text-gray-600">Chất liệu:</div>
                <div className="font-medium">{attributes.chatLieus?.find(item => item.id === selectedAttributes.chatLieuId)?.tenChatLieu || "Chưa chọn"}</div>
              </div>
              <div className="flex">
                <div className="w-40 text-gray-600">Kiểu cổ:</div>
                <div className="font-medium">{attributes.coAos?.find(item => item.id === selectedAttributes.coAoId)?.tenCoAo || "Chưa chọn"}</div>
              </div>
              <div className="flex">
                <div className="w-40 text-gray-600">Kiểu tay:</div>
                <div className="font-medium">{attributes.tayAos?.find(item => item.id === selectedAttributes.tayAoId)?.tenTayAo || "Chưa chọn"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;