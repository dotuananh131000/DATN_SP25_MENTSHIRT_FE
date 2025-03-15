import { useEffect, useState } from "react";
import BillStatusPieChart from "./component/BillStatusPieChart";
import TodayService from "./services/ToDayService";
import Week from "./services/Week";
import Month from "./services/Month";
import Year from "./services/Year";
import ThongKeService from "./services/ThongKeService";
import ReactPaginate from "react-paginate";
import dayjs from "dayjs";
import { FaCalendarDay } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";

export default function Statistic() {
  const [selectedTime, setSelectedTime] = useState(1);
  const [homNay, setHomNay] = useState({
    doanhThu: 0,
    soLuongSP: 0,
    hoaDon: 0,
  });

  const [trongTuan, setTrongTuan] = useState({
    doanhThu: 0,
    soLuongSP: 0,
    hoaDon: 0,
  });

  const [trongThang, setTrongThang] = useState({
    doanhThu: 0,
    soLuongSP: 0,
    hoaDon: 0,
  });

  const [trongNam, setTrongNam] = useState({
    doanhThu: 0,
    soLuongSP: 0,
    hoaDon: 0,
  });
  const [listTopSelling, setListTopSelling] = useState([]);
  const [listSPGanHet, setListSPGanHet] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPages2, setTotalPages2] = useState(0);
  const [ngayBatDau, setNgayBatDau] = useState(dayjs().format("DD/MM/YYYY"));
  const [ngayKetThuc, setNgayKetThuc] = useState(dayjs().format("DD/MM/YYYY"));
  const [trangthaiDonHang, setTrangThaiDonHang] = useState({});

  const fetchTopSelling = async () => {
    try {
      const response = await ThongKeService.TopSelling(currentPage);
      setListTopSelling(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log("Không thể lấy được top danh sách sản phẩm bán chạy");
    }
  };
  const fetchSanPhamGanHet = async () => {
    try {
      const response = await ThongKeService.SanPhamGanHet(currentPage2);
      setListSPGanHet(response.content);
      setTotalPages2(response.totalPages);
    } catch (error) {
      console.log("Không thể lấy được top danh sách sản phẩm bán chạy");
    }
  };

  // const handleSetTime = (time) => {
  //   setSelectedTime(time);
  //   if (time === 1) {
  //     setNgayBatDau(dayjs().format("DD/MM/YYYY"));
  //     setNgayKetThuc(dayjs().format("DD/MM/YYYY"));
  //   } else if (time === 2) {
  //     setNgayBatDau(dayjs().startOf("week").format("DD/MM/YYYY"));
  //     setNgayKetThuc(dayjs().endOf("week").format("DD/MM/YYYY"));
  //   } else if (time === 3) {
  //     setNgayBatDau(dayjs().startOf("month").format("DD/MM/YYYY"));
  //     setNgayKetThuc(dayjs().endOf("month").format("DD/MM/YYYY"));
  //   } else if (time === 4) {
  //     setNgayBatDau(dayjs().startOf("year").format("DD/MM/YYYY"));
  //     setNgayKetThuc(dayjs().endOf("year").format("DD/MM/YYYY"));
  //   }

  //   fetchCountDonHang();
  // };
  const fetchCountDonHang = async () => {
    try {
      const response = await ThongKeService.countDonHang(
        ngayBatDau,
        ngayKetThuc
      );
      setTrangThaiDonHang(response);
    } catch (error) {
      console.log("Không thể lấy được số lượng trạng thái đơn hàng", error);
    }
  };

  useEffect(() => {
    fetchTopSelling();
  }, [currentPage]);

  useEffect(() => {
    fetchSanPhamGanHet();
  }, [currentPage2]);

  useEffect(() => {
    if (selectedTime === 1) {
      setNgayBatDau(dayjs().format("DD/MM/YYYY"));
      setNgayKetThuc(dayjs().format("DD/MM/YYYY"));
    } else if (selectedTime === 2) {
      setNgayBatDau(dayjs().startOf("week").format("DD/MM/YYYY"));
      setNgayKetThuc(dayjs().endOf("week").format("DD/MM/YYYY"));
    } else if (selectedTime === 3) {
      setNgayBatDau(dayjs().startOf("month").format("DD/MM/YYYY"));
      setNgayKetThuc(dayjs().endOf("month").format("DD/MM/YYYY"));
    } else if (selectedTime === 4) {
      setNgayBatDau(dayjs().startOf("year").format("DD/MM/YYYY"));
      setNgayKetThuc(dayjs().endOf("year").format("DD/MM/YYYY"));
    }
    // console.log(ngayBatDau, ngayKetThuc);
    fetchCountDonHang();
  }, [selectedTime, ngayBatDau, ngayKetThuc]);

  const fetchDoanhThuHomNay = async () => {
    try {
      const response = await TodayService.doanThuHomNay();
      setHomNay((preState) => ({
        ...preState,
        doanhThu: response || 0,
      }));
    } catch (error) {
      console.log("Không thể lấy được doanh thu hôm này", error);
    }
  };

  const fetchSoLuongSPHomNay = async () => {
    try {
      const response = await TodayService.soLuongSanPham();
      setHomNay((preState) => ({
        ...preState,
        soLuongSP: response,
      }));
    } catch (error) {
      console.log("Không thể lấy được số lượng sản phẩm đã bán hôm này", error);
    }
  };

  const fetchSoLuongHDHomNay = async () => {
    try {
      const response = await TodayService.soLuongHoaDon();
      setHomNay((preState) => ({
        ...preState,
        hoaDon: response,
      }));
    } catch (error) {
      console.log("Không thể lấy được sô lượng hóa đơn hôm này", error);
    }
  };

  const fecthDoanhThuTrongTuan = async () => {
    try {
      const response = await Week.DoanhThuTrongTuan();
      setTrongTuan((preState) => ({
        ...preState,
        doanhThu: response || 0,
      }));
    } catch (error) {
      console.log("Không thể lấy được doanh thu trong tuần ", error);
    }
  };

  const fecthSoLuongDaBanTrongTuan = async () => {
    try {
      const response = await Week.SoLuongSPDaBanTrongTuan();
      setTrongTuan((preState) => ({
        ...preState,
        soLuongSP: response || 0,
      }));
    } catch (error) {
      console.log(
        "Không thể lấy được số lượng sản phẩm đã bán trong tuần ",
        error
      );
    }
  };

  const fecthSoLuongHDTrongTuan = async () => {
    try {
      const response = await Week.SoLuongHoaDonTrongTuan();
      setTrongTuan((preState) => ({
        ...preState,
        hoaDon: response || 0,
      }));
    } catch (error) {
      console.log(
        "Không thể lấy được số lượng hóa đơn đã tạo trong tuần ",
        error
      );
    }
  };

  const fecthDoanhThuTrongThang = async () => {
    try {
      const response = await Month.DoanhThuTrongThang();
      setTrongThang((preState) => ({
        ...preState,
        doanhThu: response || 0,
      }));
    } catch (error) {
      console.log("Không thể lấy được doanh thu trong tháng ", error);
    }
  };

  const fecthSoLuongDaBanTrongThang = async () => {
    try {
      const response = await Month.SoLuongSPDaBanTrongThang();
      setTrongThang((preState) => ({
        ...preState,
        soLuongSP: response || 0,
      }));
    } catch (error) {
      console.log(
        "Không thể lấy được số lượng sản phẩm đã bán trong tháng ",
        error
      );
    }
  };

  const fecthSoLuongHDTrongThang = async () => {
    try {
      const response = await Month.SoLuongHoaDonTrongThang();
      setTrongThang((preState) => ({
        ...preState,
        hoaDon: response || 0,
      }));
    } catch (error) {
      console.log(
        "Không thể lấy được số lượng hóa đơn đã tạo trong tháng ",
        error
      );
    }
  };

  const fecthDoanhThuTrongNam = async () => {
    try {
      const response = await Year.DoanhThuTrongnam();
      setTrongNam((preState) => ({
        ...preState,
        doanhThu: response || 0,
      }));
    } catch (error) {
      console.log("Không thể lấy được doanh thu trong năm ", error);
    }
  };

  const fecthSoLuongDaBanTrongNam = async () => {
    try {
      const response = await Year.SoLuongSPDaBanTrongNam();
      setTrongNam((preState) => ({
        ...preState,
        soLuongSP: response || 0,
      }));
    } catch (error) {
      console.log(
        "Không thể lấy được số lượng sản phẩm đã bán trong năm ",
        error
      );
    }
  };

  const fecthSoLuongHDTrongNam = async () => {
    try {
      const response = await Year.SoLuongHoaDonTrongNam();
      setTrongNam((preState) => ({
        ...preState,
        hoaDon: response || 0,
      }));
    } catch (error) {
      console.log(
        "Không thể lấy được số lượng hóa đơn đã tạo trong năm ",
        error
      );
    }
  };

  useEffect(() => {
    fetchDoanhThuHomNay();
    fetchSoLuongSPHomNay();
    fetchSoLuongHDHomNay();
    fecthDoanhThuTrongTuan();
    fecthSoLuongDaBanTrongTuan();
    fecthSoLuongHDTrongTuan();
    fecthDoanhThuTrongThang();
    fecthSoLuongDaBanTrongThang();
    fecthSoLuongHDTrongThang();
    fecthDoanhThuTrongNam();
    fecthSoLuongDaBanTrongNam();
    fecthSoLuongHDTrongNam();
  }, []);

  // console.log(trangthaiDonHang);
  // console.log(selectedTime);
  // console.log(ngayBatDau);
  // console.log(ngayKetThuc);
  const componentTime = (title, object) => {
    return (
      <div
        className={`bg-white p-4 w-[500px] h-[190px] border shadow rounded-lg text-center cursor-pointer`}
      >
        <h1 className="text-2xl font-bold text-gray-700">{title}</h1>
        <div className="flex space-x-2 justify-center items-center mt-3">
          <h1 className="text-sm font-sans">Doanh thu đơn hàng:</h1>
          <h1 className="text-sm font-sans">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(object.doanhThu)}
          </h1>
        </div>
        <div className="flex space-x-2 justify-center items-center mt-2">
          <h1 className="text-sm font-sans">Số sản phẩm đã bán:</h1>
          <h1 className="text-sm font-sans">{object.soLuongSP || 0}</h1>
        </div>
        <div className="flex space-x-2 justify-center items-center mt-2">
          <h1 className="text-sm font-sans">Tổng số hóa đơn đã tạo:</h1>
          <h1 className="text-sm font-sans">{object.hoaDon}</h1>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Thống kê</h1>

      <div className="bg-white py-6 rounded">
        <div className="flex space-x-4 justify-center">
          {componentTime("Hôm nay", homNay)}
          {componentTime("Trong tuần", trongTuan)}
        </div>
        <div className="flex space-x-4 justify-center mt-4">
          {componentTime("Trong tháng", trongThang)}
          {componentTime("Năm nay", trongNam)}
        </div>
      </div>
      <div className="bg-white rounded-lg p-2 mt-2">
        <div className="flex flex-1 items-center p-2">
          <div className="w-1/2"></div>
          <div className="flex space-x-4 ">
            <button className="btn text-white bg-orange-500 hover:bg-orange-600">
              Xuất Excel
            </button>
            <div className={`flex items-center `}>
              <h1 className="px-4 py-2 bg-orange-500 text-white rounded">
                Bộ lọc
              </h1>
              <button
                onClick={() => setSelectedTime(1)}
                className={`px-4 py-2 mx-1 rounded ${selectedTime === 1 ? "bg-orange-500 text-white" : ""}`}
              >
                Ngày
              </button>
              <button
                onClick={() => setSelectedTime(2)}
                className={`px-4 py-2 mx-1 rounded ${selectedTime === 2 ? "bg-orange-500 text-white" : ""}`}
              >
                Tuần
              </button>
              <button
                onClick={() => setSelectedTime(3)}
                className={`px-4 py-2 mx-1 rounded ${selectedTime === 3 ? "bg-orange-500 text-white" : ""}`}
              >
                Tháng
              </button>
              <button
                onClick={() => setSelectedTime(4)}
                className={`px-4 py-2 mx-1 rounded ${selectedTime === 4 ? "bg-orange-500 text-white" : ""}`}
              >
                Năm
              </button>
            </div>
          </div>
        </div>
        {/* {Phần lọc} */}
        <div className="flex space-x-6 flex-1 px-2 mt-2">
          <div className="w-1/2">
            <div className=" border rounded-lg shadow px-2 min-h-[650px] relative ">
              <h1 className="text-xl text-gray-500 font-semibold text-center mt-4">
                Top Sản Phẩm Bán Chạy Tháng này
              </h1>
              <table className="table rounded mt-4 w-full">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="px-4 py-2 text-center">STT</th>
                    <th className="px-4 py-2 text-center">Ảnh</th>
                    <th className="px-4 py-2 text-center">Tên SP</th>
                    <th className="px-4 py-2 text-center">SL đã bán</th>
                    <th className="px-4 py-2 text-center">Giá Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {listTopSelling.map((sp, i) => (
                    <tr key={i}>
                      <td className="text-center">{currentPage * 5 + i + 1}</td>
                      <td className="text-center px-4 py-2">
                        <img
                          className="skeleton w-[80px] h-[80px] object-cover"
                          src={sp.anh}
                          alt="Đây là ảnh SP"
                        />
                      </td>
                      <td className="text-center px-4 py-2">
                        <h1>{sp?.tenSanPham}</h1>
                        <p>{`[${sp?.mauSac} - ${sp?.kichThuoc}]`}</p>
                      </td>
                      <td className="text-center px-4 py-2">{sp?.soLuong}</td>
                      <td className="text-center px-4 py-2">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(sp?.giaBan)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="absolute bottom-2 right-5">
                <ReactPaginate
                  previousLabel="<"
                  nextLabel=">"
                  breakLabel="..."
                  pageCount={totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={(e) => setCurrentPage(e.selected)}
                  forcePage={currentPage}
                  containerClassName="flex justify-center items-center space-x-2"
                  pageClassName="rounded"
                  pageLinkClassName="p-3 text-gray-700"
                  activeClassName="bg-orange-500 text-white"
                  previousClassName=""
                  nextClassName=""
                  disabledClassName="text-gray-300"
                />
              </div>
            </div>
            <div className=" border rounded-lg shadow px-2 min-h-[650px] mt-4 relative">
              <h1 className="text-xl text-gray-500 font-semibold text-center mt-4">
                Sản phẩm sắp hết hàng
              </h1>
              <table className="table rounded mt-4 w-full">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="px-4 py-2 text-center">STT</th>
                    <th className="px-4 py-2 text-center">Ảnh</th>
                    <th className="px-4 py-2 text-center">Tên SP</th>
                    <th className="px-4 py-2 text-center">Giá bán</th>
                    <th className="px-4 py-2 text-center">Số lượng còn lại</th>
                  </tr>
                </thead>
                <tbody>
                  {listSPGanHet.map((sp, i) => (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="text-center px-4 py-2">
                        <img
                          className="skeleton w-[80px] h-[80px] object-cover"
                          src={sp.anh}
                          alt="Đây là ảnh SP"
                        />
                      </td>
                      <td className="text-center px-4 py-2">
                        <h1>{sp?.tenSanPham}</h1>
                        <p>{`[${sp?.mauSac} - ${sp?.kichThuoc}]`}</p>
                      </td>
                      <td className="text-center px-4 py-2">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(sp?.giaBan)}
                      </td>
                      <td className="text-center px-4 py-2">{sp?.soLuong}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="absolute bottom-2 right-5">
                <ReactPaginate
                  previousLabel="<"
                  nextLabel=">"
                  breakLabel="..."
                  pageCount={totalPages2}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={(e) => setCurrentPage2(e.selected)}
                  forcePage={currentPage2}
                  containerClassName="flex justify-center items-center space-x-2"
                  pageClassName="rounded"
                  pageLinkClassName="p-3 text-gray-700"
                  activeClassName="bg-orange-500 text-white"
                  previousClassName=""
                  nextClassName=""
                  disabledClassName="text-gray-300"
                />
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <div className=" border rounded-lg shadow px-2 h-[420px]">
              <h1 className="text-xl text-gray-500 font-semibold text-center mt-4">
                Trạng Thái Đơn Hàng Hôm Nay
              </h1>
              <div className="mt-4">
                <BillStatusPieChart ttdh={trangthaiDonHang} />
              </div>
            </div>
            {/* Phần biểu đồ */}
            <div className=" border rounded-lg shadow px-4 mt-4 ">
              <h1 className="text-xl text-gray-500 font-semibold text-center mt-4">
                Tốc Độ Tăng Trưởng Cửa Hàng
              </h1>
              <div className="bg-white flex flex-1 border shadow my-4 rounded-lg w-full h-[90px]">
                <div className="flex justify-between items-center px-2 w-2/3">
                  <h1 className="pl-4 text-xl text-orange-500">
                    <FaCalendarDay />
                  </h1>
                  <h1 className="font-sans">Doanh thu tháng</h1>
                  <h1 className="font-sans">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(trongThang?.doanhThu)}
                  </h1>
                </div>
                <div className="w-1/3 flex justify-center items-center">
                  <p className="text-xl text-orange-500 text-center">
                    <BsGraphUpArrow />
                  </p>
                </div>
              </div>
              <div className="bg-white flex flex-1 border shadow my-4 rounded-lg w-full h-[90px]">
                <div className="flex justify-between items-center px-2 w-2/3">
                  <h1 className="pl-4 text-xl text-orange-500">
                    <FaCalendarDay />
                  </h1>
                  <h1 className="font-sans">Doanh thu năm</h1>
                  <h1 className="font-sans">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(trongNam?.doanhThu)}
                  </h1>
                </div>
                <div className="w-1/3 flex justify-center items-center">
                  <p className="text-xl text-orange-500 text-center">
                    <BsGraphUpArrow />
                  </p>
                </div>
              </div>
              <div className="bg-white flex flex-1 border shadow my-4 rounded-lg w-full h-[90px]">
                <div className="flex justify-between items-center px-2 w-2/3">
                  <h1 className="pl-4 text-xl text-orange-500">
                    <FaCalendarDay />
                  </h1>
                  <h1 className="font-sans">SP đã bán trong tháng</h1>
                  <h1 className="font-sans">
                    {trongThang?.soLuongSP}
                    {" sản phẩm"}
                  </h1>
                </div>
                <div className="w-1/3 flex justify-center items-center">
                  <p className="text-xl text-orange-500 text-center">
                    <BsGraphUpArrow />
                  </p>
                </div>
              </div>
              <div className="bg-white flex flex-1 border shadow my-4 rounded-lg w-full h-[90px]">
                <div className="flex justify-between items-center px-2 w-2/3">
                  <h1 className="pl-4 text-xl text-orange-500">
                    <FaCalendarDay />
                  </h1>
                  <h1 className="font-sans">SP đã bán trong năm</h1>
                  <h1 className="font-sans">
                    {trongNam?.soLuongSP}
                    {" sản phẩm"}
                  </h1>
                </div>
                <div className="w-1/3 flex justify-center items-center">
                  <p className="text-xl text-orange-500 text-center">
                    <BsGraphUpArrow />
                  </p>
                </div>
              </div>
              <div className="bg-white flex flex-1 border shadow my-4 rounded-lg w-full h-[90px]">
                <div className="flex justify-between items-center px-2 w-2/3">
                  <h1 className="pl-4 text-xl text-orange-500">
                    <FaCalendarDay />
                  </h1>
                  <h1 className="font-sans">Hóa đơn tháng</h1>
                  <h1 className="font-sans">
                    {trongThang?.hoaDon}
                    {" hóa đơn"}
                  </h1>
                </div>
                <div className="w-1/3 flex justify-center items-center">
                  <p className="text-xl text-orange-500 text-center">
                    <BsGraphUpArrow />
                  </p>
                </div>
              </div>
              <div className="bg-white flex flex-1 border shadow my-4 rounded-lg w-full h-[90px]">
                <div className="flex justify-between items-center px-2 w-2/3">
                  <h1 className="pl-4 text-xl text-orange-500">
                    <FaCalendarDay />
                  </h1>
                  <h1 className="font-sans">Hóa đơn năm</h1>
                  <h1 className="font-sans">
                    {trongNam?.hoaDon}
                    {" hóa đơn"}
                  </h1>
                </div>
                <div className="w-1/3 flex justify-center items-center">
                  <p className="text-xl text-orange-500 text-center">
                    <BsGraphUpArrow />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
