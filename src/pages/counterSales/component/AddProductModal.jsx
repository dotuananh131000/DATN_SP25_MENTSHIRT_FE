import { memo, useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import HoaDonService from "../services/HoaDonService";
import { toast } from "react-toastify";
import ModalSPCT from "./ModalSPCT";

function AddProductModal({
  spcts,
  isOpen,
  isClose,
  hoaDon,
  handleDaTa,
  totalPages,
  page,
  setPage,
  size,
  setSize,
  setSearch,
  isModalChitietSP,
  setIsModalChitietSP,
  quantity,
  setQuantity,
}) {
  const [chatLieus, setChatLieus] = useState([]);
  const [coAos, setCoAos] = useState([]);
  const [kichThuocs, setKichThuocs] = useState([]);
  const [mauSacs, setMauSacs] = useState([]);
  const [tayAos, setTayAos] = useState([]);
  const [thuongHieus, setThuongHieus] = useState([]);
  const [xuatXus, setXuatXus] = useState([]);
  const [indexSPCT, setIndexSPCT] = useState(0);
  const [HDCTRequest, setHDCTRequest] = useState({
    idHoaDon: null,
    idSPCT: null,
    soLuong: 1,
  });

  useEffect(() => {
    if (HDCTRequest.soLuong !== null && HDCTRequest.idSPCT) {
      const handleAddHDCT = async () => {
        if (HDCTRequest.soLuong === 0) {
          toast.warning("Số lượng bạn mua phải lớn hơn 0");
          return;
        }
        if (HDCTRequest.soLuong > 100000) {
          toast.warning("Vui lòng nhập số lượng hợp lệ");
          return;
        } else if (HDCTRequest.soLuong > spcts[indexSPCT].soLuong) {
          toast.warning(
            "Số lượng bạn nhập vượt quá số lượng sản phẩm có trong cửa hàng"
          );
          return;
        }
        try {
          await HoaDonService.ThemSPVaoGioHang(HDCTRequest);
          handleDaTa();
          toast.success("Đã Thêm sản phẩm vào giỏ hàng");
        } catch (err) {
          console.log("Lỗi khi gọi APi Thêm sản phẩm", err);
          toast.error("Thêm vào giỏ hàng thất bại. Vui lòng thử lại");
        }
      };
      handleAddHDCT();
    }
  }, [HDCTRequest]);

  const handleSetHDCTRequest = () => {
    if (!hoaDon) {
      toast.warning("Vui lòng tạo hóa đơn trước khi thêm sản phẩm.");
      return;
    }
    setHDCTRequest((prev) => ({
      ...prev,
      idHoaDon: hoaDon,
      idSPCT: spcts[indexSPCT]?.id,
      soLuong: Number(quantity),
    }));
    setIsModalChitietSP(false);
  };

  const handleGetIdSPCT = (i) => {
    setIsModalChitietSP(true);
    setIndexSPCT(i);
  };

  const selectInput = (label, options) => {
    return (
      <div className="flex flex-col space-y-1 w-1/3 p-4">
        <label
          htmlFor={label}
          className="text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <select
          id={label}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {options.map((option, index) => (
            <option key={index} value={option.tenChatLieu}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    );
  };

  if (!isOpen) {
    return;
  }
  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-5xl w-full">
        <button
          onClick={() => isClose(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h3 className="font-bold text-lg text-orange-600 text-center">
          Danh sách sản phẩm
        </h3>
        <div className="flex flex-1 p-4 mt-4">
          <input
            type="text"
            onChange={(e)=>{setSearch(e.target.value)}}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Tìm kiếm sản phẩm "
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-1">
            {selectInput("Chất liệu", chatLieus)}
            {selectInput("Kích cỡ", chatLieus)}
            {selectInput("Màu sắc", chatLieus)}
          </div>
          <div className="flex flex-1">
            {selectInput("Cổ áo", chatLieus)}
            {selectInput("Thương hiệu", chatLieus)}
            {selectInput("Tay áo", chatLieus)}
          </div>
        </div>
        <table className="table table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">STT</th>
              <th className="border p-2">Ảnh</th>
              <th className="border p-2">Tên</th>
              <th className="border p-2">Cổ áo</th>
              <th className="border p-2">Tay áo</th>
              <th className="border p-2">Chất liệu</th>
              <th className="border p-2">Số lượng</th>
              <th className="border p-2">Giá</th>
              <th className="border p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {spcts.map((spct, i)=>(
              <tr key={spct.id} className="hover:bg-gray-100 text-center">
                <td className="border p-2">{i+1}</td>
                <td className="border p-2 flex justify-center">
                  <img
                    className="skeleton w-[50px] h-[50px] object-cover"
                    src={spct.hinhAnh}
                    alt="Đây là ảnh SP"
                  />
                </td>
                <td className="border p-2">{spct.sanPham.tenSanPham}</td>
                <td className="border p-2">{spct.coAo.tenCoAo}</td>
                <td className="border p-2">{spct.tayAo.tenTayAo}</td>
                <td className="border p-2">{spct.chatLieu.tenChatLieu}</td>
                <td className="border p-2">{spct.soLuong}</td>
                <td className="border p-2">{
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(spct?.donGia)}</td>
                  <td className="border p-2">
                  <button
                    onClick={() => handleGetIdSPCT(i)}
                    className="btn bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Thêm
                  </button>
                </td>
              </tr>
            ))}
           
          </tbody>
        </table>
        <div className="flex justify-between mt-4 ">
          <select
            value={size}
            onChange={(e)=>setSize(e.target.value)}
            className="w-[90px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <ReactPaginate
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(e) => setPage(e.selected)}
            forcePage={page}
            containerClassName="flex justify-center items-center space-x-2"
            pageClassName="border border-gray-300 rounded"
            pageLinkClassName="px-3 py-1"
            activeClassName="bg-orange-500 text-white"
            previousClassName="border border-gray-300 rounded px-3 py-1"
            nextClassName="border border-gray-300 rounded px-3 py-1"
            disabledClassName="text-gray-300"
          />
        </div>
      </div>
      {isModalChitietSP && (
        <ModalSPCT spct={spcts[indexSPCT]}
        setIsModalChitietSP={setIsModalChitietSP}
        quantity={quantity}
        setQuantity={setQuantity}
        handleSetHDCTRequest={handleSetHDCTRequest}
        />
      )}
    </div>
  );
}
export default memo(AddProductModal)
