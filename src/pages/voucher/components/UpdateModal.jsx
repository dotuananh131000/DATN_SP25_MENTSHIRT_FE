import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import VoucherService from "../services/VoucherService";
import CustomerService from "../services/CustomerService";
import { toast } from "react-toastify";

const UpdateModal = ({ isOpen, onCancel, voucherId, fetchVouchers }) => {
  const [voucher, setVoucher] = useState({
    tenPhieuGiamGia: "",
    thoiGianApDung: null,
    thoiGianHetHan: null,
    giaTriGiam: "",
    soTienToiThieuHd: "",
    soTienGiamToiDa: "",
    hinhThucGiamGia: 0,
    soLuong: 1,
  });
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (isOpen) {
      fetchVoucherDetails();
      fetchCustomersByVoucherId();
    }
  }, [isOpen, currentPage, pageSize]);

  const fetchVoucherDetails = async () => {
    try {
      const response = await VoucherService.getById(voucherId);
      setVoucher(response.data);
    } catch (error) {
      console.error("Error fetching voucher details:", error);
    }
  };

  const fetchCustomersByVoucherId = async () => {
    try {
      const response = await CustomerService.getByVoucherId(
        voucherId,
        currentPage,
        pageSize
      );
      setCustomers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching customers by voucher ID:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucher((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setVoucher((prev) => ({ ...prev, [name]: date }));
  };

  const validateForm = () => {
    const {
      tenPhieuGiamGia,
      thoiGianApDung,
      thoiGianHetHan,
      giaTriGiam,
      soTienToiThieuHd,
      soTienGiamToiDa,
      hinhThucGiamGia,
      soLuong,
    } = voucher;

    // Kiểm tra rỗng
    if (
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

    // Nếu giảm giá theo số tiền thì phải >= 1000 VND
    if (hinhThucGiamGia == "1" && giaTriGiam < 1000) {
      toast.error("Giá trị giảm theo số tiền phải tối thiểu 1,000 VND.");
      return false;
    }

    // Số tiền tối thiểu hóa đơn: >= 1,000 VND
    if (isNaN(soTienToiThieuHd) || soTienToiThieuHd < 1000) {
      toast.error("Số tiền tối thiểu hóa đơn phải từ 1,000 VND trở lên.");
      return false;
    }

    // Số tiền giảm tối đa: >= 1,000
    if(hinhThucGiamGia == "0") {
      if (isNaN(soTienGiamToiDa) || soTienGiamToiDa < 1000) {
          toast.error("Số tiền giảm tối đa phải từ 1,000 VND trở lên.");
          return false;
      }
    }

    // Kiểm tra nếu giảm giá theo phần trăm thì số tiền giảm tối đa không được thấp hơn số tiền giảm thực tế
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
    if (!Number.isInteger(soLuong) || soLuong <= 0) {
      toast.error("Số lượng phải là số nguyên dương lớn hơn 0.");
      return false;
    }

    return true;
  };

  const handleUpdateVoucher = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await VoucherService.update(voucherId, voucher);
      toast.success("Cập nhật phiếu giảm giá thành công!");
      fetchVouchers();
      onCancel();
    } catch (error) {
      toast.error(error.response.data.message);
    }
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
            Cập nhật phiếu giảm giá
          </h3>
          <div className="flex">
            {/* Bên trái - Thông tin khách hàng */}
            <div className="w-2/5">
              {/* Mã và tên phiếu giảm giá */}
              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Mã phiếu giảm giá
                  </label>
                  <input
                    type="text"
                    name="maPhieuGiamGia"
                    value={voucher.maPhieuGiamGia}
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
                    value={voucher.tenPhieuGiamGia}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập tên phiếu giảm giá"
                  />
                </div>
              </div>

              {/* Thời gian áp dụng */}
              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Thời gian áp dụng
                  </label>
                  <DatePicker
                    selected={voucher.thoiGianApDung ? new Date(voucher.thoiGianApDung) : null}
                    onChange={(date) =>
                      handleDateChange("thoiGianApDung", date)
                    }
                    showTimeSelect
                    dateFormat="Pp"
                    className="input input-bordered w-full"
                    placeholderText="Chọn thời gian áp dụng"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Thời gian hết hạn
                  </label>
                  <DatePicker
                    selected={voucher.thoiGianHetHan ? new Date(voucher.thoiGianHetHan) : null}
                    onChange={(date) =>
                      handleDateChange("thoiGianHetHan", date)
                    }
                    showTimeSelect
                    dateFormat="Pp"
                    className="input input-bordered w-full"
                    placeholderText="Chọn thời gian hết hạn"
                  />
                </div>
              </div>

              {/* Hình thức giảm giá và giá trị giảm */}
              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Hình thức giảm giá
                  </label>
                  <select
                    name="hinhThucGiamGia"
                    value={voucher.hinhThucGiamGia}
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
                    value={voucher.giaTriGiam}
                    onChange={handleChange}
                    min={1}
                    max={voucher.hinhThucGiamGia == 0 ? 100 : undefined}
                    className="input input-bordered w-full"
                    placeholder="Nhập giá trị giảm"
                  />
                </div>
              </div>

              {/* Điều kiện áp dụng */}
              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Số tiền tối thiểu hóa đơn
                  </label>
                  <input
                    type="number"
                    name="soTienToiThieuHd"
                    value={voucher.soTienToiThieuHd}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập số tiền tối thiểu"
                    min={1000}
                    step={1000}
                  />
                </div>
                {Number(voucher.hinhThucGiamGia) === 0 && (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">
                      Số tiền giảm tối đa
                    </label>
                    <input
                      type="number"
                      name="soTienGiamToiDa"
                      value={voucher.soTienGiamToiDa}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Nhập số tiền giảm tối đa"
                      min={1000}
                      step={1000}
                    />
                  </div>
                )}
                {/* <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Số tiền giảm tối đa
                  </label>
                  <input
                    type="number"
                    name="soTienGiamToiDa"
                    value={voucher.soTienGiamToiDa}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập số tiền giảm tối đa"
                    min={1000}
                    step={1000}
                  />
                </div> */}
              </div>

              {/* Loại giảm và số lượng */}
              <div className="py-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Loại giảm
                  </label>
                  <select
                    name="loaiGiam"
                    value={voucher.loaiGiam}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    disabled
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
                    value={voucher.soLuong}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập số lượng"
                    disabled={voucher.loaiGiam == "1"}
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Bên phải - Thông tin phiếu giảm giá */}
            <div className="w-3/5 pr-4 border-r pl-4">
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
                        <tr key={customer.id} className="cursor-pointer">
                          <td className="px-4 py-2">
                            <input type="checkbox" checked={true} disabled />
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
              onClick={handleUpdateVoucher}
            >
              Cập nhật phiếu giảm giá
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateModal;
