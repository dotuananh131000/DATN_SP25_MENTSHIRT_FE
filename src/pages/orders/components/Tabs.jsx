import { useEffect, useState } from "react";

export default function Tabs({ value, onChange, orderCounts }) {
  const [trangThai, setTrangThai] = useState(0);

  useEffect(() => {
    setTrangThai(value.trangThai || 0);
  }, [value.trangThai]);

  const getTodayDateRange = () => {
    const today = new Date();
    const startOfDay = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const endOfDay = startOfDay; // lấy YYYY-MM-DD vì chỉ cần hiển thị ngày
    return { ngayBatDau: startOfDay, ngayKetThuc: endOfDay };
  };

  const handleClick = (id) => {
    setTrangThai(id);
    const { ngayBatDau, ngayKetThuc } =
      value.ngayBatDau && value.ngayKetThuc ? value : getTodayDateRange();

    onChange({
      ...value,
      trangThai: id === 0 ? null : id,
      ngayBatDau,
      ngayKetThuc,
    });
  };
  const tabs = [
    { id: 0, label: "TẤT CẢ", key: "tong" },
    { id: 1, label: "Chờ Xác Nhận", key: "cho_xac_nhan" },
    { id: 2, label: "Xác Nhận", key: "xac_nhan" },
    { id: 3, label: "Chờ Vận Chuyển", key: "cho_van_chuyen" },
    { id: 4, label: "Vận Chuyển", key: "van_chuyen" },
    { id: 5, label: "Thành Công", key: "thanh_cong" },
    { id: 6, label: "Hoàn Hàng", key: "hoan_hang" },
    { id: 7, label: "Đã Hủy", key: "da_huy" },
  ];
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <ul className="flex border-b">
        {tabs.map((tab) => (
          <li
            onClick={() => handleClick(tab.id)}
            key={tab.id}
            className={`mr-4 pb-2 ${
              tab.id === trangThai
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            } cursor-pointer indicator`}
          >
            {tab.label}
            {orderCounts[tab.key] > 0 && (
              <span className="indicator-item badge badge-error text-white">
                {orderCounts[tab.key]}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
