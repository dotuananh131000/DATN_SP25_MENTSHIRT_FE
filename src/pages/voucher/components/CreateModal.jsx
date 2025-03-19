import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import VoucherService from "../services/VoucherService";
import CustomerService from "../services/CustomerService";
import CustomerVoucherService from "../services/CustomerVoucherService";
import { toast } from "react-toastify";

const CreateModal = ({ isOpen, onCancel, setCreateModal, fetchVouchers }) => {
  const [newVoucher, setNewVoucher] = useState({
    maPhieuGiamGia: "",
    tenPhieuGiamGia: "",
    thoiGianApDung: null,
    thoiGianHetHan: null,
    hinhThucGiamGia: "0",
    giaTriGiam: "",
    soTienToiThieuHd: "",
    soTienGiamToiDa: "",
    loaiGiam: "0",
    soLuong: "",
    khachHangId: [],
  });
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchCustomers();
    }
  }, [isOpen]);

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher((prev) => {
      let updatedVoucher = { ...prev, [name]: value };
      if (name === "loaiGiam" && value === "0") {
        setSelectedCustomers([]);
      }
      return updatedVoucher;
    });
  };

  const handleDateChange = (name, date) => {
    setNewVoucher((prev) => ({ ...prev, [name]: date }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const fetchCustomers = async () => {
    try {
      const response = await CustomerService.getAll(
        currentPage,
        pageSize,
        search
      );
      setCustomers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, pageSize, search]);

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomers((prev) => {
      const updatedCustomers = prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId];
      console.log(updatedCustomers);

      return updatedCustomers;
    });
  };

  const handleRowClick = (customerId) => {
    if (newVoucher.loaiGiam !== "0") {
      handleCustomerSelect(customerId);
    }
  };

  const validateForm = () => {
    const {
      maPhieuGiamGia,
      tenPhieuGiamGia,
      thoiGianApDung,
      thoiGianHetHan,
      giaTriGiam,
      soTienToiThieuHd,
      soTienGiamToiDa,
      loaiGiam,
      soLuong,
      hinhThucGiamGia,
    } = newVoucher;

    // Kiểm tra rỗng
    if (
      !maPhieuGiamGia ||
      !tenPhieuGiamGia ||
      !thoiGianApDung ||
      !thoiGianHetHan ||
      giaTriGiam === undefined ||
      soTienToiThieuHd === undefined ||
      soTienGiamToiDa === undefined ||
      soLuong === undefined
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return false;
    }

    // Mã phiếu giảm giá: Chỉ chứa chữ và số, không khoảng trắng, từ 3-20 ký tự
    if (!/^[a-zA-Z0-9]{3,20}$/.test(maPhieuGiamGia)) {
      toast.error(
        "Mã phiếu giảm giá chỉ được chứa chữ và số (3-20 ký tự), không có khoảng trắng."
      );
      return false;
    }

    // Tên phiếu giảm giá: Tối thiểu 5 ký tự
    if (tenPhieuGiamGia.trim().length < 5) {
      toast.error("Tên phiếu giảm giá phải có ít nhất 5 ký tự.");
      return false;
    }

    // Thời gian áp dụng phải trước thời gian hết hạn
    if (new Date(thoiGianApDung) >= new Date(thoiGianHetHan)) {
      toast.error("Thời gian áp dụng phải trước thời gian hết hạn.");
      return false;
    }

    // Giá trị giảm: Phải là số hợp lệ và > 0
    if (isNaN(giaTriGiam) || giaTriGiam <= 0) {
      toast.error("Giá trị giảm phải là số hợp lệ và lớn hơn 0.");
      return false;
    }

    // Nếu giảm giá theo phần trăm thì phải từ 1% đến 100%
    if (hinhThucGiamGia == "0" && (giaTriGiam < 1 || giaTriGiam > 100)) {
      toast.error("Giá trị giảm theo phần trăm phải từ 1% đến 100%.");
      return false;
    }

    // Nếu giảm giá theo số tiền thì phải >= 1000
    if (hinhThucGiamGia == "1" && giaTriGiam < 1000) {
      toast.error("Giá trị giảm theo số tiền phải tối thiểu 1,000 VND.");
      return false;
    }

    // Số tiền tối thiểu hóa đơn: >= 1,000
    if (isNaN(soTienToiThieuHd) || soTienToiThieuHd < 1000) {
      toast.error("Số tiền tối thiểu hóa đơn phải từ 1,000 VND trở lên.");
      return false;
    }

    // Số tiền giảm tối đa: >= 1,000
    if (isNaN(soTienGiamToiDa) || soTienGiamToiDa < 1000) {
      toast.error("Số tiền giảm tối đa phải từ 1,000 VND trở lên.");
      return false;
    }

    // Kiểm tra nếu giảm giá theo phần trăm thì số tiền giảm tối đa không được thấp hơn số tiền tối thiểu hóa đơn
    if (
      hinhThucGiamGia == "0" &&
      soTienGiamToiDa < soTienToiThieuHd * (giaTriGiam / 100)
    ) {
      toast.error(
        "Số tiền giảm tối đa không được nhỏ hơn số tiền giảm thực tế."
      );
      return false;
    }

    // Số lượng phải là số nguyên dương
    if (!soLuong || !Number.isInteger(Number(soLuong))|| Number(soLuong) <= 0) {
      console.log(Number.isInteger(soLuong))
      toast.error(`Số lượng phải là số nguyên dương lớn hơn 0.`);
      return false;
    }

    // Nếu loại giảm là gửi riêng, cần chọn ít nhất một khách hàng
    if (
      loaiGiam == "1" &&
      (!selectedCustomers || selectedCustomers.length === 0)
    ) {
      toast.error("Vui lòng chọn ít nhất một khách hàng.");
      return false;
    }

    return true;
  };

  const handleCreateVoucher = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const voucherData = { ...newVoucher, khachHangId: selectedCustomers };
      await VoucherService.add(voucherData);

      toast.success("Tạo phiếu giảm giá thành công!");
      fetchVouchers();
      setCreateModal(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const resetForm = async () => {
    const uniqueCode = generateRandomString(10);
    setNewVoucher({
      maPhieuGiamGia: uniqueCode,
      tenPhieuGiamGia: "",
      thoiGianApDung: null,
      thoiGianHetHan: null,
      hinhThucGiamGia: "0",
      giaTriGiam: "",
      soTienToiThieuHd: "",
      soTienGiamToiDa: "",
      loaiGiam: "0",
      soLuong: "",
    });
    setSearch("");
    setCustomers([]);
    setSelectedCustomers([]);
    setCurrentPage(0);
    setTotalPages(0);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box relative max-w-7xl w-full">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onCancel}
          >
            ✖
          </button>
          <h3 className="font-bold text-lg text-orange-600 text-center">
            Tạo phiếu giảm giá mới
          </h3>
          <div className="flex">
            {/* Bên trái - Thông tin khách hàng */}
            <div className="w-2/5">
              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Mã phiếu giảm giá
                  </label>
                  <input
                    type="text"
                    name="maPhieuGiamGia"
                    value={newVoucher.maPhieuGiamGia}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập mã phiếu giảm giá"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Tên phiếu giảm giá
                  </label>
                  <input
                    type="text"
                    name="tenPhieuGiamGia"
                    value={newVoucher.tenPhieuGiamGia}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập tên phiếu giảm giá"
                  />
                </div>
              </div>

              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Thời gian áp dụng
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={newVoucher.thoiGianApDung}
                      onChange={(date) =>
                        handleDateChange("thoiGianApDung", date)
                      }
                      showTimeSelect
                      dateFormat="Pp"
                      className="input input-bordered w-full pl-10"
                      placeholderText="Chọn thời gian áp dụng"
                    />
                    <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Thời gian hết hạn
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={newVoucher.thoiGianHetHan}
                      onChange={(date) =>
                        handleDateChange("thoiGianHetHan", date)
                      }
                      showTimeSelect
                      dateFormat="Pp"
                      className="input input-bordered w-full pl-10"
                      placeholderText="Chọn thời gian hết hạn"
                    />
                    <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Hình thức giảm giá
                  </label>
                  <select
                    name="hinhThucGiamGia"
                    value={newVoucher.hinhThucGiamGia}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value={0}>Phần trăm</option>
                    <option value={1}>Số tiền cụ thể</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Giá trị giảm
                  </label>
                  <input
                    type="number"
                    name="giaTriGiam"
                    value={newVoucher.giaTriGiam}
                    onChange={handleChange}
                    min={1}
                    className="input input-bordered w-full"
                    placeholder="Nhập giá trị giảm"
                  />
                </div>
              </div>

              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Số tiền tối thiểu HD
                  </label>
                  <input
                    type="number"
                    name="soTienToiThieuHd"
                    value={newVoucher.soTienToiThieuHd}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập số tiền tối thiểu HD"
                    min={1000}
                    step={1000}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Số tiền giảm tối đa
                  </label>
                  <input
                    type="number"
                    name="soTienGiamToiDa"
                    value={newVoucher.soTienGiamToiDa}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập số tiền giảm tối đa"
                    min={1000}
                    step={1000}
                  />
                </div>
              </div>

              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Loại giảm
                  </label>
                  <select
                    name="loaiGiam"
                    value={newVoucher.loaiGiam}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value={0}>Tất cả</option>
                    <option value={1}>Gửi riêng</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    name="soLuong"
                    value={newVoucher.soLuong}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập số lượng"
                    min={1}
                  />
                </div>
              </div>
            </div>

            {/* Bên phải - Thông tin phiếu giảm giá */}
            <div className="w-3/5 pr-4 border-r pl-4">
              <div className="py-3">
                <label className="text-sm font-medium text-gray-600">
                  Tìm kiếm khách hàng
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập tên hoặc mã khách hàng"
                    disabled={newVoucher.loaiGiam === "0"}
                  />
                  <button
                    className="btn bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={fetchCustomers}
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
              <div className="py-3">
                <label className="text-sm font-medium text-gray-600">
                  Danh sách khách hàng
                </label>
                <div className="max-h-64 overflow-y-auto">
                  <table className="table-auto w-full">
                    <thead className="text-left">
                      <tr>
                        <th className="px-4 py-2">Chọn</th>
                        <th className="px-4 py-2">Tên khách hàng</th>
                        <th className="px-4 py-2">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr
                          key={customer.id}
                          onClick={() => handleRowClick(customer.id)}
                          className="cursor-pointer"
                        >
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              checked={selectedCustomers.includes(customer.id)}
                              onChange={() => handleCustomerSelect(customer.id)}
                              disabled={newVoucher.loaiGiam === "0"}
                            />
                          </td>
                          <td className="px-4 py-2">{customer.tenKhachHang}</td>
                          <td className="px-4 py-2">{customer.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    {"<"}
                  </button>
                  <span className="text-sm text-gray-700">
                    Trang {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                  >
                    {">"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action flex justify-end gap-2">
            <button
              className="btn bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleCreateVoucher}
            >
              Tạo phiếu giảm giá
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
