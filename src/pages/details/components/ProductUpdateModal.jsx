import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import ProductDetailService from "../services/ProductDetailService";
import { QRCodeCanvas } from "qrcode.react";
import UploadFileService from "../services/UploadFileService";

export default function ProductUpdateModal({
  modalVisible,
  currentProduct,
  onClose,
  onUpdate,
  thuongHieus,
  xuatXus,
  chatLieus,
  coAos,
  tayAos,
  mauSacs,
  kichThuocs
}) {
  const [soLuong, setSoLuong] = useState("");
  const [donGia, setDonGia] = useState("");
  const [hinhAnh, setHinhAnh] = useState("");
  const [thuongHieu, setThuongHieu] = useState(null);
  const [xuatXu, setXuatXu] = useState(null);
  const [chatLieu, setChatLieu] = useState(null);
  const [coAo, setCoAo] = useState(null);
  const [tayAo, setTayAo] = useState(null);
  const [mauSac, setMauSac] = useState(null);
  const [kichThuoc, setKichThuoc] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  console.log(chatLieus)


  useEffect(() => {
    if (currentProduct) {
      setSoLuong(currentProduct.soLuong || "");
      setDonGia(currentProduct.donGia || "");
      setHinhAnh(currentProduct.hinhAnh || "");
      setThuongHieu(currentProduct.thuongHieu ? { value: currentProduct.thuongHieu.id, label: currentProduct.thuongHieu.tenThuongHieu } : null);
      setXuatXu(currentProduct.xuatXu ? { value: currentProduct.xuatXu.id, label: currentProduct.xuatXu.tenXuatXu } : null);
      setChatLieu(currentProduct.chatLieu ? { value: currentProduct.chatLieu.id, label: currentProduct.chatLieu.tenChatLieu } : null);
      setCoAo(currentProduct.coAo ? { value: currentProduct.coAo.id, label: currentProduct.coAo.tenCoAo } : null);
      setTayAo(currentProduct.tayAo ? { value: currentProduct.tayAo.id, label: currentProduct.tayAo.tenTayAo } : null);
      setMauSac(currentProduct.mauSac ? { value: currentProduct.mauSac.id, label: currentProduct.mauSac.tenMauSac } : null);
      setKichThuoc(currentProduct.kichThuoc ? { value: currentProduct.kichThuoc.id, label: currentProduct.kichThuoc.tenKichThuoc } : null);
    }
  }, [currentProduct]);
  const handleUpdateSubmit = async () => {
    const productData = {
      sanPham: currentProduct.id,
      thuongHieu: thuongHieu?.value,
      xuatXu: xuatXu?.value,
      chatLieu: chatLieu?.value,
      coAo: coAo?.value,
      tayAo: tayAo?.value,
      mauSac: mauSac?.value,
      kichThuoc: kichThuoc?.value,
      soLuong: Number(soLuong),
      donGia: Number(donGia),
      hinhAnh: selectedImage || hinhAnh,
    };

    try {
      const result = await ProductDetailService.updateProductDetail(currentProduct.id, productData);
      onUpdate(result);
      toast.success("Cập nhật sản phẩm thành công!");
      setPreviewImage("");
      onClose();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    }
  };


  if (!modalVisible) return null;


  const handleImageUpload = async (file) => {
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ định dạng JPEG, PNG!");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    fileReader.readAsDataURL(file);

    try {
      const uploadedImageUrl = await UploadFileService.uploadProductImage(file);

      setPreviewImage(uploadedImageUrl);
      setSelectedImage(uploadedImageUrl);
    } catch (error) {
      console.error("Lỗi tải ảnh lên Firebase:", error);
      toast.error("Tải ảnh thất bại. Vui lòng thử lại!");
    }
  };



  const handleClose = () => {
    setSoLuong("");
    setDonGia("");
    setHinhAnh("");
    setThuongHieu(null);
    setXuatXu(null);
    setChatLieu(null);
    setCoAo(null);
    setTayAo(null);
    setMauSac(null);
    setKichThuoc(null);
    setSelectedImage(null);
    setPreviewImage("");

    onClose();
  };

  const labelToFieldMap = {
    "Chất liệu": "tenChatLieu",
    "Cổ áo": "tenCoAo",
    "Màu sắc": "tenMauSac",
    "Kích thước": "tenKichThuoc",
    "Tay áo": "tenTayAo",
    "Thương hiệu": "tenThuongHieu",
    "Xuất xứ": "tenXuatXu"
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Cập nhật chi tiết sản phẩm</h2>

        <div className="grid grid-cols-3 gap-6">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Mã QR Sản phẩm</h3>
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 shadow-sm">
              <QRCodeCanvas
                value={`http://localhost:5173/product/${currentProduct?.id}`}
                size={140}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Chất liệu", value: chatLieu, setValue: setChatLieu, options: chatLieus },
              { label: "Cổ áo", value: coAo, setValue: setCoAo, options: coAos },
              { label: "Màu sắc", value: mauSac, setValue: setMauSac, options: mauSacs },
              { label: "Kích thước", value: kichThuoc, setValue: setKichThuoc, options: kichThuocs },
              { label: "Tay áo", value: tayAo, setValue: setTayAo, options: tayAos },
              { label: "Thương hiệu", value: thuongHieu, setValue: setThuongHieu, options: thuongHieus },
              { label: "Xuất xứ", value: xuatXu, setValue: setXuatXu, options: xuatXus },
            ].map(({ label, value, setValue, options }, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <Select
                  value={value}
                  onChange={(option) => setValue(option)}
                  options={options.map(item => ({
                    value: item.id,
                    label: item[labelToFieldMap[label]] // Lấy đúng tên thuộc tính
                  }))}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Hình ảnh sản phẩm */}
          <div>

            <div className="grid grid-cols-2 gap-6 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                <input
                  type="number"
                  value={soLuong}
                  onChange={(e) => setSoLuong(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Đơn giá</label>
                <input
                  type="number"
                  value={donGia}
                  onChange={(e) => setDonGia(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Hình ảnh</h3>
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300 relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {previewImage || hinhAnh ? (
                <img
                  src={previewImage || hinhAnh}
                  className="h-40 w-full object-contain rounded-lg"
                  onError={() => previewImage ? setPreviewImage(null) : setHinhAnh(null)}
                  alt="Product Image"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-32">
                  <p className="text-gray-500">Thả hình ảnh vào đây hoặc{" "}
                    <span className="text-blue-500 cursor-pointer">chọn ảnh</span>
                  </p>
                  <p className="text-gray-400 text-sm">Hỗ trợ: jpeg, png</p>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Nút hành động */}
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleClose} className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200">Hủy</button>
          <button onClick={handleUpdateSubmit} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">Cập nhật</button>
        </div>
      </div>
    </div>
  );
}  