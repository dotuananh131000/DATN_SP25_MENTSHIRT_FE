import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { utils, writeFile } from "xlsx";
import { AiOutlineEye, AiFillCaretUp, AiFillCaretDown, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Switch from "react-switch";
import ProductService from "./services/ProductService";
import { toast } from "react-toastify";
import UpdateModal from './components/UpdateModal';
import Modal from './components/DeleteModal';


export default function Product() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    maSanPham: '',
    tenSanPham: '',
    moTa: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { content, totalPages } = await ProductService.getAllProducts(
          currentPage, 
          pageSize, 
          search, 
          sortConfig.key, 
          sortConfig.direction
        );
        setItems(content);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, [currentPage, pageSize, search, sortConfig]);
  

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };


  const handleViewDetail = (maSanPham) => {
    navigate(`/admin/product/${maSanPham}`);
  };

  const handleUpdateProduct = (product) => {
    setUpdatedProduct({
      maSanPham: product.maSanPham,
      tenSanPham: product.tenSanPham,
      moTa: product.moTa,
    });
    setProductToUpdate(product.id);
    setUpdateModal(true);
  };

  const confirmUpdate = async (updatedProduct) => {
    try {
      if (productToUpdate) {
        await ProductService.updateProduct(productToUpdate, updatedProduct);
        const updatedItems = items.map((item) =>
          item.id === productToUpdate ? { ...item, ...updatedProduct } : item
        );
        setItems(updatedItems);
        toast.success("Cập nhật sản phẩm thành công!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Cập nhật sản phẩm thất bại. Vui lòng thử lại!");
    } finally {
      setUpdateModal(false);
      setProductToUpdate(null);
    }
  };

  const cancelUpdate = () => {
    setUpdateModal(false);
    setProductToUpdate(null);
  };

  const handleToggleStatus = async (id) => {
    try {
      await ProductService.toggleProductStatus(id);
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, trangThai: !item.trangThai } : item
      );
      setItems(updatedItems);
      toast.success("Thay đổi trạng thái sản phẩm thành công!");
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("Không thể thay đổi trạng thái sản phẩm. Vui lòng thử lại!");
    }
  };

  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (productToDelete) {
        await ProductService.deleteProduct(productToDelete);
        const updatedItems = items.filter((item) => item.id !== productToDelete);
        setItems(updatedItems);
        toast.success("Xóa sản phẩm thành công!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại!");
    } finally {
      setShowModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const renderRows = () => {
    const sortedItems = [...items].sort((a, b) => {
      if (sortConfig.key === null) return 0;

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortedItems.map((item, index) => (
      <tr key={item.id} className="bg-white hover:bg-gray-100 transition-colors">
        <td className="px-4 py-2">{index + 1}</td>
        <td className="px-4 py-2">{item.maSanPham}</td>
        <td className="px-4 py-2">{item.tenSanPham}</td>
        <td className="px-4 py-2">{item.soLuong}</td>
        <td className="px-4 py-2">
          {format(new Date(item.ngayTao), "HH:mm:ss dd/MM/yyyy")}
        </td>
        <td className={`px-4 py-2 ${item.trangThai ? "status-active" : "status-inactive"}`}>
          <span className="status-dot"></span>
          {item.trangThai ? " Kích hoạt" : " Ngừng bán"}
        </td>
        <td className="px-4 py-2 flex justify-center gap-4">
          <button className="text-blue-500 hover:text-blue-600" onClick={() => handleViewDetail(item.maSanPham)}>
            <AiOutlineEye size={20} />
          </button>
          <button className="text-yellow-500 hover:text-yellow-600" onClick={() => handleUpdateProduct(item)}>
            <AiOutlineEdit size={20} />
          </button>
          {/* <button
            className="text-red-500 hover:text-red-600"
            onClick={() => handleDeleteProduct(item.id)}
          >
            <AiOutlineDelete size={20} />
          </button> */}

          <Switch
            onChange={() => handleToggleStatus(item.id)}
            checked={item.trangThai}
            offColor="#808080"
            onColor="#00a000"
            uncheckedIcon={false}
            checkedIcon={false}
            height={20}
            width={40}
          />
        </td>
      </tr>
    ));
  };

  const renderSortableHeader = (label, sortKey) => {
    const isSorted = sortConfig.key === sortKey;
    const isAscending = isSorted && sortConfig.direction === "asc";

    return (
      <th
        className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors relative"
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center justify-center">
          {label}
          <div className="ml-2 flex flex-col">
            <AiFillCaretUp
              className={`text-sm ${isSorted && isAscending ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
            />
            <AiFillCaretDown
              className={`text-sm ${isSorted && !isAscending ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
            />
          </div>
        </div>
      </th>
    );
  };


  const exportToExcel = () => {
    const dataToExport = items.map(item => ({
      "Mã sản phẩm": item.maSanPham,
      "Tên sản phẩm": item.tenSanPham,
      "Số lượng": item.soLuong,
      "Ngày tạo": format(new Date(item.ngayTao), "HH:mm:ss dd/MM/yyyy"),
      "Trạng thái": item.trangThai ? "Còn hàng" : "Hết hàng",
    }));

    const ws = utils.json_to_sheet(dataToExport);

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sản phẩm");
    writeFile(wb, "san_pham.xlsx");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Quản lý sản phẩm</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo mã, tên sản phẩm"
            className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
            onClick={exportToExcel}
          >
            In Excel
          </button>

          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
            onClick={() => navigate("/admin/product/new")}
          >
            + Thêm mới
          </button>
        </div>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="px-4 py-2">STT</th>
            {renderSortableHeader("Mã sản phẩm", "maSanPham")}
            {renderSortableHeader("Tên sản phẩm", "tenSanPham")}
            {renderSortableHeader("Số lượng", "soLuong")}
            {renderSortableHeader("Ngày tạo", "ngayTao")}
            {renderSortableHeader("Trạng thái", "trangThai")}
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm text-gray-700">Xem</label>
          <select
            id="entries"
            className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span className="text-sm text-gray-700">Sản phẩm</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
            onClick={handlePrevPage}
            disabled={currentPage === 0}  // Disable khi ở trang đầu
          >
            {"<"}
          </button>
          <span className="text-sm text-gray-700">Trang {currentPage + 1} / {totalPages}</span>
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}  // Disable khi ở trang cuối
          >
            {">"}
          </button>
        </div>

      </div>

      <Modal isVisible={showModal} onConfirm={confirmDelete} onCancel={cancelDelete} />

      <UpdateModal isVisible={updateModal} onConfirm={confirmUpdate} onCancel={cancelUpdate} updatedProduct={updatedProduct} setUpdatedProduct={setUpdatedProduct} />

    </div>
  );
}
