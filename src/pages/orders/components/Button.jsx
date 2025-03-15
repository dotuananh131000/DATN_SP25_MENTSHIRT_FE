import { Link } from "react-router-dom";

export default function Button({ setQrCodeScan }) {
  return (
    <div className="flex space-x-4">
      {/* Button Quét mã */}
      <button
        onClick={setQrCodeScan}
        className="btn text-base font-normal bg-orange-500 hover:bg-orange-600 text-white "
      >
        Quét mã
      </button>

      {/* Button Tạo Hóa Đơn */}
      <Link to="/admin/counterSale">
        <button className="btn text-base font-normal bg-orange-500 hover:bg-orange-600 text-white ">
          Tạo hóa đơn
        </button>
      </Link>
    </div>
  );
}
