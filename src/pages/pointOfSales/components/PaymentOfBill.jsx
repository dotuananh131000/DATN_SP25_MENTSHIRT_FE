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
function PayMentOfBill ( {order, cartItems, customer} ) {
    const [isShipping, setShipping] = useState(false);
    const [listVoucher, setListVoucher] = useState([]);
     const [fee, setFee] = useState("");

    // Tính tổng tiền sản phẩm trong giỏ hàng
    const totalItemsPrice = cartItems.reduce((total, item) => {
        return total + item.thanhTien
    },0);

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
    }, []);

    // Lấy voucher áp dụng cho hóa đơn
    const [voucher, setVoucher] = useState({});
    const getVouCher = (item) => {
        setVoucher(item); 
    }

    // Lấy phiếu giảm giá tốt nhất cho khách hàng
    const [voucherBest, setVoucherBest] = useState({});
    const fetchTheBestVoucher = async () => {
        const idKH = order.idKhachHang || "";
        const tongTien = totalItemsPrice;
        if(tongTien <= 0) {
            setVoucher({});
            setVoucherBest({})
            return;
        }
        try {
            const response = await voucherService.theBestVoucher(idKH, tongTien);
            setVoucher(response.data);
            setVoucherBest(response.data);
        }catch (err) {
            console.log("Không thể lấy được phiếu giảm giá tốt nhất",err);
        }
    }
    useEffect(() => {
        fetchTheBestVoucher();
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

    console.log(voucher);

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
                                      Số tiền giảm tối đa: {UseFormatMoney(item.soTienGiamToiDa)} <br />
                                      Ngày kết thúc: {UseFormatDate(item.thoiGianHetHan)}
                                      </p>
                                    </td>
                                    <td className="px-4 py-2">
                                        {order.tongTien >= item.soTienToiThieuHd && (
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

    console.log(fee);

    return <>
        <div className="bg-white shadow rounded-lg p-2 mb-4">
            <h1 className="text-lg font-bold mb-2">Thông tin thanh toán</h1>
            <div className="grid grid-cols-5">
                {/* thẻ div chứa thông tin địa chỉ */}
                <div className="col-span-3">
                    {isShipping && (
                        <ContactAddress customer={customer} setFee={setFee} />
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
                            {voucher.maPhieuGiamGia}
                        </p>
                        {voucher.id === voucherBest.id && (
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
                            checked={isShipping}
                            onCheckedChange={() => setShipping(!isShipping)}
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
                                <Dialog>
                                    <DialogTrigger>
                                        <button className="text-orange-500"><AiFillCreditCard /></button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle className="text-md">
                                            Thanh toán
                                        </DialogTitle>
                                        <div>

                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <h2 className="text-orange-500">{UseFormatMoney(0)}</h2>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <h2>Tiền thiếu:</h2>
                            <h2 className="text-orange-500">{UseFormatMoney(0)}</h2>
                        </div>
                        
                        <div className="flex justify-between">
                            <button className="px-3 py-2 bg-orange-500 text-white rounded-lg active:scale-95 duration-200">
                                Hoàn tất hóa đơn
                            </button>
                            <div className="flex items-center space-x-2">
                                <label htmlFor="print">In hóa đơn</label>
                                <Switch id="print"
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