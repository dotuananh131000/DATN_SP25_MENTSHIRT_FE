import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import StepsTrangThaiHoaDon from "./components/orderDetailComponents/StepsTrangThaiHoaDon";
import Cart from "./components/orderDetailComponents/Cart";
import { useCallback, useEffect, useState } from "react";
import HoaDonChiTietService from "../detailOrder/service/HoaDonChiTietService";
import ButtonTrangThai from "./components/orderDetailComponents/ButtonTrangThai";
import OrderInfo from "./components/orderDetailComponents/OrderInfo";
import LichSuThanhToan from "../detailOrder/service/LichSuThanhToan";
import { toast } from "react-toastify";
import HoaDonService from "../detailOrder/service/HoaDonService";
import ProductDetailService from "../details/services/ProductDetailService";
import SanPhamChiTietService from "../detailOrder/service/SanPhamChiTietService";
import LichSuHoaDonService from "@/services/LichSuHoaDonService";
import { useSelector } from "react-redux";
import OrderService from "@/services/OrderService";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@/components/ui/dialog";
import HDPTTTService from "@/services/HDPTTTService";

function OrderDetail({hoaDon, setIsOrderDetail, fetchHoaDonById, fetchHoaDons, fetchOrderCounts, setHoaDon}){

    const [gioHang, setGioHang] = useState([]);
    const [lichSuThanhToan, setLichSuThanhToan] = useState([]);
    const user = useSelector((state)=> state.auth.user);
    const navigate = useNavigate();
    //Thuộc tính của sản phẩm
    const [spcts, setSpct] = useState([]);
    const [totalPageSP, setTotalPageSP] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
      thuongHieuIds: [],
      xuatXuIds: [],
      chatLieuIds: [],
      coAoIds: [],
      tayAoIds: [],
      mauSacIds: [],
      kichThuocIds: [],
    });
    const [chatLieus, setChatLieus] = useState([]);
    const [coAos, setCoAos] = useState([]);
    const [kichThuocs, setKichThuocs] = useState([]);
    const [mauSacs, setMauSacs] = useState([]);
    const [tayAos, setTayAos] = useState([]);
    const [thuongHieus, setThuongHieus] = useState([]);
    const [xuatXus, setXuatXus] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const fetchSelectOptions = async () => {
      try {
        const chatLieuData = await ProductDetailService.getChatLieu();
        setChatLieus(chatLieuData);
  
        const coAoData = await ProductDetailService.getCoAo();
        setCoAos(coAoData);
  
        const kichThuocData = await ProductDetailService.getKichThuoc();
        setKichThuocs(kichThuocData);
  
        const mauSacData = await ProductDetailService.getMauSac();
        setMauSacs(mauSacData);
  
        const tayAoData = await ProductDetailService.getTayAo();
        setTayAos(tayAoData);
  
        const thuongHieuData = await ProductDetailService.getThuongHieu();
        setThuongHieus(thuongHieuData);
  
        const xuatXuData = await ProductDetailService.getXuatXu();
        setXuatXus(xuatXuData);
  
      } catch (error) {
        setError("Error fetching select options");
      }
    };
    const handleFilterChange = (field, selectedOptions) => {
      setFilters(prevFilters => ({
        ...prevFilters,
        [field]: selectedOptions ? selectedOptions.map(option => option.value) : [],
      }));
      setPage(0);
    };
    useEffect(() => {
        fetchSelectOptions();
    }, []);

  const resetFilters = () => {
    setFilters({
      thuongHieuIds: [],
      xuatXuIds: [],
      chatLieuIds: [],
      coAoIds: [],
      tayAoIds: [],
      mauSacIds: [],
      kichThuocIds: [],
      minPrice: 0,
      maxPrice: 10000000,
    });
    setPage(0);
  };

   const fetchSanPhamChiTiet = async () => {
      try {
        const response = await SanPhamChiTietService.GetAll(page, size, search, filters);
        setSpct(response.content);
        setTotalPageSP(response.totalPages)
      } catch (error) {
        console.log("khong thể tải được danh sách san phẩm chi tiết", error);
      }
    };
  
    useEffect(() => {
      fetchSanPhamChiTiet();
    }, [gioHang, page, size, search, filters]);

    // Lấy dữ liệu giỏ hàng của hóa đơn
    const fetchGioHang = async() => {
        try {
            if(!hoaDon.id){
                return;
            }
            const response = await HoaDonChiTietService.getSPCTByIDHoaDon(hoaDon.id);
            setGioHang(response);
        }catch (error) {
            console.log("Không thể lấy được giỏ hàng", error);
        }
    }
    useEffect(() => {
        fetchGioHang();
    }, [hoaDon]);

    // Ghi lại lịch sử thay đổi của hóa đơn
    const fetchCreateLichSuHoaDon = async (form) => {
      try {
        const response = await LichSuHoaDonService.Create(form);

      }catch (error){
        console.log("Không thể ghi lại lịch sử thay đổi", error);
      }
    }

    // Hiện thi lich sử thay đổi của hóa đơn
    const [listHistoryHD, setListHistoryHD] = useState([]);

    const fetchGetLichSuHoaDon = async (id) => {
      try {
        const response = await LichSuHoaDonService.GetAllByIdHd(id);
        setListHistoryHD(response);
      }catch (error){
        console.log("Không thể lấy danh sách lịch sử thay đổi của hóa đơn");
      }
    }

    const handleClickHistory = () => {
      if(!hoaDon.id){
        toast.error("Lỗi khi lấy danh sách hóa đơn. Vui lòng thử lại!");
        return;
      }
      fetchGetLichSuHoaDon(hoaDon.id)
    }
   
    //Lấy dữ liệu lịch sử thanh toán
    useEffect(() => {
        const fetchLichSuThanhToan = async() => {
            try{
                if(!hoaDon.id){
                    return;
                }
                const response = await LichSuThanhToan.getAll(hoaDon.id);
                setLichSuThanhToan(response);
            }catch (error) {
                console.log("Lỗi khi gọi api lịch sử thanh toán", error);
            }
        }
        fetchLichSuThanhToan();
    }, [hoaDon]);

    //Hàm update trạng thái đơn hàng
    const handleCapNhatDonHang = useCallback(() => {
        const fetchCapNhatDonHang = async () => {
            try {
                if(!hoaDon.id){
                    toast.error("Lỗi hóa đơn, vui lòng thử lại.")
                    return;
                }
                const formLichSuHoaDon = {
                  idHoaDon: hoaDon.id || null,
                  hanhDong: hoaDon.trangThaiGiaoHang === 1
                    ? "Đã chuyển trạng thái thành: Đã xác nhân"
                    : hoaDon.trangThaiGiaoHang === 2
                      ? "Đã chuyển trạng thái thành: Chờ vận chuyển"
                      : hoaDon.trangThaiGiaoHang === 3
                        ? "Đã chuyển trạng thái đơn hàng thành: Đang vận chuyển"
                        : hoaDon.trangThaiGiaoHang === 4
                          ? "Đã chuyển trạng thái thành: Đã hoàn thành"
                            : ""
                  ,
                  nguoiThayDoi: user.tenNhanVien ?? "",
                }
                const response = await HoaDonService.UpdateTrangThaiDonHang(hoaDon.id);
                fetchCreateLichSuHoaDon(formLichSuHoaDon);
                fetchHoaDonById(hoaDon.id);
                fetchHoaDons();
                fetchOrderCounts();
                toast.success("Trạng thái đã được cập nhật");
            }catch (error) {
                toast.error("Lỗi khi cập nhật trạng thái, vui lòng thử lại.")
                console.log("Lỗi cập nhật trạng thái", error);
            }
        }
        fetchCapNhatDonHang();

        
    },[hoaDon])

    //Hàm tiếp nhận hóa đơn
    const fetchTiepNhanHoaDon =async () => {
      try {
        if(!hoaDon.id || !user.id){
          toast.error("Lỗi, vui lòng thử lại!")
          return;
        }
       await OrderService.tiepNhanHoaDon(hoaDon.id, user.id);
       toast.success("Tiếp nhận đơn hàng thành công");
       fetchHoaDons();
       fetchHoaDonById(hoaDon.id);
      }catch (err) {
        console.log("Không thể tiếp nhân đơn hàng", err);
        toast.error("Lỗi khi tiếp nhân đơn hàng. Vui long thử lại!")
      }
    }

    const handleTiepNhan = () => {
      fetchTiepNhanHoaDon();
    }

    const handleNavigate = () => {
      setIsOrderDetail(false);
      setHoaDon({})
      navigate("/admin/order")
    }

    //Tính tổng tiền khách thanh toán
    const soTienGiam = Math.min(
        hoaDon.hinhThucGiamGia === 0 
            ? (hoaDon.tongTien * hoaDon.giaTriGiam) / 100 // Giảm theo %
            : hoaDon.giaTriGiam, // Giảm số tiền cố định
        hoaDon.soTienGiamToiDa, // Giới hạn không vượt quá số tiền giảm tối đa
        hoaDon.tongTien // Không thể giảm quá tổng tiền
    );

    const phuPhi = hoaDon.phuPhi ? hoaDon.phuPhi : 0;
    const soTienCanThanhToan = hoaDon.tongTien - soTienGiam + hoaDon.phiShip + phuPhi;

    //Chuyển trạng thái thàng đã thanh toán
    const fetchPaid = async () => {
      try {
        const response = await OrderService.paidInvoice(hoaDon.id);
        setHoaDon(response.data); 
      }catch (err){
        console.log("Lỗi khi thay đổi trạng thái", err);
      }
    }

    //Xác nhận thanh toán hóa đơn
    const [dataTotal, setDataTotal] = useState({
      hoaDonId: "",
      phuongThucThanhToanId: 3,
      soTienThanhToan: 0,
      nguoiXacNhan: user.tenNhanVien || "",
    });
    useEffect(() => {
      setDataTotal(prev => ({ ...prev, hoaDonId: hoaDon.id, 
        soTienThanhToan: soTienCanThanhToan,
        nguoiXacNhan: user.tenNhanVien,
      }));
    }, [hoaDon, user]);

    const handleOnchange = (e) => {
      const newMoney = e.target.value.replace(/\D/g, "");
      setDataTotal((prev) => ({...prev, soTienThanhToan:newMoney ? parseFloat(newMoney) : 0}));
    }
    const confirmTotal = async () => {
      try {
        const form = {
          hoaDonId: dataTotal.hoaDonId ? dataTotal.hoaDonId : null,
          phuongThucThanhToanId: dataTotal.phuongThucThanhToanId ? dataTotal.phuongThucThanhToanId : null,
          soTienThanhToan: dataTotal.soTienThanhToan ? dataTotal.soTienThanhToan : null,
          nguoiXacNhan: dataTotal.nguoiXacNhan ? dataTotal.nguoiXacNhan : null,
        }
        const response = await HDPTTTService.Add(form);
        fetchPaid();
        toast.success(response);
      }catch (err){
        console.log("Không thể xác nhận thanh toán hóa đơn,Vui lòng thuwr lại", err);
      }
    }

    console.log(dataTotal);

    return <>
        <div className="p-6 bg-gray-50 min-h-screen">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                       <BreadcrumbLink onClick={handleNavigate} className="cursor-pointer text-lg">
                            Danh sách hóa đơn
                       </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink className="cursor-pointer">{hoaDon.maHoaDon}</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <StepsTrangThaiHoaDon
                hoaDon={hoaDon} />
            <ButtonTrangThai hoaDon={hoaDon} handleCapNhatDonHang={handleCapNhatDonHang}
            handleClickHistory={handleClickHistory}
            listHistoryHD={listHistoryHD}
            setListHistoryHD={setListHistoryHD}
            handleTiepNhan={handleTiepNhan}
            />
            {(hoaDon.trangThaiGiaoHang === 5 && hoaDon.trangThai === 0) && (
              <div className="fixed top-0 left-0 w-full h-full flex items-start justify-center bg-black bg-opacity-50 z-50">
                <div className="modal-box mt-10 bg-white p-4 rounded-lg shadow">
                  <h1 className="text-lg">
                    Đơn hàng đã hoàn thành. Nhân viên xác nhận số tiền khách đã thanh toán:</h1>
                  <div className="relative border-2 border-gray-400 p-2 w-full rounded-lg mt-6 ">
                    <div className="flex absolute -top-3 left-20 transform -translate-x-1/2 bg-white px-2 text-sm font-bold">
                      <h1 className="text-sm">Số tiền khách thanh toán</h1>
                    </div>
                    <div className="flex justify-between">
                      <input type="text"
                      readOnly
                       value={new Intl.NumberFormat("vi-VN").format(dataTotal.soTienThanhToan || 0)}
                      onChange={(e) => handleOnchange(e)} 
                      className="w-1/2 m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300" />
                      <button 
                      onClick={confirmTotal}
                      className="bg-orange-500 m-1 px-3 py-2 rounded-lg text-white active:scale-95 duration-200">
                        Xác nhận
                        </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            )}
            <OrderInfo hoaDon={hoaDon} lichSuThanhToan={lichSuThanhToan} />
            <Cart
                hoaDon={hoaDon}
                gioHang={gioHang}
                fetchGioHang={fetchGioHang}
                fetchSanPhamChiTiet={fetchSanPhamChiTiet}
                fetchHoaDonById={fetchHoaDonById}
                spcts={spcts}
                totalPages={totalPageSP}
                page={page}
                setPage={ setPage}
                size={size}
                setSize={setSize}
                setSearch={setSearch}
                quantity={quantity}
                setQuantity={setQuantity}
                thuongHieus={thuongHieus}
                xuatXus={xuatXus}
                chatLieus={chatLieus}
                coAos={coAos}
                tayAos={tayAos}
                mauSacs={mauSacs}
                kichThuocs={kichThuocs}
                handleFilterChange={handleFilterChange}
                resetFilters={resetFilters}
            />
        </div>
    </>
}
export default OrderDetail;