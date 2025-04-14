import api_giaoHangNhanh from "@/pages/counterSales/services/GiaoHangNhanhService";
import Address from "@/services/AdressSerrvice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function InfoClient(){

    const client = useSelector((state) => state.authClient?.client);
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

         //Xử lý khi tỉnh thay đổi
         useEffect(() => {
            setDistrictID("");
            setWard([]);
            setWardID("");
            setDistrictName("");
            setWardName("");
          },[provinceID])
        
          //Xủa lý khi thay đổi huyện
          useEffect(() => {
            setWardID("")
            setWardName("")
          },[districts,districtID])

    // Gọi API lấy địa chỉ mặc định của khách hàng
    const [address, setAddress] = useState({});
    const fetchAddress = async () => {
      try{
        const response = await Address.DefaultAdress(client.id);
        setAddress(response.data);
      }catch (error){
        console.log("Không thể lấy địa chỉ mặc đinh của khách", error);
      }
    }

    useEffect(()=>{
      fetchAddress();
    },[])

    const diaChi = `${address.diaChiChiTiet}, ${address.phuongXa}, ${address.quanHuyen}, ${address.tinhThanh}`;
    
    return <>
        <div className="w-full bg-white p-4 rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tài khoản</h1>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 ">
                    {/* Tên khách hàng */}
                    <div className="flex flex-col mb-4">
                    <label className="text-gray-600 font-medium">Tên khách hàng</label>
                    <input type="text" value={client.tenKhachHang}  disabled
                    className="input-field w-56 p-2 border border-gray-400 rounded-lg" placeholder="Nhập tên khách hàng" />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col mr-4">
                    <label className="text-gray-600 font-medium">Email</label>
                    <input type="email" value={client.email} disabled
                    className="input-field w-56 p-2 border border-gray-400 rounded-lg" placeholder="Nhập email" />
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex flex-col mr-4">
                    <label className="text-gray-600 font-medium">Số điện thoại</label>
                    <input type="tel" value={client.soDienThoai} disabled
                    className="input-field w-56 p-2 border border-gray-400 rounded-lg" placeholder="Nhập số điện thoại" />
                    </div>
                </div>

                {/* Địa chỉ */}
                <h2 className="text-gray-600 font-medium">
                    địa chỉ nhận hàng
                </h2>
                <input type="text" value={diaChi}  disabled
                className="input-field w-1/2 p-2 border border-gray-400 rounded-lg" />
            </div>
        </div>
    </>
}
export default InfoClient;