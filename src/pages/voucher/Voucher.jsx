import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiFillCaretUp, AiFillCaretDown, AiOutlineEdit } from "react-icons/ai";
import { FaCalendarAlt, FaTag } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Switch from "react-switch";
import VoucherService from "./services/VoucherService";
import { toast } from "react-toastify";
import UpdateModal from './components/UpdateModal';
import CreateModal from './components/CreateModal';

export default function Voucher() {
  const [vouchers, setVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [updateModal, setUpdateModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loaiGiam, setLoaiGiam] = useState(null);

  const fetchVouchers = async () => {
    try {
      const { content, totalPages } = await VoucherService.getAll(
        currentPage,
        pageSize,
        search,
        startDate,
        endDate,
        loaiGiam,
        sortConfig.key,
        sortConfig.direction
      );
      setVouchers(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [currentPage, pageSize, search, sortConfig, startDate, endDate, loaiGiam]);

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

  const handleUpdateVoucher = (voucher) => {
    setCurrentVoucher(voucher);
    setUpdateModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      await VoucherService.toggleStatus(id);
      const updatedItems = vouchers.map((item) =>
        item.id === id ? { ...item, trangThai: !item.trangThai } : item
      );
      setVouchers(updatedItems);
      toast.success("Thay đổi trạng thái phiếu giảm giá thành công!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const renderRows = () => {
    const sortedItems = [...vouchers].sort((a, b) => {
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
        <td className="px-4 py-2">{item.maPhieuGiamGia}</td>
        <td className="px-4 py-2">{item.tenPhieuGiamGia}</td>
        <td className="px-4 py-2">{item.ngayTao ? format(new Date(item.ngayTao), 'dd/MM/yyyy HH:mm:ss') : 'Chưa cập nhật'}</td>
        <td className="px-4 py-2">{item.ngaySua ? format(new Date(item.ngaySua), 'dd/MM/yyyy HH:mm:ss') : 'Chưa cập nhật'}</td>
        <td className="px-4 py-2">{item.thoiGianApDung ? format(new Date(item.thoiGianApDung), 'dd/MM/yyyy HH:mm:ss') : 'Chưa cập nhật'}</td>
        <td className="px-4 py-2">{item.thoiGianHetHan ? format(new Date(item.thoiGianHetHan), 'dd/MM/yyyy HH:mm:ss') : 'Chưa cập nhật'}</td>
        <td className="px-4 py-2">{item.hinhThucGiamGia === 0 ? "Phần trăm" : "Số tiền"}</td>
        <td className="px-4 py-2">{item.soLuong}</td>
        <td className="px-4 py-2">{item.giaTriGiam}</td>
        <td className="px-4 py-2">{item.soTienToiThieuHd}</td>
        <td className="px-4 py-2">{item.soTienGiamToiDa}</td>
        <td className="px-4 py-2">{item.loaiGiam === 0 ? "Mọi người" : "Gửi riêng"}</td>
        <td className={`px-4 py-2 ${item.trangThai ? "status-active" : "status-inactive"}`}>
          <span className="status-dot"></span>
          {item.trangThai ? " Kích hoạt" : " Đã khóa"}
        </td>
        <td className="px-4 py-2 flex justify-center gap-4">
          <button className="text-yellow-500 hover:text-yellow-600" onClick={() => handleUpdateVoucher(item)}>
            <AiOutlineEdit size={20} />
          </button>
          <Switch
            onChange={() => handleToggleStatus(item.id)}
            checked={Boolean(item.trangThai)}
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Quản lý phiếu giảm giá</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm phiếu giảm giá"
            className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
            onClick={() => setCreateModal(true)}
          >
            + Thêm mới
          </button>
        </div>
      </div>

      <div className="flex items-center justify-start mb-4">
        {/* Start Date Picker with Icon inside */}
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="text-sm text-gray-700 flex items-center">
            Từ ngày:
          </label>
          <div className="relative">
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <FaCalendarAlt
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-orange-500"
              onClick={() => document.getElementById('startDate').focus()}
            />
          </div>
        </div>

        {/* End Date Picker with Icon inside */}
        <div className="flex items-center gap-2 ms-5">
          <label htmlFor="endDate" className="text-sm text-gray-700 flex items-center">
            Đến ngày:
          </label>
          <div className="relative">
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <FaCalendarAlt
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-orange-500"
              onClick={() => document.getElementById('endDate').focus()}
            />
          </div>
        </div>

        {/* Loại giảm radio buttons */}
        <div className="flex items-center gap-2 ms-10">
          <label className="text-sm text-gray-700 flex items-center">
            <FaTag className="mr-1 text-orange-500" /> Loại giảm:
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="loaiGiam"
                value=""
                checked={loaiGiam === null}
                onChange={() => setLoaiGiam(null)}
                className="mr-1 text-orange-500"
              />
              Tất cả
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="loaiGiam"
                value="0"
                checked={loaiGiam === 0}
                onChange={() => setLoaiGiam(0)}
                className="mr-1 text-orange-500"
              />
              Mọi người
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="loaiGiam"
                value="1"
                checked={loaiGiam === 1}
                onChange={() => setLoaiGiam(1)}
                className="mr-1 text-orange-500"
              />
              Gửi riêng
            </label>
          </div>
        </div>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="px-4 py-2">STT</th>
            {renderSortableHeader("Mã", "maPhieuGiamGia")}
            {renderSortableHeader("Tên", "tenPhieuGiamGia")}
            {renderSortableHeader("Ngày tạo", "ngayTao")}
            {renderSortableHeader("Ngày sửa", "ngaySua")}
            {renderSortableHeader("Áp dụng", "thoiGianApDung")}
            {renderSortableHeader("Thời hạn", "thoiGianHetHan")}
            {renderSortableHeader("Hình thức giảm", "hinhThucGiamGia")}
            {renderSortableHeader("SL", "soLuong")}
            {renderSortableHeader("Giá trị", "giaTriGiam")}
            {renderSortableHeader("Tối thiểu", "soTienToiThieuHd")}
            {renderSortableHeader("Tối đa", "soTienGiamToiDa")}
            {renderSortableHeader("Loại", "loaiGiam")}
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
          <span className="text-sm text-gray-700">Phiếu giảm giá</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>
          <span className="text-sm text-gray-700">Trang {currentPage + 1} / {totalPages}</span>
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            {">"}
          </button>
        </div>
      </div>

      <CreateModal
        isOpen={createModal}
        onConfirm={() => setCreateModal(false)}
        onCancel={() => setCreateModal(false)}
        fetchVouchers={fetchVouchers}
      />

      <UpdateModal
        isOpen={updateModal}
        onCancel={() => setUpdateModal(false)}
        voucherId={currentVoucher?.id}
        fetchVouchers={fetchVouchers}
      />
    </div>
  );
}