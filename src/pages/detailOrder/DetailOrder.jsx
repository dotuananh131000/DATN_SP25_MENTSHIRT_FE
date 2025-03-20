import { Link, useParams } from "react-router-dom";
import Stepper from "./component/Stepper";
import { useEffect, useState } from "react";
import HoaDonService from "./service/HoaDonService";
import ChiTietHoaDon from "./component/ChiTietHoaDon";
import CreateProduct from "./component/AddProduct";
import SanPhamChiTietService from "./service/SanPhamChiTietService";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import HoaDonChiTietService from "./service/HoaDonChiTietService";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmModal from "./component/ConfirmModal";
import AcceptDonHang from "./component/AcceptDonHang";
import LichSUThanhToan from "./service/LichSuThanhToan";

export default function DetailBill() {
  const { id } = useParams();
  const [hoaDon, setHoaDon] = useState({});
  const [isShowModalProduct, setIsShowModalProduct] = useState(false);
  const [spcts, setSpct] = useState([]);
  const [sanPhamGioHang, setSanPhamGioHang] = useState([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [idHDCT, setIDHDCT] = useState(0);
  const [LichSuThanhToan, setLichSuthanhToan] = useState([]);

  const fetchHoaDonByMa = async () => {
    try {
      const response = await HoaDonService.getHoaDon(id);
      setHoaDon(response);
    } catch (error) {
      console.log("Lỗi gọi api hóa đơn theo mã", error);
    }
  };
  const fetchSanPhamChiTiet = async () => {
    try {
      const response = await SanPhamChiTietService.GetAll();
      setSpct(response);
    } catch (error) {
      console.log("khong thể tải được danh sách san phẩm chi tiết", error);
    }
  };
  const fecthSanPhamGioHang = async () => {
    try {
      const response = await HoaDonChiTietService.getSPCTByIDHoaDon(hoaDon.id);
      setSanPhamGioHang(response);
    } catch (error) {
      console.log(
        "Lỗi khi gọi api hóa đơn chi tiết",
        `Và hóa đơn:${hoaDon.id}`,
        error
      );
    }
  };
  const fetchLichSuThanhToan = async()=>{
    try{
      if(!hoaDon?.id){
        return;
      }
      const response = await LichSUThanhToan.getAll(hoaDon?.id);
      setLichSuthanhToan(response);
    }catch(error){
      console.log("Lỗi khi gọi API lịch sử hóa đơn", error);
    }
  }
  useEffect(()=>{
    fetchLichSuThanhToan();
  },[hoaDon])
  console.log(LichSuThanhToan);
  const fetchDelete = async (id) => {
    try {
      const response = await HoaDonChiTietService.deleteHDCT(id);
      if (response) {
        fetchHoaDonByMa();
        toast.success("Đã xóa sản phẩm ra khỏi giỏ hàng");
      } else {
        toast.error("Lỗi khi xóa sản phẩm ra giỏ hàng. Vui lòng thử lại");
      }
    } catch (error) {
      console.log("Lỗi khi xóa HDCT", error);
      toast.error("Có lỗi xảy ra khi xóa hóa đơn chi tiết.");
    }
  };
  const fectUpdateTrạngThaiDonHang = async () => {
    try {
      const response = await HoaDonService.UpdateTrangThaiDonHang(hoaDon?.id);
    } catch (err) {
      console.log("Lỗi khi thực hiện thay đổi trạng thái đơn hàng");
    }
  };
  //Chuyển trạng thái hóa đơn
  const chuyenTrangThaiHoaDon = ()=>{
    fectUpdateTrạngThaiDonHang();
    fetchHoaDonByMa()
    toast.success("Đã cập nhật trạng thái đơn hàng.")
  }
  const handleGetIdHDCT = (id) => {
    setIDHDCT(id);
    setIsConfirm(true);
  };

  useEffect(() => {
    fetchHoaDonByMa();
  }, [id]);

  useEffect(() => {
    fetchSanPhamChiTiet();
  }, [hoaDon]);

  useEffect(() => {
    if (typeof hoaDon.id === "undefined") {
      console.log("");
    } else {
      fecthSanPhamGioHang();
    }
  }, [hoaDon]);

  const handleDaTa = () => {
    fetchHoaDonByMa();
  };

  const handlePrevQuantity = (hdct) => {
    if (!hdct?.id || !hdct?.soLuong) {
      console.log("Không tìm thất hdctId hoặc số lượng");
      return;
    }
    if (hdct.soLuong > 1) {
      const newQuantity = Number(hdct.soLuong - 1);
      const fetchUpdateSoLuong = async () => {
        try {
          const response = await HoaDonChiTietService.updateSoLuongHDCT(
            hdct.id,
            newQuantity
          );
          if (response) {
            fetchHoaDonByMa();
          }
        } catch (error) {
          console.log("Lỗi khi cập nhật số lượng chi tiết", error);
        }
      };
      fetchUpdateSoLuong(hdct.id);
    } else {
      toast.warn("Số lượng tối thiểu là 1");
      return;
    }
  };

  const handleIncreQuantity = (hdct) => {
    // console.log(quantity);
    if (!hdct?.id) {
      console.log("Không tìm thất hdctId ");
      return;
    }
    if (hdct.soLuongTon === 0) {
      toast.error("Số lượng sản phẩm trong kho đã hết");
      return;
    }
    if (hdct.soLuong < 10000) {
      const newQuantity = Number(hdct.soLuong + 1);
      //   console.log(quantity);
      const fetchUpdateSoLuong = async () => {
        try {
          const response = await HoaDonChiTietService.updateSoLuongHDCT(
            hdct.id,
            newQuantity
          );
          if (response) {
            fetchHoaDonByMa();
          }
        } catch (error) {
          console.log("Lỗi khi cập nhật số lượng chi tiết", error);
        }
      };
      fetchUpdateSoLuong();
    } else {
      toast.success("Số lượng vượt quá số lượng tồn");
      return;
    }
  };

  console.log(hoaDon)

  const sanPhamTable = () => {
    if (sanPhamGioHang.length === 0) {
      return (
        <>
          <h1 className="text-2xl text-orange-600 text-center font-bold mb-4  ">
            Giỏ hàng
          </h1>
          <div
            onClick={() => setIsShowModalProduct(true)}
            className="btn flex justify-center items-center w-full h-[400px] mt-4 bg-white hover:bg-gray-100 rounded-lg border border-1 shadow-md"
          >
            <h1 className="text-2xl font-bold text-orange-600">
              Chưa có sản phẩn nào trong giỏ hàng !! <br />
              <p className="text-base">(click để thêm sản phẩm)</p>
            </h1>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="relative mb-8">
            <h1 className="w-full text-2xl text-orange-600 text-center font-bold ">
              Giỏ hàng
            </h1>
           {hoaDon?.trangThai === 0 && ( //Nếu hóa đơn chưa thanh toán thì hiện
             <button
             onClick={() => setIsShowModalProduct(true)}
             className="btn absolute right-4 top-0 bg-orange-500 text-white hover:bg-orange-600 
             hover:scale-105 duration-200"
           >
             + Thêm sản phẩm
           </button>
           )}
          </div>
          <table className="table">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="px-4 py-2">STT</th>
                <th className="px-4 py-2">Ảnh</th>
                <th className="px-4 py-2">Sản phẩm</th>
                <th className="px-4 py-2">Số lượng</th>
                <th className="px-4 py-2">Tổng Tiền</th>
                <th className="px-4 py-2">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {sanPhamGioHang.map((sp, i) => (
                <tr key={sp?.id} className="hover:bg-gray-100 text-center">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">
                    <img
                      className="skeleton h-32 w-32 object-cover"
                      src={sp?.hinhAnh}
                      alt=""
                    />
                  </td>
                  <td className="px-4 py-2">
                    <p className="text-base font-bold">
                      {sp.tenSanPham} [{sp?.tenMauSac} - {sp?.tenKichThuoc}]
                    </p>
                    <p>Mã SP: SPCT{sp?.idSPCT}</p>
                    <p>
                      Đơn giá:{" "}
                      <strong className="text-orange-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(sp?.donGia)}
                      </strong>
                    </p>
                  </td>
                  <td className="px-4 py-2">
                    {hoaDon?.trangThai === 0 && (
                      <button
                      onClick={() => handlePrevQuantity(sp)}
                      className="btn hover:bg-orange-500 py-2 px-4"
                    >
                      -
                    </button>
                    )}
                    <input
                      type="text"
                      value={sp?.soLuong}
                      // defaultValue={sp?.soLuong}
                      className="input w-[80px] mx-2"
                      readOnly
                    />
                    {hoaDon?.trangThai === 0 && (
                       <button
                       onClick={() => handleIncreQuantity(sp)}
                       className="btn hover:bg-orange-500 py-2 px-4"
                     >
                       +
                     </button>
                    )}
                   
                  </td>
                  <td className="px-4 py-2">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(sp?.thanhTien)}
                  </td>
                  <td className="px-4 py-2">
                    {hoaDon?.trangThai === 0 && (
                      <button
                      onClick={() => handleGetIdHDCT(sp?.id)}
                      className="btn bg-white text-orange-500"
                    >
                      <FaRegTrashAlt />
                    </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    }
  };

  console.log(hoaDon)
  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex align-center space-x-4 mb-4">
        <h1 className="text-xl font-bold">Quản lý hóa đơn</h1>
        <p className="text-gray-400 mt-1">/ Hóa đơn {hoaDon.maHoaDon}</p>
      </div>
      <Link to="/admin/order">
        <h1 className="btn absolute top-2 right-4 bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 duration-200">
          Quay lại
        </h1>
      </Link>
      <Stepper hoaDon={hoaDon} />
      
      <AcceptDonHang chuyenTrangThaiHoaDon={chuyenTrangThaiHoaDon} hoaDon={hoaDon} />
      
      <ChiTietHoaDon hoaDon={hoaDon} />
      <div className="bg-white rounded-lg shadow px-4 py-4 mb-4 min-h-[200px]">
        <div className="text-2xl text-orange-600 text-center font-bold mb-4">
          <p>Lịch sử thanh toán</p>
        </div>
        <table className="table table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs mt-4">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">Mã giao dịch</th>
              <th className="px-4 py-2">Số tiền thanh toán</th>
              <th className="px-4 py-2">Thời gian</th>
              <th className="px-4 py-2">Phương thức</th>
              <th className="px-4 py-2">Người xác nhận</th>
            </tr>
          </thead>
          <tbody>
            {LichSuThanhToan.map((lstt, i)=>(
              <tr>
                <td className="px-4 py-2">{i+1}</td>
                <td className="px-4 py-2">Không có</td>
                <td className="px-4 py-2"> 
                  {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                  }).format(lstt?.soTienThanhToan)}
                  </td>
                  <td className="px-4 py-2">{lstt?.ngayThucHienThanhToan}</td>
                  <td className="px-4 py-2">{lstt?.tenPhuongThuc}</td>
                  <td className="px-4 py-2">{lstt?.nguoiXacNhan}</td>
              </tr>
            ))}
        </tbody>
        </table>
       
      </div>
      <div className="bg-white rounded-lg shadow px-4 py-4 mb-4">
        {sanPhamTable(sanPhamGioHang)}
      </div>
      <CreateProduct
        isOpen={isShowModalProduct}
        closeModalProduct={() => setIsShowModalProduct(false)}
        hoaDon={hoaDon}
        spcts={spcts}
        handleDaTa={handleDaTa}
      />
      {isConfirm && (
        <ConfirmModal
          hideConfirm={setIsConfirm}
          idHDCT={idHDCT}
          fetchDelete={fetchDelete}
        />
      )}
    </div>
  );
}
