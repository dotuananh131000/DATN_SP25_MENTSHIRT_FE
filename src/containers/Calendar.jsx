import { FaCalendar, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
export default function Calendar({ startDate, endDate, onChange = () => {} }) {
  // const [startDate, setStartDate] = useState(null);
  // const [beginDate, setBeginDate] = useState(null);

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : null;

  return (
    <div className="flex">
      <div className="flex items-center border border-orange-500 rounded-lg px-4 py-1 shadow-sm w-41">
        <DatePicker
          selected={startDate}
          onChange={(date) =>
            onChange({ start: formatDate(date), end: formatDate(endDate) })
          }
          placeholderText="Từ ngày"
          dateFormat="dd/MM/yyyy"
          className="flex-1 outline-none placeholder-gray-400 text-gray-700"
        />

        {/* Icon lịch */}
        <FaCalendarAlt className="text-orange-400 w-5 h-5 ml-2" />
      </div>

      <div className="flex items-center border border-orange-500 rounded-lg ml-5 px-4 py-1 shadow-sm w-64">
        <DatePicker
          selected={endDate}
          onChange={(date) =>
            onChange({ start: formatDate(startDate), end: formatDate(date) })
          }
          placeholderText="Đến Ngày"
          dateFormat="dd/MM/yyyy"
          className="flex-1 outline-none placeholder-gray-400 text-gray-700"
        />

        {/* Icon lịch */}
        <FaCalendarAlt className="text-orange-400 w-5 h-5 ml-2" />
      </div>
    </div>
  );
}
