import CustomerService from "@/services/CustomerService";
import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { toast } from "react-toastify";
export default function KhachHangModal({
  khList,
  isClose,
  handleUpdateKhOfHd,
  keywordKH,
  setKeywordKH,
  fetchDataKhachHang,
  setKhList
}) {
  const handleIdKH = (id) => {
    handleUpdateKhOfHd(id);
    isClose(false);
  };

  const ChangeKeyword = (e) => {
    const newKey = e.target.value;
    setKeywordKH(newKey);
  }

  const handleSearch = () => {
    fetchDataKhachHang();
  }

  const handleClose = () => {
    isClose(false);
    setKeywordKH("");
  }

  //Thêm nhanh khách hàng
  const [isAdd, setIsAdd] = useState(false);
  const [formAdd, setFormAdd] = useState({
    tenKhachHang: "",
    soDienThoai: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormAdd((prev) => ({
      ...prev, [e.target.id]: e.target.value
    }))
  }

  const [errors, setErrors] = useState({});
    
      //Hàm validate
      const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formAdd.email.trim()) {
          tempErrors.email = "Email không được để trống";
          isValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formAdd.email)) {
          tempErrors.email = "Email không hợp lệ";
          isValid = false;
        }

        if (!formAdd.tenKhachHang.trim()){
          tempErrors.tenKhachHang = "Tên Khách hàng không được để trống !";
          isValid = false
        }

        const phoneRegex = /^[0-9]{10,11}$/; 
        if(!phoneRegex.test(formAdd.soDienThoai)){
          tempErrors.soDienThoai = "Số điện thoại không hợp lệ";
          isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
      };

  const handleAddKhachHang = async () => {
    if (validate()){
      const form = {
        tenKhachHang: formAdd.tenKhachHang || null,
        soDienThoai: formAdd.soDienThoai || null,
        email: formAdd.email || null,
      }
      try {
        const response = await CustomerService.themNhanh(form);
        setKhList((prev) => ([response.data, ...prev]))
      }catch (err){
        console.log("Không thể thêm nhanh khách hàng", err);
        toast.warning("Số điện thoại hoặc email đã tồn tại");
      }
    }
    
  }

  //Đóng modal thêm mới
  const handleCancel = () => {
    setIsAdd(false);
    setFormAdd((prev) => ({...prev,
      tenKhachHang: "",
      soDienThoai: "",
      email: "", }))
      setErrors({})
  }

  return (
    <>
    

    <div className="modal modal-open">
      <div className="modal-box relative max-w-5xl w-full">
        <h1>Chọn khách hàng</h1>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        
        <div className="flex justify-between items-center mt-3">
          <div className="w-2/3 border border-gray-300 rounded-lg ">
            <button
            onClick={handleSearch}
            className="px-3 py-2 bg-orange-500 rounded-lg text-white mr-2">Tìm</button>
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng theo số điện thoại..."
                onChange={(e) => ChangeKeyword(e)}
                className="w-2/3 px-2 py-1 focus:outline-none"
              />
          </div>
          <button 
          onClick={() => setIsAdd(true)}
          className="px-3 py-2 bg-orange-500 hover:bg-orange-600 duration-200 text-white rounded-lg">Thêm mới</button>
        </div>

        <table className="table table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">Ảnh</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Họ tên</th>
              <th className="px-4 py-2">Ngày sinh</th>
              <th className="px-4 py-2">Số điện thoại</th>
              <th className="px-4 py-2">Giới tính</th>
              <th className="px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {khList.map((kh, i) => (
              <tr key={kh.id} className="hover:bg-gray-100 text-center">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={kh?.hinhAnh}
                    alt="Đây là ảnh KH"
                    className="skeleton w-10 h-10 object-cover"
                  />
                </td>
                <td className="px-4 py-2">{kh.email}</td>
                <td className="px-4 py-2">{kh.tenKH}</td>
                <td className="px-4 py-2">{kh.ngaySinh}</td>
                <td className="px-4 py-2">{kh.soDienThoai}</td>
                <td className="px-4 py-2">
                  {kh.gioiTinh === 1 ? "Nữ" : "Nam"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleIdKH(kh.id)}
                    className="text-orange-500 p-2 text-lg"
                  >
                    <AiOutlineCheck />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {isAdd && (
      <div className="modal modal-open">
        <div className="modal-box">
          <h1 className="text-lg">Thêm khách hàng</h1>
          <div className="mt-4">
            <label htmlFor="tenKhachHang">Tên khách hàng</label>
            <input type="text" name="tenKhachHang" id="tenKhachHang"
            onChange={(e) => handleChange(e)}
            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300" />
            {errors.tenKhachHang && (<p className="text-red-500 text-sm">{errors.tenKhachHang}</p>)}

            <label htmlFor="soDienThoai">Số Điện thoại</label>
            <input type="text" name="soDienThoai" id="soDienThoai"
            onChange={(e) => handleChange(e)} 
            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300" />
            {errors.soDienThoai && (<p className="text-red-500 text-sm">{errors.soDienThoai}</p>)}

            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" 
            onChange={(e) => handleChange(e)}
            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300" />
            {errors.email && (<p className="text-red-500 text-sm">{errors.email}</p>)}

          </div>
          
          <div className="flex justify-end space-x-4 mt-2">
            <button 
            onClick={handleCancel}
            className="px-3 py-2 bg-gray-300 rounded-lg hover:bg-gray-200 duration-200">Hủy</button>
            <button 
            onClick={handleAddKhachHang}
            className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 duration-200">Thêm</button>
          </div>
        </div>
    </div>
    )}

    </>
  );
}
