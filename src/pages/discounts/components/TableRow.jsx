export default function TableRow({ item }) {
  console.log(item);
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 border">{item.id}</td>
      <td className="px-4 py-2 border">{item.maPhieuGiamGia}</td>
      <td className="px-4 py-2 border">{item.tenPhieuGiamGia}</td>
      <td className="px-4 py-2 border">
        <span
          className={`px-2 py-1 rounded-lg ${
            item.hinhThucPhieuGiamGia === 1
              ? "bg-blue-100 text-blue-600"
              : "bg-pink-100 text-pink-600"
          }`}
        >
          {item.hinhThucPhieuGiamGia == 1 ? "Công Khai" : "Cá Nhân"}
        </span>
      </td>
      <td className="px-4 py-2 border">
        {item.loaiGiam == 1 ? item.giaTriGiam + " đ" : item.giaTriGiam + " %"}
      </td>
      <td className="px-4 py-2 border">{item.soLuong}</td>
      <td className="px-4 py-2 border">{item.thoiGianApDung}</td>
      <td className="px-4 py-2 border">{item.thoiGianHetHan}</td>
      <td className="px-4 py-2 border">
        <span className="text-green-500">
          {item.trangThai == 1
            ? "Đang Diễn Ra"
            : item.trangThai == 2
              ? "Chưa Diễn Ra"
              : "Kết Thúc"}
        </span>
      </td>
      <td className="px-4 py-2 border">
        <button className="text-orange-500 hover:underline">Xem</button>
      </td>
    </tr>
  );
}
