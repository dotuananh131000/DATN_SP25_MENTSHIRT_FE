import { useState } from "react";
import Calendar from "../../../containers/Calendar";

import Button from "./Button";
import RadioButtonGroup from "./RadioButtonGroup";
import Search from "./Search";

function SearchFilter({ value, onChange, setQrCodeScan, onExport }) {
  const handleSearch = (keyword) => {
    onChange({ ...value, keyword }); // Chỉ cập nhật keyword khi nhấn nút
    // console.log(keyword);
  };
  return (
    <div className="bg-white px-4 py-4 mb-4 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <Search onChange={handleSearch} />
        <Button setQrCodeScan={setQrCodeScan} />
      </div>
      <div className="flex pt-3">
        <Calendar
          startDate={value.ngayBatDau}
          endDate={value.ngayKetThuc}
          onChange={(dates) =>
            onChange({
              ...value,
              ngayBatDau: dates.start,
              ngayKetThuc: dates.end,
            })
          }
        />
        <RadioButtonGroup
          value={value.loaiDon}
          onChange={(loaiDon) => onChange({ ...value, loaiDon })}
        />
        <button
          onClick={onExport}
          className="bg-orange-500 m-1 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 "
        >
          Export Excel
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;
