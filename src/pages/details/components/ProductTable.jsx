import React from 'react';
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Switch from "react-switch";
import { toast } from 'react-toastify';

const ProductTable = ({ sanPhams, handleToggleStatus, handleUpdateProduct, openDeleteModal }) => {
  return (
    <table className="table-auto w-full text-xs px-4 py-2 bg-white rounded-lg shadow overflow-hidden text-center">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2">STT</th>
          <th className="px-4 py-2">Mã sản phẩm</th>
          <th className="px-4 py-2">Tên sản phẩm</th>
          <th className="px-4 py-2">Chất liệu</th>
          <th className="px-4 py-2">Cổ áo</th>
          <th className="px-4 py-2">Màu sắc</th>
          <th className="px-4 py-2">Kích thước</th>
          <th className="px-4 py-2">Tay áo</th>
          <th className="px-4 py-2">Thương hiệu</th>
          <th className="px-4 py-2">Xuất xứ</th>
          <th className="px-4 py-2">SL</th>
          <th className="px-4 py-2">Đơn giá</th>
          <th className="px-4 py-2">Ngày tạo</th>
          <th className="px-4 py-2">Trạng thái</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {sanPhams.map((sanPham, index) => (
          <tr key={sanPham.id}>
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{sanPham.sanPham.maSanPham}</td>
            <td className="px-4 py-2 flex items-center space-x-2">
              {sanPham.hinhAnh && (
                <img
                  src={sanPham.hinhAnh}
                  alt={sanPham.sanPham.tenSanPham}
                  className="w-7 h-7 object-cover rounded-md"
                />
              )}
              <span>{sanPham.sanPham.tenSanPham}</span>
            </td>

            <td className="px-4 py-2">{sanPham.chatLieu?.tenChatLieu || 'N/A'}</td>
            <td className="px-4 py-2">{sanPham.coAo?.tenCoAo || 'N/A'}</td>
            <td className="px-4 py-2">{sanPham.mauSac?.tenMauSac || 'N/A'}</td>
            <td className="px-4 py-2">{sanPham.kichThuoc?.tenKichThuoc || 'N/A'}</td>
            <td className="px-4 py-2">{sanPham.tayAo?.tenTayAo || 'N/A'}</td>
            <td className="px-4 py-2">{sanPham.thuongHieu?.tenThuongHieu || 'N/A'}</td>
            <td className="px-4 py-2">{sanPham.xuatXu?.tenXuatXu || 'N/A'}</td>
            <td className="px-4 py-2">{sanPham.soLuong}</td>
            <td className="px-4 py-2">{sanPham.donGia}</td>
            <td className="px-4 py-2">
              {new Date(sanPham.ngayTao).toLocaleDateString('vi-VN')}
            </td>

            <td className="px-4 py-2">
              <td className="px-4 py-2">
                <div title={sanPham.trangThai ? "Click để tắt" : "Click để kích hoạt"}>
                  <Switch
                    onChange={() => handleToggleStatus(sanPham.id)}
                    checked={sanPham.trangThai}
                    offColor="#d6d6d6"
                    onColor="#4CAF50"
                    offHandleColor="#888"
                    onHandleColor="#fff"
                    checkedIcon={false}
                    uncheckedIcon={false}
                    height={20}
                    width={40}
                  />
                </div>
              </td>

            </td>
            <td className="px-4 py-2 flex items-center">
              <button
                className="text-blue-500 hover:text-blue-700 mr-2"
                onClick={() => handleUpdateProduct(sanPham)}
                title="Chỉnh sửa sản phẩm"
              >
                <AiOutlineEdit className="text-xl" />
              </button>
              {/* <button
                className="text-red-500 hover:text-red-700"
                onClick={() => openDeleteModal(sanPham)}
              >
                <AiOutlineDelete className="text-xl" />
              </button> */}
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
