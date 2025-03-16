function ModalSPCT({spct, setIsModalChitietSP,quantity, setQuantity, handleSetHDCTRequest }){
    return <>
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
          className="skeleton w-[160px] h-[180px] object-cover rounded-lg"
          src={spct?.hinhAnh}
          alt="Đây là ảnh sản phẩm"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {spct?.sanPham.tenSanPham}
            <br />[{spct?.mauSac.tenMauSac} -
            {spct?.kichThuoc.tenKichThuoc}]
          </h1>
          <p className="my-4">
            Giá:{" "}
            <strong className="text-red-500 ">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(spct?.donGia)}
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
  </div></>
}
export default ModalSPCT