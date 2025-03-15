import { useState } from "react";

export default function Filter() {
  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
    kieu: "",
    loai: "",
    trangThai: "",
  });
  return (
    <div className="flex mx-2 space-x-2">
      <select
        className="border border-orange-500 rounded-lg px-4 py-2 text-sm text-orange-500"
        value={filters.kieu}
        onChange={(e) => setFilters({ ...filters, kieu: e.target.value })}
      >
        <option value="">Kiểu</option>
        <option value="Cá nhân">Cá nhân</option>
        <option value="Công khai">Công khai</option>
      </select>
      <select
        className="border border-orange-500 rounded-lg px-4 py-2 text-sm text-orange-500"
        value={filters.loai}
        onChange={(e) => setFilters({ ...filters, loai: e.target.value })}
      >
        <option value="">Loại</option>
        <option value="10%">10%</option>
        <option value="100%">100%</option>
      </select>
      <select
        className="border border-orange-500 rounded-lg px-4 py-2 text-sm text-orange-500"
        value={filters.trangThai}
        onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
      >
        <option value="">Trạng thái</option>
        <option value="Đang diễn ra">Đang diễn ra</option>
        <option value="Hoàn thành">Hoàn thành</option>
      </select>
    </div>
  );
}
