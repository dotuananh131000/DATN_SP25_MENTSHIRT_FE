import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import UseFormatMoney from "@/lib/useFormatMoney";
import { AiFillCreditCard } from "react-icons/ai";
import { BiPurchaseTagAlt } from "react-icons/bi";
import ContactAddress from "./ContactAddress";
import { useEffect, useState } from "react";
import voucherService from "@/services/VouchersService";
import UseFormatDate from "@/lib/useFomatDay";
import { toast } from "react-toastify";
import OrderService from "@/services/OrderService";
import HDPTTTService from "@/services/HDPTTTService";
import { useSelector } from "react-redux";
import { printBill } from "./PrintOfBill";
function PayMentOfBill ( {order, setOrder, cartItems, customer} ) {
    const [listVoucher, setListVoucher] = useState([]);
    const [fee, setFee] = useState("");
    const [listLSTT, setListLSTT] = useState([]);
    const user = useSelector((state)=> state.auth.user);
    const [formOrder, setFormOrder] = useState({
        hoTenNguoiNhan: "",
        soDienThoai: "",
        email: "",
        diaChiNhanHang: "",
        phiShip: "",
        tongTien: "",
    });

    // Tính tổng tiền sản phẩm trong giỏ hàng
    const totalItemsPrice = cartItems.reduce((total, item) => {
        return total + item.thanhTien
    },0);

   // Tiền khách đã thanh toán
    function tienDaThanhToan(list) {
        if (!Array.isArray(list) || list.length === 0) {
            return 0;
        }
        return list.reduce((total, item) => {
            return total + (item.soTienThanhToan || 0);
        }, 0);
    }

    // Lấy danh sách phiếu giảm giá
    const fetchVouchers = async () => {
        const idKH = order.idKhachHang || "";
        try {
            const response = await voucherService.lisVoucherByKH(idKH);
            setListVoucher(response);
        }catch (err){
            console.log("Không thể lấy được danh sách hóa đơn", err);
        }
    }
    useEffect(() => {
        fetchVouchers();
    }, [order.id, order.idKhachHang]);

    // Lấy voucher áp dụng cho hóa đơn
    const [voucher, setVoucher] = useState({});
    const fetchChonPhieuGiam = async(idHD, PGG) => {
        try {
            const response = await OrderService.chonPhieuGiamGia(idHD, PGG.id);
            // setOrder(response.data);
            setVoucher(PGG);
            toast.success(response.message);
        } catch(err) {
            console.log("Lỗi khi thay đổi phiếu giảm của hóa đơn", err);
            toast.error("Có lỗi khi thay đổi phiểu giảm! Vui long thử lại.");
        }
    }
    const getVouCher = (item) => {
        fetchChonPhieuGiam(order.id, item);
    }

    // Lấy phiếu giảm giá tốt nhất cho khách hàng
    const [voucherBest, setVoucherBest] = useState({});
    const fetchTheBestVoucher = async (idKH, idHD, tongTien) => { 
        try {
            const response = await voucherService.theBestVoucher(idKH, idHD, tongTien);
            setVoucher(response.data);
            setVoucherBest(response.data);
        }catch (err) {
            console.log("Không thể lấy được phiếu giảm giá tốt nhất",err);
        }
    }
    useEffect(() => {
        const idKH = order.idKhachHang || "";
        const idHD = order.id || "";
        const tongTien = totalItemsPrice;

        if(tongTien <= 0) {
                setVoucher({});
                setVoucherBest({})
                return;
        }
        const timeout = setTimeout(() => {
            fetchTheBestVoucher(idKH, idHD, tongTien);
        }, 500);

        return () => clearTimeout(timeout);

    }, [totalItemsPrice, listVoucher, order.id]);


    // Hoàn lại phiếu giảm giá khi tiền hàng bằng 0
    const fetchHoanPhieuGiam = async (idHD, tienHang) => {
        try {
            const response = await OrderService.hoanPhieuGiam(idHD, tienHang);
            console.log("Đã hoàn")
            setOrder(response.data);
        }catch (err) {
            console.log("Không thể loại phiếu giảm ra khỏi hóa đơn", err);
        }
    }
    useEffect(() => {
        if(!order.giaTriGiam) {
            return;
        }
        if(totalItemsPrice <= 0){
            const timeout = setTimeout(() => {
                fetchHoanPhieuGiam(order.id, totalItemsPrice);
            }, 500);  
            return () => clearTimeout(timeout); 
        } 
    }, [totalItemsPrice, order.id]);

    // Số tiền giảm khi áp dụng phiều giảm giá
    function tinhTienGiam(voucher, tongTienHang) {
        let tienGiam = 0;

        if(!voucher) return 0;

        if (voucher.hinhThucGiamGia === 0){
            //Giảm theo phần trăm
            tienGiam = tongTienHang * (voucher.giaTriGiam / 100);

            //Giới hạn số tiền giảm
            tienGiam = Math.min(tienGiam, voucher.soTienGiamToiDa);
        }else if (voucher.hinhThucGiamGia === 1){
            tienGiam = voucher.giaTriGiam;
        }

        return Math.min(tienGiam, tongTienHang);
    }

    // Tạm tính tổng tiền hóa đơn
    const tienGiam = tinhTienGiam(voucher, totalItemsPrice)
    function tongTienHD (tienHang, tienGiam, phiShip) {
        let tienGiamGia = tienGiam || 0;
        let phiVanChuyen = phiShip || 0;
        let tongTien = 0;

        tongTien = tienHang + phiVanChuyen - tienGiamGia;

        return tongTien;
    }

    // Đổi loại đơn từ tại quầy thành giao hàng và ngược lại
    const fetchDoiLoaiDon = async () => {
        try {
            const response = await OrderService.doiLoaiDon(order.id);
            const updateOrder = response.data;
            setOrder(prev => ({...prev, loaiDon: updateOrder.loaiDon}));
            if(response.data.loaiDon === 1){
                setFee(0);
            }
        }catch (err){
            console.log("Không thể đổi loại đơn", err);
            toast.error("Lỗi khi đổi loại đơn");
        }
    }
    useEffect(() => {
        setFee(0)
    }, [order.id]);

    const handleDoiLoaiDon = () => {
        fetchDoiLoaiDon();
    }

    // Phần xác nhận hóa đơn
    const [printInvoice, setPrintInvoice] = useState(false);
    const handleConfirm = async () => {
        const form = {
            hoTenNguoiNhan: formOrder.hoTenNguoiNhan || "",
            soDienThoai: formOrder.soDienThoai || "",
            email: formOrder.email || "",
            diaChiNhanHang: formOrder.diaChiNhanHang || "",
            phiShip: fee || 0,
            tongTien: tongTien || 0,
        }


        if(totalItemsPrice <= 0){
            toast.warning("Số lượng sản phẩm trong hóa đơn chưa có.");
            return;
        }

        if(tienDaThanhToan(listLSTT) === 0) {
            toast.warning("Vui lòng thanh toán hóa đơn.");
            return;
        }
        
        try {
            const response = await OrderService.confirmInvoice(order.id, form);
            const orderConfirm = response.data;
            setOrder(orderConfirm);
            toast.success("Hóa đơn đã được xác nhận.");
            
            // In hoa đơn
            if(printInvoice){
                printBill(orderConfirm, cartItems, listLSTT, tienGiam, totalItemsPrice, fee);
            }

            setTimeout(() => {
                window.location.reload();
            }, 500)
        }catch (err){
            console.log("Lỗi khi xác nhận hóa đơn", err);
        }

        console.log("Đã thành công");
    }

    const ListPhieuGiamGia = () => {
        return <Dialog>
            <DialogTrigger className="bg-orange-500 px-3 py-2 text-white rounded-lg active:scale-95 duration-200">
                Khác
            </DialogTrigger>
            <DialogContent className="w-full max-w-5xl max-h-[700px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        Phiếu giảm giá
                    </DialogTitle>
                </DialogHeader>
                <div >
                    <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="px-4 py-2">STT</th>
                                <th className="px-4 py-2">Mã phiếu</th>
                                <th className="px-4 py-2">Thông tin</th>
                                <th className="px-4 py-2">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                           {listVoucher.map((item, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-2">{i + 1}</td>
                                    <td className="px-4 py-2">{item.maPhieuGiamGia}</td>
                                    <td className="px-4 py-2">
                                      <p>Phiếu giảm: {item.tenPhieuGiamGia} <br />
                                      Giá trị giảm: {item.giaTriGiam}{item.hinhThucGiamGia === 1 ? 
                                      "đ" : "%" } <br />
                                      Số tiền tối thiểu hóa đơn: {UseFormatMoney(item.soTienToiThieuHd)} <br />
                                      Số tiền giảm tối đa: {UseFormatMoney(item?.soTienGiamToiDa || 0)} <br />
                                      Ngày kết thúc: {UseFormatDate(item.thoiGianHetHan)}
                                      </p>
                                    </td>
                                    <td className="px-4 py-2">
                                        {totalItemsPrice >= item.soTienToiThieuHd && (
                                            <button
                                            className="text-orange-500 active:scale-75 duration-200"
                                            onClick={() => getVouCher(item)}>
                                                Chọn
                                            </button>
                                        )}
                                        
                                    </td>
                                </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    }


    // Phần về hóa đơn phương thức thanh toán
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState(1);
    const [soTienThanhToan, setSoTienThanhToan] = useState("");
    const tongTien = tongTienHD(totalItemsPrice, tienGiam, fee);
    useEffect(() => {
        setSoTienThanhToan(tongTien);
    },[tongTien])

    const onChangeTien = (e) => {
        const input = e.target.value;
        const soChiSo = input.replace(/\D/g, ""); 
        setSoTienThanhToan(soChiSo);
    }

    // Gọi hàm thêm tiền
    const fetchAddHDPTTT = async () => {
        try {
            const form = {
                hoaDonId: order.id || "",
                phuongThucThanhToanId: phuongThucThanhToan || "",
                soTienThanhToan: soTienThanhToan || "",
                nguoiXacNhan:  user.tenNhanVien ?? "",
            }
            const response = await HDPTTTService.Add(form);
            fetchListHDPTTT();
            toast.success(response.success);
        }catch (err){
            console.log("Không thể thanh toán hóa đơn", err);
            toast.error("Có lỗi khi thêm tiền");

        }
    }
    // Lấy danh sách thanh toán của hóa đơn
    const fetchListHDPTTT = async () => {
        if(!order.id) return;
        try {
            const response = await HDPTTTService.getAllByIdHd(order.id);
            setListLSTT(response);
        }catch (err){
            console.log("Lỗi khi lấy danh sách lịch sử thanh toán", err);
        }
    }
    useEffect(() =>{
        fetchListHDPTTT();
    }, [order.id])

    const modalTotal = () => {
        return <Dialog >
                    <DialogTrigger className="text-orange-500"
                    onClick={fetchListHDPTTT}
                    >
                        <AiFillCreditCard />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="text-lg">
                            Thanh toán
                        </DialogTitle>
                        <div className="grid grid-cols-1" >
                            <div className="flex justify-between items-center">
                                <span>Tổng tiền cần thanh toán</span>
                                <span>{UseFormatMoney(tongTienHD(totalItemsPrice, tienGiam, fee))}</span>
                            </div>
                                            
                            <label htmlFor="soTien" className="mt-2">Số tiền</label>
                            <input type="text"
                            id="soTien" 
                            onChange={(e) => onChangeTien(e)}
                            value={new Intl.NumberFormat("vi-VN").format(soTienThanhToan)}
                            className="border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />

                            <div className="flex justify-center space-x-4 items-center mt-4">
                                <button className={`px-4 py-2 ${phuongThucThanhToan === 1 ? "bg-orange-500":"bg-gray-500"}  
                                text-white rounded-lg shadow 
                                active:scale-90 duration-200`}
                                onClick={() => setPhuongThucThanhToan(1)}
                                >
                                    Tiền mặt
                                </button>
                                <button className={`px-4 py-2 ${phuongThucThanhToan === 2 ? "bg-orange-500":"bg-gray-500"}  
                                text-white rounded-lg shadow 
                                active:scale-90 duration-200`}
                                onClick={() => setPhuongThucThanhToan(2)}
                                >
                                    Chuyển khoản
                                </button>
                            </div>

                            <span className="text-center mt-4">Lịch sử thanh toán</span>

                            <table className="mt-4 table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">STT</th>
                                        <th className="px-4 py-2">Mã giao dịch</th>
                                        <th className="px-4 py-2">Phương Thức</th>
                                        <th className="px-4 py-2">Số tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listLSTT.map((item, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-2">{i + 1}</td>
                                            <td className="px-4 py-2">{item.maGiaoDich}</td>
                                            <td className="px-4 py-2">{item.tenPhuongThuc}</td>
                                            <td className="px-4 py-2">{UseFormatMoney(item.soTienThanhToan || 0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-end mt-4">
                                <button 
                                onClick={fetchAddHDPTTT}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow active:scale-90 duration-200">
                                    Xác nhân
                                </button>
                            </div>

                        </div>
                    </DialogContent>
                </Dialog>
    }

    console.log(totalItemsPrice)

    return <>
        <div className="bg-white shadow rounded-lg p-2 mb-4">
            <h1 className="text-lg font-bold mb-2">Thông tin thanh toán</h1>
            <div className="grid grid-cols-5">
                {/* thẻ div chứa thông tin địa chỉ */}
                <div className="col-span-3">
                    {order.loaiDon === 0 && (
                        <ContactAddress customer={customer} setFee={setFee} setFormOrder={setFormOrder} formOrder={formOrder} />
                    )}
                </div>

                {/* thẻ div chứa thông tin thanh toán */}
                <div className="col-span-2">

                    {/* Thẻ chứa phiếu giảm giá */}
                    <div className="relative bg-white flex justify-between items-center p-2 border-2 border-gray-400 rounded-lg mb-2">
                        {ListPhieuGiamGia()}
                        <div className="flex absolute -top-3 left-10 transform -translate-x-1/2 bg-white px-2 text-sm font-bold">
                            <span className="text-sm text-orange-500 ">
                                <BiPurchaseTagAlt />
                            </span>
                            <h1 className="text-xs">Mã giảm giá :</h1>
                        </div>    
                        <p className="px-4 py-2 rounded-lg bg-gray-600 text-center text-white w-2/4 ">
                            {voucher?.maPhieuGiamGia}
                        </p>
                        {voucher?.id === voucherBest?.id && (
                            <p className="text-sm text-red-500">Phiếu giảm tốt nhất</p>
                        )}
                        
                    </div>

                    {/* Thẻ chứa số tiền thanh toán */}
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-2">
                            <h2>Tiền hàng:</h2>
                            <h2 className="text-orange-500">{UseFormatMoney(totalItemsPrice)}</h2>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                            <h2>Giảm giá:</h2>
                            <h2 className="text-orange-500">
                                {UseFormatMoney(tinhTienGiam(voucher, totalItemsPrice))}
                            </h2>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <h2>Giao hàng:</h2>
                            <Switch 
                            checked={order.loaiDon === 0}
                            onCheckedChange={handleDoiLoaiDon}
                            className="data-[state=checked]:bg-orange-500" />
                        </div>

                        <div className="flex justify-between items-center mb-2">
                           <div className="flex space-x-4 items-center">
                            <h2>Phí ship:</h2>
                                <img 
                                className="object-cover w-6 h-6 rounded-lg"
                                src="/public/imagesGHN.jpg" alt="" />
                           </div>
                            <input type="text"
                            className="px-2 w-1/3 text-right text-orange-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            value={UseFormatMoney(fee || 0)}
                            />
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <h2>Khách phải thanh toán:</h2>
                            <h2 className="text-orange-500">
                                {UseFormatMoney(tongTienHD(totalItemsPrice, tienGiam, fee))}
                            </h2>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-4">
                                <h2>Đã thanh toán:</h2>
                                {modalTotal()}
                            </div>
                            <h2 className="text-orange-500">{UseFormatMoney(tienDaThanhToan(listLSTT))}</h2>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <h2>{tongTien >= tienDaThanhToan(listLSTT)? "Tiền thiếu:":"Tiền thừa:"}</h2>
                            <h2 className="text-orange-500">{UseFormatMoney(Math.abs(tienDaThanhToan(listLSTT) - tongTien))}</h2>
                        </div>
                        
                        <div className="flex justify-between">
                            <button 
                            onClick={handleConfirm}
                            className="px-3 py-2 bg-orange-500 text-white rounded-lg active:scale-95 duration-200">
                                Hoàn tất hóa đơn
                            </button>
                            <div className="flex items-center space-x-2">
                                <label htmlFor="print">In hóa đơn</label>
                                <Switch id="print"
                                checked={printInvoice}
                                onCheckedChange={(pre) => setPrintInvoice(pre)}
                                 className="data-[state=checked]:bg-orange-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default PayMentOfBill;