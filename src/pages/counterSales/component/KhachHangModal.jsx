import { AiOutlineCheck } from "react-icons/ai";
export default function KhachHangModal({
  khList,
  isClose,
  handleUpdateKhOfHd,
}) {
  const handleIdKH = (id) => {
    handleUpdateKhOfHd(id);
    isClose(false);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-5xl w-full">
        <h1>Chọn khách hàng</h1>
        <button
          onClick={() => isClose(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng theo mã hoặc tên"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 "
        />
        <table className="table table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">Ảnh</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Họ tên</th>
              <th className="px-4 py-2">Ngày sinh</th>
              <th className="px-4 py-2">Số điện thoại</th>
              <th className="px-4 py-2">Giới tính</th>
              <th className="px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {khList.map((kh, i) => (
              <tr key={kh.id} className="hover:bg-gray-100 text-center">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={kh?.hinhAnh}
                    alt="Đây là ảnh KH"
                    className="skeleton w-10 h-10 object-cover"
                  />
                </td>
                <td className="px-4 py-2">{kh.email}</td>
                <td className="px-4 py-2">{kh.tenKH}</td>
                <td className="px-4 py-2">{kh.ngaySinh}</td>
                <td className="px-4 py-2">{kh.soDienThoai}</td>
                <td className="px-4 py-2">
                  {kh.gioiTinh === 1 ? "Nữ" : "Nam"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleIdKH(kh.id)}
                    className="btn bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <AiOutlineCheck />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
