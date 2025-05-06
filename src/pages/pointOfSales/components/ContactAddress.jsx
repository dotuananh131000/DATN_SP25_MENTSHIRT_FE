import { MdPlace } from "react-icons/md";

function ContactAddress () {
    return <>
        <div className="relative bg-gray-200 mr-3 rounded-lg p-2 ">
            <h1 className="absolute -top-0 right-3 flex items-center ">
              <MdPlace /> Chọn địa chỉ
            </h1>  
            <div className="grid grid-cols-2 mt-4">
                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="hoTenNguoiNhan">Họ tên người nhận</label>
                    <input type="text" id="hoTenNguoiNhan" 
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300" />
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="soDienThoai">Số điện thoại</label>
                    <input type="text" id="soDienThoai" 
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                    />
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" 
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
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"   
                    >
                        <option defaultChecked>Tỉnh / Thành Phố</option>  
                    </select>
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="quanHuyen">Huyện / Quận</label>
                    <select
                    id="quanHuyen"
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"   
                    >
                        <option defaultChecked>Huyện / Quận</option>  
                    </select>
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="xaPhuong">Xã / Phường</label>
                    <select
                    id="xaPhuong"
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"   
                    >
                        <option defaultChecked>Xã / Phường</option>  
                    </select>
                </div>

                <div className="grid grid-cols-1 mx-2 my-2">
                    <label htmlFor="diaChiCuThe">Địa chỉ cụ thể</label>
                    <input type="text" id="diaChiCuThe" 
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                    />
                </div>
            </div>
        </div>
    </>
}
export default ContactAddress;