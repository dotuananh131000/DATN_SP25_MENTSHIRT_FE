import React, { useState, useEffect } from "react";
import { AiFillCaretUp, AiFillCaretDown, AiOutlineDelete } from "react-icons/ai";
import Switch from "react-switch";
import SizeService from "./services/SizeService";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import Modal from './component/DeleteModal';

export default function KichThuoc() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [kichThuocToUpdate, setKichThuocToUpdate] = useState(null);
  const [updatedTenKichThuoc, setUpdatedTenKichThuoc] = useState("");
  const [kichThuocToDelete, setKichThuocToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTenKichThuoc, setNewTenKichThuoc] = useState("");


  const fetchKichThuoc = async () => {
    try {
      const { content, totalPages } = await SizeService.getAll(currentPage, pageSize, search);
      setItems(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  useEffect(() => {
    fetchKichThuoc();
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

  const handleUpdateKichThuoc = async (kichThuoc) => {
    try {
      await SizeService.update(kichThuoc.id, { tenKichThuoc: updatedTenKichThuoc });
      const updatedItems = items.map((item) =>
        item.id === kichThuoc.id ? { ...item, tenKichThuoc: updatedTenKichThuoc } : item
      );
      setItems(updatedItems);
      fetchKichThuoc();
      toast.success("Cập nhật kích thước thành công!");
    } catch (error) {
      console.error("Error updating size:", error);
      toast.error("Cập nhật kích thước thất bại. Vui lòng thử lại!");
    }
  };

  const handleDoubleClick = (kichThuoc) => {
    setKichThuocToUpdate(kichThuoc.id);
    setUpdatedTenKichThuoc(kichThuoc.tenKichThuoc);
  };

  const handleBlur = () => {
    if (kichThuocToUpdate) {
      handleUpdateKichThuoc({ id: kichThuocToUpdate, tenKichThuoc: updatedTenKichThuoc });
      setKichThuocToUpdate(null);  
    }
  };

  const handleChangeTenKichThuoc = (event) => {
    setUpdatedTenKichThuoc(event.target.value);
  };

  const handleToggleStatus = async (id) => {
    try {
      await SizeService.toggleStatus(id);
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, trangThai: !item.trangThai } : item
      );
      setItems(updatedItems);
      toast.success("Thay đổi trạng thái kích thước thành công!");
    } catch (error) {
      console.error("Error toggling size status:", error);
      toast.error("Không thể thay đổi trạng thái kích thước. Vui lòng thử lại!");
    }
  };

  const handleDeleteKichThuoc = (id) => {
    setKichThuocToDelete(id); 
    setShowDeleteModal(true); 
  };

  const confirmDelete = async () => {
    try {
      if (kichThuocToDelete) {
        await SizeService.delete(kichThuocToDelete); 
        setItems(items.filter((item) => item.id !== kichThuocToDelete)); 
        toast.success("Xóa kích thước thành công!"); 
        setShowDeleteModal(false); 
        fetchKichThuoc(); 
      }
    } catch (error) {
      console.error("Error deleting size:", error);
      toast.error("Không thể xóa kích thước. Vui lòng thử lại!"); 
    } finally {
      setKichThuocToDelete(null); 
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setKichThuocToDelete(null); 
  };


  const handleAddKichThuoc = async () => {
    if (newTenKichThuoc.trim() === "") {
      toast.error("Tên kích thước không được để trống!");
      return;
    }
    try {
      const newBrand = await SizeService.add({ tenKichThuoc: newTenKichThuoc });
      setItems([newBrand, ...items]);
      setNewTenKichThuoc("");
      setShowModal(false);
      fetchKichThuoc();
      toast.success("Thêm kích thước thành công!");
    } catch (error) {
      console.error("Error adding size:", error);
      toast.error("Không thể thêm kích thước. Vui lòng thử lại!");
    }
  };

  const exportToExcel = () => {
    const dataToExport = items.map(item => ({
      "Mã kích thước": item.id,
      "Tên kích thước": item.tenKichThuoc,
      "Ngày tạo": new Date(item.ngayTao).toLocaleDateString(),
      "Trạng thái": item.trangThai ? "Kích hoạt" : "Ngừng hoạt động",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kích thước");
    XLSX.writeFile(wb, "thuong_hieu.xlsx");
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
        <td
          className="px-4 py-2 cursor-pointer"
          onDoubleClick={() => handleDoubleClick(item)}
        >
          {kichThuocToUpdate === item.id ? (
            <input
              type="text"
              value={updatedTenKichThuoc}
              onChange={handleChangeTenKichThuoc}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            item.tenKichThuoc
          )}
        </td>
        <td className="px-4 py-2">{new Date(item.ngayTao).toLocaleDateString()}</td>
        <td className={`px-4 py-2 ${item.trangThai ? "status-active" : "status-inactive"}`}>
          <span className="status-dot"></span>
          {item.trangThai ? " Kích hoạt" : " Ngừng hoạt động"}
        </td>
        <td className="px-4 py-2 flex justify-center gap-4">
        <div title={item.trangThai ? "Click để tắt" : "Click để kích hoạt"}>
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
            </div>
          {/* <AiOutlineDelete
            className="text-red-500 cursor-pointer"
            onClick={() => handleDeleteKichThuoc(item.id)}
          /> */}
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
              className={`text-sm ${isSorted && isAscending ? "text-orange-500" : "text-gray-400"}`}
            />
            <AiFillCaretDown
              className={`text-sm ${isSorted && !isAscending ? "text-orange-500" : "text-gray-400"}`}
            />
          </div>
        </div>
      </th>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Quản lý kích thước</h1>
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          type="text"
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Tìm kiếm kích thước..."
          value={search}
          onChange={handleSearch}
        />
        <div className="flex gap-2">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
            onClick={exportToExcel}
          >
            In excel
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
            onClick={() => setShowModal(true)}
          >
            Thêm kích thước
          </button>
        </div>
      </div>


      <table className="table-auto w-full px-4 py-2 bg-white rounded-lg shadow overflow-hidden text-center">
        <thead classname="bg-gray-100 text-center">
          <tr>
            {renderSortableHeader("STT", "id")}
            {renderSortableHeader("Tên kích thước", "tenKichThuoc")}
            {renderSortableHeader("Ngày tạo", "ngayTao")}
            {renderSortableHeader("Trạng Thái", "trangThai")}
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm text-gray-700">Xem</label>
          <select
            id="entries"
            className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>

          <span className="text-sm text-gray-700">Sản phẩm</span>
        </div>

        <div className="flex items-center">
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
            onClick={handlePrevPage}
          >
            {"<"}
          </button>
          <div className="mx-2 text-xs">{`Trang ${currentPage + 1} / ${totalPages}`}</div>
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
            onClick={handleNextPage}
          >
            {">"}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Thêm kích thước</h2>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded mb-4"
              placeholder="Tên kích thước"
              value={newTenKichThuoc}
              onChange={(e) => setNewTenKichThuoc(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleAddKichThuoc}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal isVisible={showDeleteModal} onConfirm={confirmDelete} onCancel={cancelDelete} />

    </div>

  );
}
