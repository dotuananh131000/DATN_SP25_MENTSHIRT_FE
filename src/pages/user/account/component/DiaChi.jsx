import { useEffect, useRef, useState } from "react";
import DiaChiKhachHangService from "../service/DiaChiKhachHangService";
import { useSelector } from "react-redux";
import { AiFillDownCircle } from "react-icons/ai";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import api_giaoHangNhanh from "@/pages/counterSales/services/GiaoHangNhanhService";
import {Checkbox} from "@/components/ui/checkbox"
import { toast } from "react-toastify";

function DiaChi(){
    const client = useSelector((state) => state.authClient?.client);
    const [diaChiKH, setDiaChiKH] = useState([]);
    // * Xử lý phần địa chỉ
    const [provinces, setProvinces] = useState([]);
    const [provinceID, setProvinceID] = useState("");
    const [districts, setDistricts] = useState([]);
    const [districtID, setDistrictID] = useState("");
    const [ward, setWard] = useState([]);
    const [wardID, setWardID] = useState("");
    const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");
    const [specific, setSpecific] = useState("");
    const [status, setStatus] = useState(false);
    const [diaChiDuocChon, setDiaChiDuocChon] = useState({});

    //phần tỉnh
     
    useEffect(() => {
        const fetchProvince = async() => {
          try {
            const response = await api_giaoHangNhanh.getProvince();
            setProvinces(response);
          } catch (error) {
            console.log("Lỗi khi gọi API Tỉnh");
          }
        }
        fetchProvince();
      },[])
    
      //Phần huyện
      useEffect(() => {
        const fetchDistrict = async() => {
          if(!provinceID) return;
          try {
            const response = await api_giaoHangNhanh.getDistrict(Number(provinceID));
            //  setDiaChiDuocChon(null)
            setDistricts(response);
          } catch (error) {
            console.log("Lỗi khi gọi API huyện")
          }
        }
        fetchDistrict();
      },[provinceID])
     
       //Phần xã
       useEffect(() => {
        const fetchWard = async() => {
          if(!districtID) return;
          try {
            const response = await api_giaoHangNhanh.getWard(Number(districtID));
            setWard(response);
          } catch (error) {
            console.log("Lỗi khi gọi API xã", error)
          }
        }
        fetchWard();  
        },[districtID]);

        //Hàm lấy địa chỉ để đưa vào hóa đơn
        useEffect(()=>{
            if(provinceID){
            const selectProvince = provinces.find(prov => prov.ProvinceID === Number(provinceID));
            if(selectProvince){
                setProvinceName(selectProvince.ProvinceName);
                if(districtID){
                const selectDistrict = districts.find(dis => dis.DistrictID === Number(districtID));
                if(selectDistrict){
                    setDistrictName(selectDistrict.DistrictName)
                    if(wardID){
                    const selectWard = ward.find(ward => ward.WardCode === wardID );
                    if(selectWard){
                        setWardName(selectWard.WardName);
                    }
                    }
                }
                }
            }
            }
        },[provinceID, provinces, districtID, districtName, districts, ward, wardID])

        const validate = () => {
            if(!provinceID || !wardID || !specific){
                toast.error("Vui lòng nhập đầy đủ thông tin.");
                return;
            }
        }

         //Hàm Thêm đia chỉ
          const handleSaveDiaChi = (id) => {
            validate();
            const diaChiRequest ={
                id: id || null,
                khachHangId: client.id || null,
                tinhThanhId: Number(provinceID) || null,
                tinhThanh: provinceName || null,
                quanHuyenId: Number(districtID) || null,
                quanHuyen: districtName || null,
                phuongXaId: Number(wardID) || null,
                phuongXa: wardName || null,
                diaChiChiTiet: specific || null,
                trangThai: status
            }
            const fetchCreateDiaChi = async() => {
                try{
                    const response = await DiaChiKhachHangService.createDiaChi(diaChiRequest);
                    fetchDiaChiKH();
                    toast.success("Thêm địa chỉ thành công");
                }catch(error){
                    console.log("Không thể thêm được đia chỉ mới. Vui lòng thử lại.", error);
                }
            }
            fetchCreateDiaChi();
          }

          //Hàm save đia chỉ
          const handleUpdateDiaChi = (id) => {
            validate();
            const diaChiRequest ={
                id: id || null,
                tinhThanhId: Number(provinceID) || null,
                tinhThanh: provinceName || null,
                quanHuyenId: Number(districtID) || null,
                quanHuyen: districtName || null,
                phuongXaId: Number(wardID) || null,
                phuongXa: wardName || null,
                diaChiChiTiet: specific || null,
                trangThai: status
            }
            console.log(diaChiRequest);
            const fetchUpdateDiaChi = async() => {
                try{
                    const response = await DiaChiKhachHangService.UpdateDiaChi(diaChiRequest);
                    fetchDiaChiKH();
                    toast.success("Cập nhật địa chỉ thành công");
                }catch(error){
                    console.log("Không thể cập nhật được đia chỉ. Vui lòng thử lại.", error);
                    toast.success("Không thể cập nhật được đia chỉ. Vui lòng thử lại.");
                }
            }
            fetchUpdateDiaChi();
          }

    // Gọi API xóa địa chỉ khách hàng
    const handleDelete = (id) => {
        if(!id){
            toast.error("Có lỗi khi xóa địa chỉ. Vui long thử lại.");
            return;
        }
        const fetchDelete = async() =>{
            try{
                const response = await DiaChiKhachHangService.deleteDiaChi(id);
                fetchDiaChiKH();
                toast.success("Đã xóa địa chỉ");
            }catch(error){
                console.log("Không thể xóa địa chỉ, Vui lòng thử lại.");
            }
        }
        fetchDelete();
    }

    //Gọi API địa chỉ khách hàng;
    const fetchDiaChiKH = async()=>{
        try {
             if(!client){
                 return ;
             }
             const response = await DiaChiKhachHangService.diaChi(client.id);
             setDiaChiKH(response);
        }catch (error){
             console.log("Lỗi khi gọi API địa chỉ khách hàng", error);
        }
     }
    useEffect(() =>{
        fetchDiaChiKH();
    },[])

     //Xử lý khi tỉnh thay đổi
    
     useEffect(() => {
        if(diaChiDuocChon){
            setDistrictID(diaChiDuocChon.quanHuyenId);
            setWardID(diaChiDuocChon.phuongXaId);
            
        }else{
            if(districtID){
                setDistrictID("");
                setDistrictName("");
                setWard([]);
                setWardID("");
                setWardName("");
                if(wardID){
                    setWard([]);
                    setWardID("");
                    setWardName("");
                }
            }
        }
       
      },[provinceID, diaChiDuocChon])

    const resetDiaChi =()=>{
        setProvinceID("");
        setDistrictID("");
        setWard([]);
        setDistricts([]);
        setWardID("");
        setSpecific("");
        setDiaChiDuocChon(null);
    }

    const getDiaChi =(item)=>{
        setDiaChiDuocChon(item)
        setProvinceID(item.tinhThanhId);
        setDistrictID(item.quanHuyenId);
        setWardID(item.phuongXaId);
        setWardName(item.phuongXa);
        setStatus(item.trangThai);
        setSpecific(item.diaChiChiTiet);
    }
    return <>
        <div className="w-full bg-white p-4 rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Địa chỉ khách hàng</h1>
            <div className="space-y-4">
                <Dialog onOpenChange={() => resetDiaChi()}>
                    <DialogTrigger asChild>
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:scale-105 duration-200">
                            Thêm địa chỉ
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="font-md">Thêm Địa chỉ mới</DialogTitle>
                         {/* Địa chỉ */}
                        <h2 className="text-gray-600 font-medium">
                            địa chỉ nhận hàng
                        </h2>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="">
                                <label htmlFor="tinh" className="flex">
                                <p className="text-red-500 text-lg">*</p>
                                <h1 className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</h1>
                                </label>
                                <select
                                id="tinh"
                                className="select select-bordered w-full max-w-xs"
                                onChange={(e) => setProvinceID(e.target.value)}
                                value={provinceID}
                                >
                                <option defaultChecked>Tỉnh / Thành phố</option>
                                {provinces.map((pro) => (
                                    <option key={pro.ProvinceID} value={pro.ProvinceID}>
                                    {pro.ProvinceName}
                                </option>
                                ))}
                                </select>
                            </div>

                            <div className="">
                                <label htmlFor="huyen" className="flex">
                                <p className="text-red-500 text-lg">*</p>
                                <h1 className="block text-sm font-medium text-gray-700 mb-1">Huyện / Quận</h1>
                                </label>
                                <select
                                id="huyen"
                                className="select select-bordered w-full max-w-xs"
                                onChange={(e) => setDistrictID(e.target.value)}
                                value={districtID}
                                >
                                <option defaultChecked>Huyện / Quận</option>
                                {districts.map((dis) => (
                                    <option key={dis.DistrictID} value={dis.DistrictID}>
                                    {dis.DistrictName}
                                </option>
                                ))}
                                </select>
                            </div>

                            <div className="">
                                <label htmlFor="xa" className="flex">
                                <p className="text-red-500 text-lg">*</p>
                                <h1 className="block text-sm font-medium text-gray-700 mb-1">Xã / Phường</h1>
                                </label>
                                <select
                                id="xa"
                                className="select select-bordered w-full max-w-xs"
                                onChange={(e) => setWardID(e.target.value)}
                                value={wardID}
                                >
                                <option defaultChecked>Xã / Phường</option>
                                {ward.map((w) => (
                                    <option key={w.WardCode} value={w.WardCode}>
                                    {w.WardName}
                                </option>
                                ))}
                                </select>
                            </div>
                            <div>
                            <label htmlFor="place" className="flex">
                                <p className="text-red-500 text-lg">*</p>
                                <h1 className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</h1>
                                </label>
                                <input
                                id="place"
                                value={specific}
                                onChange={(e) => setSpecific(e.target.value)}
                                type="text"
                                placeholder="Địa chỉ cụ thể"
                                className="input input-bordered w-[400px]"
                                />
                            </div>
                           
                        </div> 
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                            checked={status}
                            onCheckedChange={() => setStatus(!status)}
                            id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Đặt làm mặc định
                            </label>
                        </div> 
                        <DialogFooter >
                            <DialogClose className="px-4 py-2 bg-gray-300 rounded-lg hover:scale-105 duration-200 mr-4">Hủy</DialogClose>
                            <button onClick={()=> handleSaveDiaChi()} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:scale-105 duration-200 ">
                                Thêm
                            </button>
                        </DialogFooter>  
                    </DialogContent>
                </Dialog>
                
                {diaChiKH.map((item) =>(
                    <div key={item.id} className="relative">
                         <hr className="border-gray-400" />
                        <div  className="p-4 flex items-center space-x-4">
                            <h1 className="text-gray-500 text-sm">Địa chỉ: 
                                <span className="text-black text-sm ml-2">{`${item.diaChiChiTiet}, ${item.phuongXa}, ${item.quanHuyen}, ${item.tinhThanh}`}</span>
                            </h1>
                            {item.trangThai && <p className="text-green-500 text-xs flex"><AiFillDownCircle/> địa chỉ mặc định</p>} 
                        </div>
                       <div className="absolute right-2 top-3 flex items-center space-x-4 ">
                         <Dialog onOpenChange={() => getDiaChi(item)}>
                            <DialogTrigger asChild>
                                <button className="text-orange-500 ">Chỉnh sửa địa chỉ</button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Cập nhật địa chỉ
                                    </DialogTitle>
                                </DialogHeader>
                                {/* Địa chỉ */}
                                <h2 className="text-gray-600 font-medium">
                                    địa chỉ nhận hàng
                                </h2>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="">
                                        <label htmlFor="tinh" className="flex">
                                        <p className="text-red-500 text-lg">*</p>
                                        <h1 className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</h1>
                                        </label>
                                        <select
                                        id="tinh"
                                        className="select select-bordered w-full max-w-xs"
                                        onChange={(e) => setProvinceID(e.target.value)}
                                        value={provinceID}
                                        >
                                        <option defaultChecked>Tỉnh / Thành phố</option>
                                        {provinces.map((pro) => (
                                            <option key={pro.ProvinceID} value={pro.ProvinceID}>
                                            {pro.ProvinceName}
                                        </option>
                                        ))}
                                        </select>
                                    </div>

                                    <div className="">
                                        <label htmlFor="huyen" className="flex">
                                        <p className="text-red-500 text-lg">*</p>
                                        <h1 className="block text-sm font-medium text-gray-700 mb-1">Huyện / Quận</h1>
                                        </label>
                                        <select
                                        id="huyen"
                                        className="select select-bordered w-full max-w-xs"
                                        onChange={(e) => setDistrictID(e.target.value)}
                                        value={districtID}
                                        >
                                        <option defaultChecked>Huyện / Quận</option>
                                        {districts.map((dis) => (
                                            <option key={dis.DistrictID} value={dis.DistrictID}>
                                            {dis.DistrictName}
                                        </option>
                                        ))}
                                        </select>
                                    </div>

                                    <div className="">
                                        <label htmlFor="xa" className="flex">
                                        <p className="text-red-500 text-lg">*</p>
                                        <h1 className="block text-sm font-medium text-gray-700 mb-1">Xã / Phường</h1>
                                        </label>
                                        <select
                                        id="xa"
                                        className="select select-bordered w-full max-w-xs"
                                        onChange={(e) => setWardID(e.target.value)}
                                        value={wardID}
                                        >
                                        <option defaultChecked>Xã / Phường</option>
                                        {ward.map((w) => (
                                            <option key={w.WardCode} value={w.WardCode}>
                                            {w.WardName}
                                        </option>
                                        ))}
                                        </select>
                                    </div>
                                    <div>
                                    <label htmlFor="place" className="flex">
                                        <p className="text-red-500 text-lg">*</p>
                                        <h1 className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</h1>
                                        </label>
                                        <input
                                        id="place"
                                        value={specific}
                                        onChange={(e) => setSpecific(e.target.value)}
                                        type="text"
                                        placeholder="Địa chỉ cụ thể"
                                        className="input input-bordered w-[400px]"
                                        />
                                    </div>
                                
                                </div> 
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                    checked={status}
                                    onCheckedChange={() => setStatus(!status)}
                                    id="terms" />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Đặt làm mặc định
                                    </label>
                                </div> 
                                <DialogFooter >
                                    <DialogClose className="px-4 py-2 bg-gray-300 rounded-lg hover:scale-105 duration-200 mr-4">Hủy</DialogClose>
                                    <button onClick={()=> handleUpdateDiaChi(item?.id)} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:scale-105 duration-200 ">
                                        Cập nhật
                                    </button>
                                </DialogFooter>  
                            </DialogContent>
                         </Dialog>
                         {!item.trangThai && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button  className="text-red-600">xóa</button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Xác nhận trước khi xóa!</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogDescription>
                                        Bạn có chắc chắn xóa địa chỉ này không ?
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(item.id)}
                                        className="bg-orange-500 hover:bg-orange-500 hover:scale-105 duration-200">
                                            Xóa
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                         )}
                       </div>
                       
                    </div>
                ))}
                
            </div>
        </div>
    </>
}
export default DiaChi;