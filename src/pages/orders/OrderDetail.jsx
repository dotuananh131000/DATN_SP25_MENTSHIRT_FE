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

function OrderDetail({hoaDon, setIsOrderDetail, fetchHoaDonById}){

    const [gioHang, setGioHang] = useState([]);
    const [lichSuThanhToan, setLichSuThanhToan] = useState([]);
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
                const response = await HoaDonService.UpdateTrangThaiDonHang(hoaDon.id);
                fetchHoaDonById(hoaDon.id);
                toast.success("Trạng thái đã được cập nhật");
            }catch (error) {
                toast.error("Lỗi khi cập nhật trạng thái, vui lòng thử lại.")
                console.log("Lỗi cập nhật trạng thái", error);
            }
        }
        fetchCapNhatDonHang();
    },[hoaDon])
    
    return <>
        <div className="p-6 bg-gray-50 min-h-screen">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                       <BreadcrumbLink onClick={() => setIsOrderDetail(false)} className="cursor-pointer text-lg">
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
            <ButtonTrangThai hoaDon={hoaDon} handleCapNhatDonHang={handleCapNhatDonHang} />
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