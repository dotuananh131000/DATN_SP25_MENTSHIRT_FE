import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import HoaDonService from "./services/HoaDonService";
import AddProductModal from "./component/AddProductModal";
import SanPhamChiTietService from "./services/SanPhamChiTietService";
import { FaRegTrashAlt } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import HoaDonChiTietService from "./services/HoaDonChiTietService";
import ConfirmModal from "./component/ConfirmModal";
import Payment from "./component/Payment";
import KhachHangModal from "./component/KhachHangModal";
import KhachHangService from "./services/KhachHangService";
import axios from "axios";
import PhieuGiamGiaService from "./services/PhieuGiamGiaService";
import { useDispatch, useSelector } from "react-redux";
import { setMultipleProductPrices } from "../../features/ProducSlice";
import QRCodeScanner from "../../containers/QRCodeScanner";
import QRProduct from "./component/QRProduct";

export default function CounterSale() {
  const [newBill, setNewBill] = useState({
    idKhachHang: null,
    idNhanVien: 1,
    idPhieuGiamGia: null,
    ghiChu: "",
    hoTenNguoiNhan: "",
    soDienThoai: "",
    email: "",
    diaChiNhanHang: "",
    ngayNhanMongMuon: "",
    ngayDuKienNhan: "",
    phiShip: 0,
    tongTien: 0,
  });

  const [billToday, setBillToDay] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isProductModal, setIsProductModal] = useState(false);
  const [spcts, setSpct] = useState([]);
  const [sanPhamGioHang, setSanPhamGioHang] = useState([]);
  const [idHD, setIdHD] = useState(0);
  const [isConfirm, setIsConfirm] = useState(false);
  const [idHDCT, setIDHDCT] = useState(0);
  const [khList, setKhList] = useState([]);
  const [isModalKH, setIsModalKH] = useState(false);
  const [isConfirmTaoHoaDon, setIsConfirmTaoHoaDon] = useState(false);
  const [isChecked, setIsChecked] = useState(
    billToday[selectedTab]?.loaiDon === 0
  );
  const [billDetailsCount, setBillDetailsCount] = useState({});
  const [listPhieuGIamGia, setListPhieuGiamGia] = useState([]);
  const [listPhieuGIamGiaKH, setListPhieuGiamGiaKH] = useState([]);
  const [phieuGiamGiaTN, setPhieuGiamGiaTN] = useState({});
  const [hdHienTai, setHdHienTai] = useState(billToday[0]);
  const [isQRScanner, setIsQRScanner] = useState(false);
  const [totalPageSP, setTotalPageSP] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalChitietSP, setIsModalChitietSP] = useState(false);
  const [spQR, setSPQR] = useState({});
  const [isSpQR, setIsSPQR] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addSPQR, setAddSPQR] = useState({ idHoaDon: null, idSPCT: null, soLuong: 1,});

  const handleScan =async (decodedText) => {
    console.log(decodedText);
     
    if(decodedText){
      try{
        const response = await SanPhamChiTietService.GetById(decodedText)
        setSPQR(response);
        setIsSPQR(true);
      }catch(error){
        console.log("Qr không nhận được dữ liệu", error);
        toast.error("Mã Qr không đúng");
      }
    }
    setIsQRScanner(false);
   };

   useEffect(() => {
    if (addSPQR.soLuong !== null && addSPQR.idSPCT) {
      const handleAddSPQR = async () => {
        if (addSPQR.soLuong > 100000) {
          toast.warning("Vui lòng nhập số lượng hợp lệ");
          return;
        } else if (addSPQR.soLuong > spQR?.soLuong) {
          toast.warning(
            "Số lượng bạn nhập vượt quá số lượng sản phẩm có trong cửa hàng"
          );
          return;
        }
        try {
          await HoaDonService.ThemSPVaoGioHang(addSPQR);
          handleDaTa();
          toast.success("Đã Thêm sản phẩm vào giỏ hàng");
        } catch (err) {
          console.log("Lỗi khi gọi APi Thêm sản phẩm", err);
          toast.error("Thêm vào giỏ hàng thất bại. Vui lòng thử lại");
        }
      };
      handleAddSPQR();
    }
  }, [addSPQR]);

  const handleSetSPQR = () => {
    if (!idHD) {
      toast.warning("Vui lòng tạo hóa đơn trước khi thêm sản phẩm.");
      return;
    }
    setAddSPQR((prev) => ({
      ...prev,
      idHoaDon: idHD,
      idSPCT: spQR?.id,
      soLuong: Number(quantity),
    }));
    setIsSPQR(false);
  };


  useEffect(() => {
    setHdHienTai(billToday[selectedTab]);
  }, [selectedTab, billToday]);

  const dispatch = useDispatch();
  const productPrices = useSelector((state) => state.productPrices);

  const fecthProductPrices = useCallback(async () => {
    try {
      localStorage.clear();
      const storeData = localStorage.getItem("productPrices");
      if (storeData) {
        dispatch(setMultipleProductPrices(JSON.parse(storeData)));
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/ban-hang/mapGiaSPCT`
      );
      const data = response.data;
      // chuyển đổi map từ API sang redux object nếu cần
      const formatData = Object.entries(data).map(([productId, price]) => ({
        productId,
        price: parseFloat(price),
      }));
      //Cập nhật redux store
      dispatch(setMultipleProductPrices(formatData));
      //Lưu vào localStorage để không bị mất khi reload

      localStorage.setItem("productPrices", JSON.stringify(formatData));
    } catch (error) {
      console.log("lỗi khi gọi API map giá sản phẩm", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fecthProductPrices();
  }, [fecthProductPrices]);

  const fetchReloadHDCT = async (id) => {
    if (!id) {
      console.log("Lỗi khi reload HDCT giỏ hàng");
      return;
    }
    try {
      fecthSanPhamGioHang();
      await HoaDonChiTietService.reloadHDCT(id);
    } catch (err) {
      console.log("Lỗi khi reload HDCT giỏ hàng", err);
    }
  };

  //Thông báo cập nhật giá sản phẩm
  const soSanhGia = (sp) => {
    if (!sp) {
      return;
    }
    const mapGiaSP = Object.fromEntries(Object.entries(productPrices));
    const product = Object.values(mapGiaSP).find(
      (product) => Number(product.productId) === sp.idSPCT
    );
    if (product.oldPrice === product.price) {
      return null;
    } else if (product.oldPrice > product.price) {
      //là giảm giá
      fetchReloadHDCT(sp?.id);
      return (
        <h1 className="text-red-500">
          Sản phẩm đã được giả giá <br />
          từ{" "}
          <strong>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product?.oldPrice)}
          </strong>{" "}
          còn{" "}
          <strong>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product?.price)}
          </strong>
        </h1>
      );
    } else {
      fetchReloadHDCT(sp?.id);
      return (
        <h1 className="text-red-500">
          Sản phẩm đã tăng <br />
          từ{" "}
          <strong>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product?.oldPrice)}
          </strong>{" "}
          thành{" "}
          <strong>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product?.price)}
          </strong>
        </h1>
      );
    }
  };

  const fetchPhieuGiamGiaKhachHang = async () => {
    try {
      if (!billToday[selectedTab]?.idKhachHang) {
        return setListPhieuGiamGiaKH([]);
      } else {
        const response = await PhieuGiamGiaService.getPhieuGiamGiaKH(
          billToday[selectedTab]?.idKhachHang
        );
        setListPhieuGiamGiaKH(response);
      }
    } catch (error) {
      console.log("Không thể tải danh sách phiếu giảm giá khách hàng", error);
    }
  };

  const fetchPhieuGiamGia = async () => {
    try {
      const response = await PhieuGiamGiaService.getAllPhieuGiamGia();
      setListPhieuGiamGia(response);
    } catch (error) {
      console.log("Gọi API phiếu giảm giá thất bại", error);
    }
  };
  //Gọi API danh sách phiếu giảm giá
  const fetchAutoPGGTotNhat = async () => {
    if (!billToday[selectedTab]?.id) {
      return;
    }
    if (sanPhamGioHang.length === 0) {
      setPhieuGiamGiaTN({});
      return null;
    }
    try {
      const response = await HoaDonService.AutoPhieuGiamGiaTotNhat(
        billToday[selectedTab]?.id
      );
      setPhieuGiamGiaTN(response?.phieuGiamGia);
    } catch (error) {
      console.log("Không thể lọc được phiếu giảm giá tốt nhất", error);
    }
  };
  // console.log(sanPhamGioHang.length);
  //Gọi API tự động ren phiếu giảm giá tốt nhất

  const handleCreateBill = async () => {
    if (billToday.length > 8) {
      toast.error("Số lượng hóa đơn chờ tối đa là 9");
      return;
    }
    try {
      const response = await HoaDonService.AddHoaDon(newBill);
      const createBill = response.data;
      fetchBillToday();
      toast.success("Tạo hóa đơn thành công");
      setSelectedTab(billToday?.length);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  //Gọi API cập nhật trạng thái hóa đơn
  const handleUpdateTrangThaiHoaDon = () => {
    const fetchUpdateTrangThaiHoaDon = async () => {
      try {
        const response = await HoaDonService.UpdateTrangThaiHD(idHD);
        toast.success("Đã xác nhận hóa đơn.");
      } catch (error) {
        toast.error("Thay đổi hóa đơn thất bại");
        console.log("Thay đổi hóa đơn thất bại", error);
      }
    };
    fetchUpdateTrangThaiHoaDon();
    setIsConfirmTaoHoaDon(false);
    setTimeout(() => {
      window.location.reload(); // Tải lại trang sau một khoảng thời gian
    }, 500); // Thời gian chờ là 2000ms (2 giây)
  };
  //Gọi API Tahy đổi khách hàng của Hóa đơn
  const handleUpdateKhOfHd = (idKH) => {
    const fetchUpdateKHOfHoaDon = async () => {
      try {
        const response = await HoaDonService.UpdateKhachHang(idHD, idKH);
        fetchBillToday();
        toast.success("Đã thay đổi khách hàng của hóa đơn.");
      } catch (error) {
        toast.error("Thêm khách hàng vào hóa đơn thất bại");
        console.log("Thêm khách hàng thất bại", error);
      }
    };
    fetchUpdateKHOfHoaDon();
  };

  //Gọi API để load hóa đơn đang chờ của ngày hiện tại
  const fetchBillToday = async () => {
    try {
      const response = await HoaDonService.HoaDonHomNay();
      setBillToDay(response);
      setIdHD(response[selectedTab]?.id);
    } catch (error) {
      console.log("Lỗi khi lấy danh sách hóa đơn hôm nay", error);
    }
  };
  const fetchSanPhamChiTiet = async () => {
    try {
      const response = await SanPhamChiTietService.GetAll(page, size, search);
      setSpct(response.content);
      setTotalPageSP(response.totalPages)
    } catch (error) {
      console.log("khong thể tải được danh sách san phẩm chi tiết", error);
    }
  };
  const fecthSanPhamGioHang = async () => {
    try {
      const response = await HoaDonChiTietService.getSPCTByIDHoaDon(
        billToday[selectedTab]?.id
      );

      setSanPhamGioHang(response);
    } catch (error) {
      console.log(
        "Lỗi khi gọi api hóa đơn chi tiết",
        `Và hóa đơn:${billToday[selectedTab]?.id}`,
        error
      );
    }
  };
  const fetchDelete = async (id) => {
    try {
      const response = await HoaDonChiTietService.deleteHDCT(id);
      if (response) {
        fetchBillToday();
        toast.success("Đã xóa sản phẩm ra khỏi giỏ hàng");
      } else {
        toast.error("Lỗi khi xóa sản phẩm ra giỏ hàng. Vui lòng thử lại");
      }
    } catch (error) {
      console.log("Lỗi khi xóa HDCT", error);
      toast.error("Có lỗi xảy ra khi xóa hóa đơn chi tiết.");
    }
  };
  const fetchDataKhachHang = async () => {
    try {
      const response = await KhachHangService.getAllKH();
      setKhList(response);
    } catch (error) {
      console.log("Lỗi khi gọi API khách hàng", error);
    }
  };

  const handleModalKH = () => {
    fetchDataKhachHang();
    setIsModalKH(true);
  };

  const fetchDeleteKhachHang = async (id) => {
    try {
      await HoaDonService.deleteKhachHang(id);
      toast.success("Đã loại bỏ khách hàng khỏi hóa đơn.");
      setIsChecked(false);
      fetchBillToday();
    } catch (error) {
      console.log(
        "Không thể loại khách hàng ra hóa đơn. vui lòng thử lại",
        error
      );
    }
  };
  const handleDeleteKH = () => {
    if (!billToday[selectedTab]?.id) {
      return;
    }
    fetchDeleteKhachHang(billToday[selectedTab]?.id);
  };

  useEffect(() => {
    fetchBillToday();
    console.log("Đã gọi fecthToday");
  }, [selectedTab]);

  useEffect(() => {
      fetchSanPhamChiTiet();
  }, [sanPhamGioHang, page, size, search]);

  useEffect(() => {
    if (typeof billToday[selectedTab]?.id === "undefined") {
      console.log("");
    } else {
      fecthSanPhamGioHang();
    }
  }, [billToday[selectedTab]]);

  useEffect(() => {
    fetchPhieuGiamGia();
  }, []);

  useEffect(() => {
    fetchPhieuGiamGiaKhachHang();
  }, [billToday[selectedTab]?.idKhachHang]);

  useEffect(() => {
    fetchAutoPGGTotNhat();
  }, [sanPhamGioHang, billToday[selectedTab]?.idKhachHang]);

  const handleDaTa = () => {
    fetchBillToday();
  };

  const handleGetIdHDCT = (id) => {
    setIDHDCT(id);
    setIsConfirm(true);
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
            fetchBillToday();
          }
        } catch (error) {
          console.log("Lỗi khi cập nhật số lượng chi tiết", error);
        }
      };
      fetchUpdateSoLuong(hdct.id);
    } else {
      toast.error("Số lượng tối thiểu là 1");
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
            fetchBillToday();
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

  const handleUpdateTrangThaiDonHang = async () => {
    try {
      if (!billToday[selectedTab]?.id) {
        return;
      }
      const fetchTrangThaiDH = await HoaDonService.UpdateTrangThaiDonHang(
        billToday[selectedTab]?.id
      );
      if (fetchTrangThaiDH) {
        console.log("Đã xác nhận đơn hàng", fetchTrangThaiDH);
        toast.success("Xác nhận đơn hàng thành công");
      } else {
        console.log("Xác nhân thất bại");
        toast.error("Xác nhận đơn hàng thất bại, vui lòng thử lại");
      }
    } catch (error) {
      console.log("Đã có lỗi khi gọi API xác nhân đơn hàng", error);
    }
  };

  const handleTTDH = () => {
    handleUpdateTrangThaiDonHang();
    setIsConfirmTaoHoaDon(false);
  };

  const changeIDHoaDon = (index, id) => {
    setSelectedTab(index);
    setIdHD(id);
    setIsChecked(false);
  };
  //hàm thay đổi idHD
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/hdct/count")
      .then((response) => {
        setBillDetailsCount(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, [sanPhamGioHang]);
  //Hàm đếm số lượng hóa đơn chi tiết

  // console.log(sanPhamGioHang.length);
  const confirmXacNhan = () => {
    if (isChecked) {
      return (
        <>
          <div className="modal modal-open">
            <div className="modal-box max-w-sm p-4">
              <h3 className="font-bold text-lg text-orange-500 ">Xác nhận</h3>
              <p className="py-3 ">Xác nhận tạo đơn hàng mới !</p>
              <div className="modal-action flex justify-center gap-3">
                <button
                  onClick={() => handleTTDH()}
                  className="btn bg-orange-500 hover:bg-orange-600 text-white px-4"
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => setIsConfirmTaoHoaDon(false)}
                  className="btn px-4"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm p-4">
            <h3 className="font-bold text-lg text-orange-500 ">Xác nhận</h3>
            <p className="py-3 ">Xác nhận hoàn tất hóa đơn !</p>
            <div className="modal-action flex justify-center gap-3">
              <button
                onClick={() => handleUpdateTrangThaiHoaDon()}
                className="btn bg-orange-500 hover:bg-orange-600 text-white px-4"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setIsConfirmTaoHoaDon(false)}
                className="btn px-4"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

const validateThemSP = ()=>{
  if(billToday.length ===0){
    toast.info("Vui lòng tạo hóa đơn khi thêm sản phẩm.")
    return;
  }else{
    setIsProductModal(true)
  }
}

  const tabHD = () => {
    if (billToday.length < 0) {
      return (
        <div className="flex justify-center items-center bg-white shadow rounded mt-4 w-full h-[60px]">
          <h1 className="text-lg text-orange-600 font-bold">
            Danh sách hóa đơn chờ trống !
          </h1>
        </div>
      );
    } else {
      return (
        <>
          <div className=" tabs w-1200px overflow-x-auto flex border-b max-w-full px-2 py-4 ">
            {billToday.map((bill, i) => (
              <div
                className={`indicator w-[120px] px-1 py-2 mx-2 
                  cursor-pointer rounded-lg focus:outline-none shadow ${
                    selectedTab === i
                      ? "border-b-2 border-orange-500 bg-orange-500 text-white font-bold "
                      : "text-gray-500 "
                  }text-sm transition-all duration-300 ease-in-out`}
                key={bill?.id}
                onClick={() => changeIDHoaDon(i, bill.id)} // Cập nhật tab được chọn
              >
                <span className="indicator-item badge badge-warning text-gray-500">
                  {billDetailsCount[bill.id] || 0}
                </span>
                <div className="flex justify-between items-center space-x-6 px-1">
                  <p className="text-xs">
                    Hóa đơn {i + 1} <br />
                  </p>
                  <p className="text-red-500 hover:text-white hover:bg-red-500 rounded-lg">
                    <GiCancel />
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white shadow rounded py-4 px-4 mt-4">
            <div className="flex items-center justify-between ">
              <p className="text-sm text-orange-500 ">
                Hóa đơn: {billToday[selectedTab]?.maHoaDon}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={()=> validateThemSP()}
                  className="btn px-4 py-1 border border-orange-500 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Thêm sản phẩm
                </button>
                <button onClick={()=> setIsQRScanner(true)} 
                className="btn px-4 py-1 border border-orange-500 bg-orange-500 text-white rounded-lg hover:bg-orange-500 hover:text-white">
                  Quét QR
                </button>
              </div>
            </div>
          </div>
          {isQRScanner && <QRCodeScanner onScan={handleScan} onClose={()=>setIsQRScanner(false)}/>}
        </>
      );
    }
  };
  const chooseSP = () => {
    if (billToday.length <= 0) {
      toast.warn("Vui lòng tạo hóa đơn trước khi thêm sản phẩm");
      return;
    } else {
      setIsProductModal(true);
    }
  };
  const sanPhamTable = () => {
    if (sanPhamGioHang.length === 0) {
      return (
        <>
          <h1 className="text-2xl text-orange-600 text-center font-bold mb-4  ">
            Giỏ hàng
          </h1>
          <div
            onClick={() => chooseSP()}
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
          <div className="flex flex-1 justify-between items-center">
            <h1 className="w-full text-2xl text-orange-600 text-center font-bold">
              Giỏ hàng
            </h1>
          </div>
          <table className="table table-auto min-h-[300px] w-full bg-white rounded-lg shadow overflow-y-auto text-center text-xs mt-4 max-h-[600px]">
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
                    {soSanhGia(sp)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handlePrevQuantity(sp)}
                      className="btn hover:bg-orange-500 py-2 px-4"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={sp?.soLuong}
                      // defaultValue={sp?.soLuong}
                      className="input w-[80px] mx-2"
                      readOnly
                    />
                    <button
                      onClick={() => handleIncreQuantity(sp)}
                      className="btn hover:bg-orange-500 py-2 px-4"
                    >
                      +
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(sp?.thanhTien)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleGetIdHDCT(sp?.id)}
                      className="btn bg-white text-orange-500"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    }
  };
  const thongTinKH = () => {
    if (!billToday[selectedTab]?.tenKhachHang) {
      return (
        <div className="flex w-full flex-col border-opacity-50">
          <div className="flex justify-between items-center bg-white rounded-md shadow h-20 px-4 ">
            <h1 className="text-orange-500 font-bold text-lg">
              Thông tin khách hàng
            </h1>
            <button
              onClick={handleModalKH}
              className="btn bg-orange-500 hover:bg-orange-600 text-white"
            >
              Thêm khách hàng
            </button>
          </div>
          <div className="flex items-center p-4 space-x-4 bg-white rounded-lg shadow h-20 ">
            <h1 className="text-orange-500">Tên khách hàng:</h1>
            <h1 className="text-orange-500 text-lg font-bold">Khách hàng lẻ</h1>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full bg-white rounded-lg shadow ">
          <div className="flex justify-between items-center bg-white h-20 px-4 ">
            <h1 className="text-orange-500 font-bold text-lg">
              Thông tin khách hàng
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDeleteKH()}
                className="btn text-base font-medium"
              >
                {billToday[selectedTab]?.tenKhachHang}
                <p className="text-red-600">X</p>
              </button>
              <button
                onClick={handleModalKH}
                className="btn bg-orange-500 hover:bg-orange-600 text-white"
              >
                Thay đổi khách hàng
              </button>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-1/2">
              <div className="flex space-x-4 items-center mx-3 p-4 ">
                <h1 className="text-orange-500">Tên khách hàng:</h1>
                <h1 className="text-orange-500 text-sm font-bold">
                  {billToday[selectedTab]?.tenKhachHang}
                </h1>
              </div>
              <div className="flex space-x-4 items-center mx-3 p-4">
                <h1 className="text-orange-500">Email:</h1>
                <h1 className="text-orange-500 text-sm font-bold">
                  {billToday[selectedTab]?.email}
                </h1>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex space-x-4 items-center mx-3 p-4 ">
                <h1 className="text-orange-500">Ngày sinh:</h1>
                <h1 className="text-orange-500 text-sm font-bold">
                  {billToday[selectedTab]?.ngaySinh}
                </h1>
              </div>
              <div className="flex space-x-4 items-center mx-3 p-4 ">
                <h1 className="text-orange-500">Số điện thoại:</h1>
                <h1 className="text-orange-500 text-sm font-bold">
                  {billToday[selectedTab]?.soDienThoai}
                </h1>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  // console.log(billToday[selectedTab]?.idKhachHang);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex space-x-4 bg-white shadow rounded py-4 px-4">
        <button
          onClick={handleCreateBill}
          className="btn text-base font-normal bg-orange-500 hover:bg-orange-600 text-white "
        >
          Tạo hóa đơn mới
        </button>
      </div>
      {tabHD()}
      <div className="bg-white rounded-lg shadow px-4 py-4 my-4">
        {sanPhamTable()}
      </div>

      <AddProductModal
        spcts={spcts}
        isOpen={isProductModal}
        isClose={setIsProductModal}
        hoaDon={idHD}
        handleDaTa={handleDaTa}
        totalPages={totalPageSP}
        page={page}
        setPage={ setPage}
        size={size}
        setSize={setSize}
        setSearch={setSearch}
        isModalChitietSP={isModalChitietSP}
        setIsModalChitietSP={setIsModalChitietSP}
        quantity={quantity}
        setQuantity={setQuantity}
      />
      {isConfirm && (
        <ConfirmModal
          hideConfirm={setIsConfirm}
          idHDCT={idHDCT}
          fetchDelete={fetchDelete}
        />
      )}
      {isModalKH && (
        <KhachHangModal
          khList={khList}
          isClose={setIsModalKH}
          handleUpdateKhOfHd={handleUpdateKhOfHd}
        />
      )}
      {thongTinKH()}

      {isSpQR && ( <QRProduct spct={spQR} 
      quantity={quantity} 
      setQuantity={setQuantity}
      setIsSPQR={setIsSPQR}
      handleSetSPQR={handleSetSPQR} />)
      }
      <Payment
        billToday={billToday}
        selectedTab={selectedTab}
        isOpenConfirm={setIsConfirmTaoHoaDon}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        pggs={listPhieuGIamGia}
        pggkh={listPhieuGIamGiaKH}
        handleUpdateTrangThaiHoaDon={handleUpdateTrangThaiHoaDon}
        phieuGiamGiaTN={phieuGiamGiaTN}
        sanPhamGioHang={sanPhamGioHang}
        hdHienTai={hdHienTai}
      />
      {isConfirmTaoHoaDon && confirmXacNhan()}
    </div>
  );
}
