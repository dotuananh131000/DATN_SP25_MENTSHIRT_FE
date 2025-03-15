import { useEffect, useState } from "react";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import voucherService from "../../services/VouchersService";
import SearchFilter from "./components/SearchFilter";

export default function Discount() {
  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
    kieu: "",
    loai: "",
    trangThai: "",
  });

  const [vouchers, setVoucher] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await voucherService.getAllVouchers();
        setVoucher(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-2">Phiếu giảm giá</h1>
      <SearchFilter />
      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <TableHeader />
          <tbody>
            {vouchers.map((item, index) => (
              <TableRow key={index} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
