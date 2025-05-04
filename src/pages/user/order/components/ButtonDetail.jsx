import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UseFormatDate from "@/lib/useFomatDay";
import UseFormatMoney from "@/lib/useFormatMoney";
import api_giaoHangNhanh from "@/pages/counterSales/services/GiaoHangNhanhService";
import Address from "@/services/AdressSerrvice";
import OrderService from "@/services/OrderService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ButtonDetail({order, setOrder, historyPayment}) {

    const client = useSelector((state) => state.authClient?.client);

     //Form thay đổi
     const [form, setForm] = useState({
        id: "",
        hoTenNguoiNhan: "",
        soDienThoai: "",
        email: "",
        diaChiNhanHang: "",
        phiShip: 0,
    })


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
        setForm((prev) => ({...prev, diaChiNhanHang: `${selected.phuongXa}, ${selected.quanHuyen}, ${selected.tinhThanh}`}))
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
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({
        hoTen: '',
        soDienThoai: '',
        email: ''
    });

    useEffect(() => {
        setForm((prev) => ({...prev, 
            id: order.id || "",
            hoTenNguoiNhan: order.hoTenNguoiNhan || "",
            soDienThoai: order.soDienThoai || "",
            email: order.email || "",
            diaChiNhanHang: order.diaChiNhanHang || "",
            phiShip: order.phiShip || "",
        }))
    }, [order])

     // handleOnchange
     const handleOnchange = (e) => {
        setForm({...form, [e.target.id]: e.target.value})
    }

    const validate = () => {
        let isValid = true;
        
        let newError = {hoTen: "", soDienThoai: "", email: "" }
        
        if(!form.hoTenNguoiNhan.trim()){
            newError.hoTen = "Họ và tên không được để trống !";
            isValid = false;
        }

        const phoneRegex = /^[0-9]{10,11}$/; 
        if(!phoneRegex.test(form.soDienThoai)){
            newError.soDienThoai = "Số điện thoại không hợp lệ";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!form.email.trim()) {
            newError.email = "Email không được để trống !";
            isValid = false;
        }else if(!emailRegex.test(form.email)) {
            newError.email = "Email không hợp lệ !";
            isValid = false;
        }

        setErrors(newError);
        return isValid;
    }

    const cancel = () => {
        setForm((prev) => ({...prev, 
            hoTenNguoiNhan: order.hoTenNguoiNhan || "",
            soDienThoai: order.soDienThoai || "",
            email: order.email || "",
            diaChiNhanHang: order.diaChiNhanHang || "",
            phiShip: order.phiShip || "",
        }))
        setIsOpen(false);
        setErrors((prev) => ({...prev, hoTen: "", soDienThoai: "", email: ""}));
    }


    const handleOnSubmit = async() => {
        if(validate()){

            const formData = {
                id: form.id || "",
                hoTenNguoiNhan: form.hoTenNguoiNhan || "",
                soDienThoai: form.soDienThoai || "",
                email: form.email || "",
                diaChiNhanHang: form.diaChiNhanHang || "",
                phiShip: form.phiShip || "",
            }

            // họi API thay đổi thông tinh hóa đơn
            try {
                const response = await OrderService.updateInfoInvoice(formData);
                const orderUpdated = response.data;
                setOrder(orderUpdated);

                toast.success(response.message);
            }catch (err){
                console.log("Không thể thay đổi được thông tin hóa đơn", err);
                toast.error("Lỗi khi thay đổi thông tin, vui lòng thử lại!");
            }
            setIsOpen(false);
        }else {
            setIsOpen(true);
        }
    };

    return <div className="w-full h-14 relative">
            <div className="absolute right-3 flex justify-center items-center space-x-4">
            <Dialog>
                <DialogTrigger asChild>
                    <button className="bg-orange-500 text-white rounded-lg px-2 py-2 active:scale-95 duration-200">
                        Lịch sử thanh toán
                    </button>
                </DialogTrigger>
                <DialogContent className="fixed left-1/2 -translate-x-1/2 w-3/4 max-w-2xl bg-white p-6 rounded-lg shadow-lg">
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
            
            {order.trangThaiGiaoHang === 1 && (
                <AlertDialog open={isOpen}>
                <AlertDialogTrigger asChild>
                    <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-orange-500 text-white rounded-lg px-2 py-2 active:scale-95 duration-200">
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
                            onChange={(e) => handleOnchange(e)}
                            value={form.hoTenNguoiNhan}
                            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            id="hoTenNguoiNhan" type="text" />
                            {errors.hoTen && (<span className="text-sm text-red-500 px-3">{errors.hoTen}</span>)}
                        </div>

                        <div className="grid grid-cols-1 mb-2">
                            <label htmlFor="email">Email</label>
                            <input
                            onChange={(e) => handleOnchange(e)}
                            value={form.email}
                            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            id="email" type="text" />
                            {errors.email && (<span className="text-sm text-red-500 px-3">{errors.email}</span>)}
                        </div>

                        <div className="grid grid-cols-1 mb-2">
                            <label htmlFor="sdt">Số điện thoại</label>
                            <input 
                            onChange={(e) => handleOnchange(e)}
                            value={form.soDienThoai}
                            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            id="soDienThoai" type="text" />
                             {errors.soDienThoai && (<span className="text-sm text-red-500 px-3">{errors.soDienThoai}</span>)}
                        </div>

                        <div className="grid grid-cols-1 mb-2">
                            <label htmlFor="addr">Địa chỉ</label>
                            <select
                            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            name="address" 
                            id="diaChiNhanHang"
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
                            className="bg-gray-200 w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            id="phiShip" type="text" />
                        </div>
                    </div>
                <div className="flex justify-end space-x-4 mx-2">
                        
                        <AlertDialogCancel 
                        onClick={cancel}
                        className="bg-gray-300 px-3 py-2 rounded-lg hover:bg-gray-400 duration-200">
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
            )}
            
            
        </div>
    </div>
}