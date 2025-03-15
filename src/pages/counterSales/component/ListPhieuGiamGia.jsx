import { AiOutlineCheck } from "react-icons/ai";
export default function ListPhieuGiamGia({
  pggPublic,
  pggkh,
  isClose,
  billToday,
  selectedTab,
}) {
  const btnChoose = (tienToiThieu) => {
    if (billToday[selectedTab]?.tongTien >= tienToiThieu) {
      return (
        <td className="text-center ">
          <button className="btn text-orange-500 bg-white shadow-none border-none ">
            <AiOutlineCheck />
          </button>
        </td>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box relative max-w-5xl w-[600px]">
          <h1>Danh sách phiếu giảm giá</h1>
          <button
            onClick={isClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            ✖
          </button>
          <input
            type="text"
            placeholder="Tìm kiếm phiếu giảm giá theo mã"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 "
          />
          <h1 className="text-center font-sans text-orange-500 mt-4">
            Cá nhân
          </h1>

          <table className="table">
            <thead>
              <tr>
                <th className="w-1/4 px-2 py-4 text-center">
                  Mã phiếu giảm giá
                </th>
                <th className="w-2/4 px-2 py-4 text-center">Thông tin</th>
                <th className="w-1/4 px-2 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pggkh.map((pgg) => (
                <tr key={pgg.id}>
                  <td>{pgg.maPGG}</td>
                  <td>
                    <h1 className="font-sans text-orange-500">
                      Phiếu giảm giá: {pgg.tenPhieuGiamGia}
                    </h1>
                    <p className="font-sans">
                      Giá trị:
                      {pgg.hinhThucGiamGia === 0
                        ? ` ${pgg.giaTriGiam}%`
                        : new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(pgg?.giaTriGiam)}
                    </p>
                    <p className="font-sans">
                      Số tiền tối thiểu của hóa đơn:
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(pgg.soTienToiThieu)}
                    </p>
                    <p className="font-sans">
                      Giảm tối đa:
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(pgg.soTienToiDa)}
                    </p>
                    <p className="font-sans">
                      Ngày kết thúc:
                      {new Date(pgg.ngayKetThuc).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  {btnChoose(pgg.soTienToiThieu)}
                </tr>
              ))}
            </tbody>
          </table>
          <h1 className="text-center font-sans text-orange-500 mt-4">
            Công khai
          </h1>
          <table className="table">
            <thead>
              <tr>
                <th className="w-1/4 px-2 py-4 text-center">
                  Mã phiếu giảm giá
                </th>
                <th className="w-2/4 px-2 py-4 text-center">Thông tin</th>
                <th className="w-1/4 px-2 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pggPublic.map((pgg) => (
                <tr key={pgg.id}>
                  <td className="text-center font-sans">
                    {pgg.maPhieuGiamGia}
                  </td>
                  <td>
                    <h1 className="font-sans text-orange-500">
                      Phiếu giảm giá: {pgg.tenPhieuGiamGia}
                    </h1>
                    <p className="font-sans">
                      Giá trị:
                      {pgg.hinhThucGiamGia === 0
                        ? ` ${pgg.giaTriGiam}%`
                        : new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(pgg?.giaTriGiam)}
                    </p>
                    <p className="font-sans">
                      Số tiền tối thiểu của hóa đơn:
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(pgg.soTienToiThieuHd)}
                    </p>
                    <p className="font-sans">
                      Giảm tối đa:
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(pgg.soTienGiamToiDa)}
                    </p>
                    <p className="font-sans">
                      Ngày kết thúc:
                      {new Date(pgg.thoiGianHetHan).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  {btnChoose(pgg.soTienToiThieuHd)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
