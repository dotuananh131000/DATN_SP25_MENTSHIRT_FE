import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Select from 'react-select';
import HoaDonService from "../service/HoaDonService";
import { toast } from "react-toastify";

export default function AddProduct({
  isOpen,
  closeModalProduct,
  hoaDon,
  spcts,
  handleDaTa,
  totalPages,
  page,
  setPage,
  size,
  setSize,
  setSearch,
  thuongHieus,
  xuatXus,
  chatLieus,
  coAos,
  tayAos,
  mauSacs,
  kichThuocs,
  handleFilterChange,
  resetFilters
}) {
  const [indexSPCT, setIndexSPCT] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [HDCTRequest, setHDCTRequest] = useState({
    idHoaDon: null,
    idSPCT: null,
    soLuong: 0,
  });

  const [isModalChitietSP, setIsModalChitietSP] = useState(false);

  useEffect(() => {
    if (
      HDCTRequest.soLuong !== null &&
      HDCTRequest.idSPCT &&
      HDCTRequest.idHoaDon !== null
    ) {
      const handleAddHDCT = async () => {
        if (HDCTRequest.soLuong === 0) {
          toast.warning("Số lượng bạn mua phải lớn hơn 0");
          return;
        }
        let thanhTien = HDCTRequest.soLuong * spcts[indexSPCT].donGia;
        if (thanhTien > 50000000) {
          console.log(thanhTien);
          toast.pause("Số tiền quá lớn. Liên hệ chủ cửa hàng để xác thực");
        }
        if (HDCTRequest.soLuong > 100000) {
          toast.warning(
            "Số lượng quá lớn. Liên hệ chủ cửa hàng để thưc hiện loại giao dịch khác !"
          );
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
    setHDCTRequest((prev) => ({
      ...prev,
      idHoaDon: hoaDon?.id,
      idSPCT: spcts[indexSPCT]?.id,
      soLuong: Number(quantity),
    }));
    setIsModalChitietSP(false);
  };

  const handleGetIdSPCT = (i) => {
    setIsModalChitietSP(true);
    setIndexSPCT(i);
  };

  const handleClose =()=>{
    closeModalProduct(false);
    resetFilters();
  }

  if (!isOpen) return null;

  // console.log();
  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-5xl w-full">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h3 className="font-bold text-lg text-orange-600 text-center">
          Danh sách sản phẩm
        </h3>
        <div className="flex flex-1 my-4">
          <input
            type="text"
            onChange={(e)=>{setSearch(e.target.value)}}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Tìm kiếm sản phẩm "
          />
        </div>
        <div className="grid grid-cols-4 gap-3 ">
                <div>
                    <label className="block text-xs font-medium text-gray-700">Thương hiệu</label>
                    <Select
                        name="thuongHieuId"
                        options={thuongHieus.map(th => ({ value: th.id, label: th.tenThuongHieu }))}
                        isMulti
                        onChange={selectedOptions => handleFilterChange("thuongHieuIds", selectedOptions)}
                        className="text-xs"
                        placeholder="Chọn thương hiệu"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Xuất xứ</label>
                    <Select
                        name="xuatXuId"
                        options={xuatXus.map(x => ({ value: x.id, label: x.tenXuatXu }))}
                        isMulti
                        onChange={selectedOptions => handleFilterChange("xuatXuIds", selectedOptions)}
                        className="text-xs"
                        placeholder="Chọn xuất xứ"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Chất liệu</label>
                    <Select
                        name="chatLieuId"
                        options={chatLieus.map(c => ({ value: c.id, label: c.tenChatLieu }))}
                        isMulti
                        onChange={selectedOptions => handleFilterChange("chatLieuIds", selectedOptions)}
                        className="text-xs"
                        placeholder="Chọn chất liệu"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Cổ áo</label>
                    <Select
                        name="coAoId"
                        options={coAos.map(c => ({ value: c.id, label: c.tenCoAo }))}
                        isMulti
                        onChange={selectedOptions => handleFilterChange("coAoIds", selectedOptions)}
                        className="text-xs"
                        placeholder="Chọn kiểu cổ áo"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Tay áo</label>
                    <Select
                        name="tayAoId"
                        options={tayAos.map(t => ({ value: t.id, label: t.tenTayAo }))}
                        isMulti
                        onChange={selectedOptions => handleFilterChange("tayAoIds", selectedOptions)}
                        className="text-xs"
                        placeholder="Chọn kiểu tay áo"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Màu sắc</label>
                    <Select
                        name="mauSacId"
                        options={mauSacs.map(m => ({ value: m.id, label: m.tenMauSac }))}
                        isMulti
                        onChange={selectedOptions => handleFilterChange("mauSacIds", selectedOptions)}
                        className="text-xs"
                        placeholder="Chọn màu sắc"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Kích thước</label>
                    <Select
                        name="kichThuocId"
                        options={kichThuocs.map(k => ({ value: k.id, label: k.tenKichThuoc }))}
                        isMulti
                        onChange={selectedOptions => handleFilterChange("kichThuocIds", selectedOptions)}
                        className="text-xs"
                        placeholder="Chọn kích thước"
                    />
                </div>
        </div>
        <table className="table table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">STT</th>
              <th className="border p-2">Ảnh</th>
              <th className="border p-2">Tên</th>
              <th className="border p-2">Màu sắc</th>
              <th className="border p-2">Kích thước</th>
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
                <td className="border p-2">{spct.mauSac.tenMauSac}</td>
                <td className="border p-2">{spct.kichThuoc.tenKichThuoc}</td>
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
        <div className="modal modal-open">
          <div className="modal-box relative h-[310px]">
            <h1 className="text-sm text-red-500 text-left font-bold mb-4">
              Chi tiết sản phẩm
            </h1>
            <button
              onClick={() => setIsModalChitietSP(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>

            <div className="flex space-x-4">
              <img
                className="w-[160px] h-[180px] object-cover rounded-lg"
                src={spcts[indexSPCT]?.hinhAnh}
                alt="Đây là ảnh sản phẩm"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  {spcts[indexSPCT]?.tenSanPham}
                  <br />[{spcts[indexSPCT]?.tenMauSac} -
                  {spcts[indexSPCT]?.tenKichThuoc}]
                </h1>
                <p className="my-4">
                  Giá:{" "}
                  <strong className="text-red-500 ">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(spcts[indexSPCT]?.donGia)}
                  </strong>
                </p>
                <div className="flex flex-wrap align-center">
                  <p className="w-1/3 px-2 py-2">Số lượng :</p>
                  <input
                    type="number"
                    className="w-2/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 "
                    min={1}
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(Number(e.target.value));
                    }}
                  />
                </div>
                <div className="flex flex-1 mt-4">
                  <div className="w-full"></div>
                  <button
                    onClick={() => handleSetHDCTRequest()}
                    className="btn bg-orange-500 hover:bg-orange-600 text-white w-1/3"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
