import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UseFormatDate from "@/lib/useFomatDay";
import UseFormatMoney from "@/lib/useFormatMoney";
import api_giaoHangNhanh from "@/pages/counterSales/services/GiaoHangNhanhService";
import Address from "@/services/AdressSerrvice";
import HDPTTTService from "@/services/HDPTTTService";
import LichSuHoaDonService from "@/services/LichSuHoaDonService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ButtonDetail({order}) {

    const client = useSelector((state) => state.authClient?.client);


    // Lấy danh scahs lịch sử thanh toán
    const [historyPayment, setHistoryPayMent] = useState([]);

    const fetchLichSuThanhToanByHD = async () => {
        try {
            const response = await HDPTTTService.getAllByIdHd(order.id);
            setHistoryPayMent(response);
        }catch (err){
            console.log("Không thể lấy được danh sách lịch sử thanh toán.", err);
        }
    }
    useEffect(() => {
        fetchLichSuThanhToanByHD();
    },[])

    // Danh sách địa chỉ của khach hàng
    const [addressList, setAddressList] = useState([]);
    const fectDiaChi = async () => {
        try {
            const response = await Address.getListByKH(client.id);
            setAddressList(response.data);
        }catch (err){
            console.log("Không thể lấy danh sách địa chỉ khách hàng", err);
        }
    }
    useEffect(() => {
        fectDiaChi();
    },[])

    // Địa chỉ được chọn
    const [selectedAddress, setSelectedAddress] = useState({});
    const handleOnchangeAddress = (e) => {
        const selected = addressList.find(item => item.id.toString() === e.target.value);
        setSelectedAddress(selected);
    }

    // Gọi hàm serviceId để tính phí ship
    const [serviceId, setServiceId] = useState("");
    const fetchServiceId = async () => {
        if(!selectedAddress.quanHuyenId) return;
        try{
            const response = await api_giaoHangNhanh.getServiceId(Number(selectedAddress.quanHuyenId));
            setServiceId(response.data[0].service_id);
        }catch (err){
            console.log("Không thể lấy được serviceId", err);
        }
    }
    useEffect(() => {
        fetchServiceId();
    }, [selectedAddress])


    //Form thay đổi
    const [form, setForm] = useState({
        hoTenNguoiNhan: "",
        soDienThoai: "",
        diaChiNhanHang: "",
        phiShip: 0
    })

    // GỌi hàm tính phí ship
    const fetchFee = async () => {
        if (!serviceId || !selectedAddress?.quanHuyenId || !selectedAddress?.phuongXaId) return;
        try {
            const response = 
            await api_giaoHangNhanh.getFeeGHN(Number(serviceId), Number(selectedAddress.quanHuyenId), selectedAddress.phuongXaId.toString());
            setForm((prev) => ({...prev, phiShip: response.data.service_fee}));
        }catch (err){
            console.log("Không thể tính được phí ship", err);
        }
    }
    useEffect(() => {
        if(serviceId){
            fetchFee();
        }
    }, [serviceId])

   

    //Hàm vaildate
    const [isOpen, setIsOpen] = useState(true);
    const [errors, setErrors] = useState({
        hoTen: '',
        soDienThoai: ''
    });

    useEffect(() => {
        setForm((prev) => ({...prev, 
            hoTenNguoiNhan: order.hoTenNguoiNhan || "",
            soDienThoai: order.soDienThoai || "",
            diaChiNhanHang: order.diaChiNhanHang || "",
        }))
    }, [order])

     // handleOnchange
     const handleOnchange = (e) => {
        setForm({...form, [e.target.id]: e.target.value})
    }

    const validate = () => {
        let isValid = true;
        
        let newError = {hoTen: "", soDienThoai: ""}
        
        if(!form.hoTenNguoiNhan.trim()){
            newError.hoTen = "Họ và tên không được để trống !";
            isValid = false;
        }

        const phoneRegex = /^[0-9]{10,11}$/; 
        if(!phoneRegex.test(form.soDienThoai)){
            newError.soDienThoai = "Số điện thoại không hợp lệ";
            isValid = false;
        }
        setErrors(newError);
        return isValid;
    }

    const handleOnSubmit = () => {
        if(validate()){
            setIsOpen(false);
        }
    };
    


    return <div className="w-full h-14">
            <div className="relative">
            <Dialog>
                <DialogTrigger asChild>
                    <button className="absolute right-44 bg-orange-500 text-white rounded-lg px-2 py-2 active:scale-95 duration-200">
                        Lịch sử thanh toán
                    </button>
                </DialogTrigger>
                <DialogContent className="fixed  left-1/2 -translate-x-1/2 w-3/4 max-w-2xl bg-white p-6 rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Lịch sử thanh toán </DialogTitle>
                    </DialogHeader>
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã giao dịch</th>
                                    <th>Hình thức thanh toán</th>
                                    <th>Ngày giao dịch</th>
                                    <th>Số tiền thanh toán</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {historyPayment.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.maGiaoDich}</td>
                                        <td>{item.tenPhuongThuc}</td>
                                        <td>{UseFormatDate(item.ngayThucHienThanhToan)}</td>
                                        <td>{UseFormatMoney(item.soTienThanhToan)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
            
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger asChild>
                    <button className="absolute right-3 bg-orange-500 text-white rounded-lg px-2 py-2 active:scale-95 duration-200">
                        Thay đổi địa chỉ
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="fixed left-1/2 -translate-x-1/2 w-2/4 max-w-2xl bg-white p-6 rounded-lg shadow-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Thông tin địa chỉ </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div>
                        <div className="grid grid-cols-1 mb-2">
                            <label htmlFor="name">Họ và tên</label>
                            <input
                            value={form.hoTenNguoiNhan}
                            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            id="name" type="text" />
                        </div>

                        <div className="grid grid-cols-1 mb-2">
                            <label htmlFor="sdt">Số điện thoại</label>
                            <input 
                            value={form.soDienThoai}
                            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            id="sdt" type="text" />
                        </div>

                        <div className="grid grid-cols-1 mb-2">
                            <label htmlFor="addr">Địa chỉ</label>
                            <select
                            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            name="address" 
                            id="addr"
                            onChange={(e) => handleOnchangeAddress(e)}
                            value={selectedAddress?.id}>
                                {addressList.map((item) => (
                                    <option key={item.id} value={item.id}>{`${item.phuongXa}, ${item.quanHuyen}, ${item.tinhThanh}`}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1">
                            <label htmlFor="fee">Phí vận chuyển mới</label>
                            <input 
                            readOnly
                            value={UseFormatMoney(form.phiShip? form.phiShip : order.phiShip)}
                            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            id="fee" type="text" />
                        </div>
                    </div>
                <div className="flex justify-end space-x-4 mx-2">
                        
                        <AlertDialogCancel className="bg-gray-300 px-3 py-2 rounded-lg hover:bg-gray-400 duration-200">
                            Hủy
                        </AlertDialogCancel>

                        <AlertDialogAction
                        onClick={handleOnSubmit}
                        className="bg-orange-500 px-3 py-2 text-white rounded-lg hover:bg-orange-600 duration-200">
                            Thay đổi
                        </AlertDialogAction>

                </div>
                </AlertDialogContent>
            </AlertDialog>
            
            
        </div>
    </div>
}