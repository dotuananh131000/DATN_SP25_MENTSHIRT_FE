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