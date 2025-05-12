import apiClients from "@/api/ApiClient";
import Address from "@/services/AdressSerrvice";
import api_giaoHangNhanh from "@/services/GiaoHangNhanhService";
import { useEffect, useState } from "react";
import { MdPlace } from "react-icons/md";

function ContactAddress ({ customer, setFee, setFormOrder, formOrder }) {

    // Lấy danh sách tỉnh thành
    const [province, setProvince] = useState([]);
    const [provinceID, setProvinceID] = useState("");
    const getProvinces = async () => {
        try {
            const response = await api_giaoHangNhanh.getProvince();
            setProvince(response);
        }catch (err) {
            console.log("Lỗi khi lấy API tỉnh thành", err);
        }
    }
    useEffect(() => {
        getProvinces();
    }, []);

    // Lấy danh sách huyện
    const [district, setDistrict] = useState([]);
    const [districtID, setDistrictID] = useState("");
    const fetchAPIDistrict = async () => {
        if (!provinceID) {
        return;
        }
        try {
            const response = await api_giaoHangNhanh.getDistrict(provinceID);
            setDistrict(response);
            if(Object.keys(customer).length <= 0){
                setDistrictID(response[0].DistrictID)
            }  
        } catch (error) {
        console.log("Không thể lấy được dữ liệu district", error);
        }
    };
    useEffect(() => {
        fetchAPIDistrict();
    },[provinceID]);

    // Lấy danh sách xã
    const [ward, setWard] = useState([]);
    const [wardID, setWardID] = useState("");
    const fetchAPIWard = async () => {
        if (!districtID) {
        return;
        }
        try {
            const response = await api_giaoHangNhanh.getWard(districtID);
            setWard(response);
            if(Object.keys(customer).length <= 0){
                setWardID(response[0].WardCode);
            }    
        } catch (error) {
            console.log("Không thể lấy được dữ liệu ward", error);
        }
    };
    useEffect(() => {
        setTimeout(() =>{
            fetchAPIWard();
        },200);   
    },[districtID]);

    // Hàm lấy mã dịch vụ vận chuyển
    const [serviceId, setServiceId] = useState("");
    const fetchServiceId = async () => {
        if(!districtID) return;
        try {
            const response = await api_giaoHangNhanh.getServiceId(Number(districtID));
            setServiceId(response.data[0]?.service_id);
        }catch (err){
            console.log("Lỗi khi gọi API serviceID", err);
        }
    }
    useEffect(() => {
        fetchServiceId();
    }, [districtID]);

    // Hàm tính phí ship 
    const fetchFee = async () => {
    try {
        if(!serviceId || !districtID || !wardID) return;
      const response = await api_giaoHangNhanh.getFeeGHN(
        serviceId,
        Number(districtID),
        wardID.toString()
      );
      setFee(response.data.service_fee);
    } catch (error) {
      console.log("Không thể tính được phí ship.", error);
      setWardID("");
    }
  };

     // Hàm lấy địa chỉ khách hàng
    const [addressDefault, setAddressDefaul] = useState({});
    const fetchAddressDefault = async () =>{
        try {
            if(!customer.id) return;
            const response = await Address.DefaultAdress(customer.id);
            const df = response.data;
            setAddressDefaul(df);
            setProvinceID(df.tinhThanhId);
            setDistrictID(df.quanHuyenId);
            setWardID(df.phuongXaId);
        }catch (err){
            console.log("Lỗi khi gọi địa chỉ mặc định", err);
        }
    }
    useEffect(() => {
        fetchAddressDefault();
    }, [customer]);

    useEffect(() => {
        fetchFee();
    }, [serviceId, districtID, wardID]);

    //Hàm lấy địa chỉ nhận hàng
    const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");
    const [cuThe, setCuThe] = useState("");

    useEffect(()=>{
        if(provinceID){
        const selectProvince = province.find(prov => prov.ProvinceID === Number(provinceID));
        if(selectProvince){
            setProvinceName(selectProvince.ProvinceName);
            if(districtID){
            const selectDistrict = district.find(dis => dis.DistrictID === Number(districtID));
            if(selectDistrict){
                setDistrictName(selectDistrict.DistrictName)
                if(wardID){
                const selectWard = ward.find(ward => ward.WardCode === wardID.toString());
                if(selectWard){
                    setWardName(selectWard.WardName);
                }
                }
            }
            }
        }
        }
    },[provinceID, province, districtID, districtName, district, ward, wardID])

    // Lấy thông tin địa chỉ nhanah hàng
    useEffect(() => {
        if(cuThe && wardName && districtName && provinceName){
             setFormOrder((prev) => (
                {...prev,
                    diaChiNhanHang: `${cuThe}, ${wardName}, ${districtName}, ${provinceName}`,
                }
            ))
        }
    }, [provinceName, districtName, wardName, addressDefault]);


    useEffect(() => {
        setFormOrder((prev) => (
            {...prev,
                hoTenNguoiNhan: customer.tenKhachHang || "",
                soDienThoai: customer.soDienThoai || "",
                email: customer.email || "",
            }
        ))
        setCuThe(addressDefault.diaChiChiTiet)
    },[customer, addressDefault]);


    return <>
        <div className="relative bg-gray-200 mr-3 rounded-lg p-2 ">
            <h1 className="absolute -top-0 right-3 flex items-center ">
              <MdPlace /> Chọn địa chỉ
            </h1>  
            <div className="grid grid-cols-2 mt-4">
                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="hoTenNguoiNhan">Họ tên người nhận</label>
                    <input type="text" id="hoTenNguoiNhan"
                    value={formOrder.hoTenNguoiNhan} 
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300" />
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="soDienThoai">Số điện thoại</label>
                    <input type="text" id="soDienThoai" 
                    value={formOrder.soDienThoai} 
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                    />
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" 
                    value={formOrder.email} 
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                    />
                </div>
            </div>  

            {/* Select địa chỉ */}
            <div className="grid grid-cols-3">
                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="tp">Tỉnh/ Thành phố</label>
                    <select
                    id="tp"
                    onChange={(e) => setProvinceID(e.target.value)}
                    value={provinceID}
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"   
                    >
                        <option defaultChecked>Tỉnh / Thành Phố</option> 
                        {province.map((item) => (
                             <option key={item.ProvinceID} value={item.ProvinceID} >
                                {item.ProvinceName}
                             </option> 
                        ))}  
                    </select>
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="quanHuyen">Huyện / Quận</label>
                    <select
                    id="quanHuyen"
                    onChange={(e) => setDistrictID(e.target.value)}
                    value={districtID}
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"   
                    >
                        <option defaultChecked>Huyện / Quận</option> 
                        {district.map((item) => (
                             <option key={item.DistrictID} value={item.DistrictID} >
                                {item.DistrictName}
                             </option> 
                        ))}  
                    </select>
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="xaPhuong">Xã / Phường</label>
                    <select
                    id="xaPhuong"
                    onChange={(e) => setWardID(e.target.value)}
                    value={wardID}
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"   
                    >
                        <option defaultChecked>Xã / Phường</option> 
                        {ward.map((item) => (
                             <option key={item.WardCode} value={item.WardCode} >
                                {item.WardName}
                             </option> 
                        ))}   
                    </select>
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="diaChiCuThe">Địa chỉ cụ thể</label>
                    <input type="text" id="diaChiCuThe" 
                    value={cuThe}
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                    />
                </div>
            </div>
        </div>
    </>
}
export default ContactAddress;