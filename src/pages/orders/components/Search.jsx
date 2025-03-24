import { useState } from "react";

export default function Search({ onChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    onChange(inputValue); // Gửi dữ liệu khi nhấn nút "Tìm kiếm"
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Gửi dữ liệu khi nhấn "Enter"
    }
  };
  return (
    <div className="flex items-center bg-white border border-orange-500 rounded-lg pr-4  shadow-sm w-32rem max-w-full">
      {/* Button */}
      <button
        onClick={handleSearch}
        className="bg-orange-500 m-1 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
      >
        Tìm kiếm
      </button>

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tìm kiếm hóa đơn...."
        className="flex-1 outline-none placeholder-gray-400 text-gray-700"
      />
    </div>
  );
}
