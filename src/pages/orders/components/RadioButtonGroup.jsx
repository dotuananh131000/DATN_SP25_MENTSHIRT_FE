import { useEffect, useState } from "react";

export default function RadioButtonGroup({ value, onChange }) {
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    setSelectedValue(value); // Cập nhật khi giá trị thay đổi từ component cha
  }, [value]);

  const handleChange = (value) => {
    setSelectedValue(value);
    onChange(value); // Gửi giá trị lên component cha
    console.log(value);
  };
  return (
    <div className="flex space-x-4 ml-4 items-center mr-8">
      <span className="font-medium text-gray-700">Loại: </span>
      <div className="flex items-center space-x-2">
        <input
          id="all"
          type="radio"
          name="radio-4"
          className="radio border-2 border-orange-500 checked:bg-orange-500 checked:border-orange-500 transition duration-200"
          checked={selectedValue === null}
          onChange={() => handleChange(null)}
        />
        <label htmlFor="all" className="text-orange-500">
          Tất cả
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="onl"
          type="radio"
          name="radio-4"
          className="radio border-2 border-orange-500 checked:bg-orange-500 checked:border-orange-500 transition duration-200"
          checked={selectedValue === 0}
          onChange={() => handleChange(0)}
        />
        <label htmlFor="onl" className="text-orange-500">
          Online
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="off"
          type="radio"
          name="radio-4"
          className="radio border-2 border-orange-500 checked:bg-orange-500 checked:border-orange-500 transition duration-200"
          checked={selectedValue === 1}
          onChange={() => handleChange(1)}
        />
        <label htmlFor="off" className="text-orange-500 items-center">
          Tại quầy
        </label>
      </div>
    </div>
  );
}
