import { Link } from "react-router-dom";

export default function Button({ setQrCodeScan }) {
  return (
    <div className="">
      {/* Button Quét mã */}
      <button
        onClick={setQrCodeScan}
        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 mr-4"
      >
        Quét mã
      </button>

      {/* Button Tạo Hóa Đơn */}
      <Link to="/admin/pointOfSales">
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600">
          Tạo hóa đơn
        </button>
      </Link>
    </div>
  );
}
