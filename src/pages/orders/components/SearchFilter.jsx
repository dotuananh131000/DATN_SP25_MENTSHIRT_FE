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
      <div className="flex justify-between space-x-4">
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
          className="btn text-base font-normal bg-orange-500 hover:bg-orange-600 text-white "
        >
          Export Excel
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;
