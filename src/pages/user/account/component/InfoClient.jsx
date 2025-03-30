import api_giaoHangNhanh from "@/pages/counterSales/services/GiaoHangNhanhService";
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
      const [serviceID, setServiceID] = useState("");
      const [shippingFee, setShippingFee] = useState(0);
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
    return <>
        <div className="w-full bg-white p-4 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tài khoản</h1>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 ">
                    {/* Tên khách hàng */}
                    <div className="flex flex-col mb-4">
                    <label className="text-gray-600 font-medium">Tên khách hàng</label>
                    <input type="text" value={client.tenKhachHang}  disabled
                    className="input-field w-56 p-2 border border-gray-400 rounded-lg none" placeholder="Nhập tên khách hàng" />
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
            </div>
        </div>
    </>
}
export default InfoClient;