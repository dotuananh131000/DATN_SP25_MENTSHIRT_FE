import ChangePasswordService from "@/services/ChangePasswordService";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function DoiMaTKhau(){

    const client = useSelector((state) => state.authClient?.client);

    const [formChange, setFormChange] = useState({oldPassword:"", newPassword:"", confirmPassword:""});
    const [error, setError] = useState({
        oldPassword:"",
        newPassword:"",
        confirmPassword:"",
      })
    
      // hàm xử lý nhập liệu
      const handleChange = (e) => {
        setFormChange({...formChange, [e.target.id]: e.target.value});
      }
    
      // hàm validate password
      const passwordRegex = /^(?=.*[A-Z])(?=.*[@#$%^&+=!])[A-Za-z0-9@#$%^&+=!]{8,}$/;
      const handleValidate = (password) => {
        return passwordRegex.test(password);
      }
    
    // Hàm sử fetch API đổi mật khẩu
    const fetchChangePassword = async (id, form) => {
        if(!client.id || !form){
        console.log("Có lỗi khi gọi fetch API");
        return;
        }

        try {
        const response = await ChangePasswordService.ChangPasswordCustomer(id, form);
        toast.success("Đổi mật khẩu thành công!");
        setIsChange(false);
        }catch (error) {
        if(error.response && error.response.status === 400){
            setError({...error, oldPassword:"Mật khẩu hiện tại không chính xác!"})
        }else {
            console.log("Lỗi không xác định", error);
        }
        }
    }

     // hàm xử lý submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const newError = {};

        if(formChange.oldPassword.length < 1){
        newError.oldPassword = "Sao lại bỏ trống mật khẩu hiện tại vậy!";
        }else{
        newError.oldPassword = "";
        }

        if(!handleValidate(formChange.newPassword)){
        newError.newPassword = "Mật khẩu tối thiểu là 8 kí tự, có ít nhất một chữ hoa và kí tự đặc biệt!";
        }else{
        newError.newPassword = "";
        }

        if(formChange.confirmPassword !== formChange.newPassword){
        newError.confirmPassword = "Mật khẩu xác nhận không khớp";
        }else{
        newError.confirmPassword = "";
        }

        setError(newError);

        const hasError = Object.values(newError).some((message) => message !== "")
        if(!hasError){
        fetchChangePassword(client.id, formChange)
        }
    }

    return <>
        <div className="w-full bg-white p-4 rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Thay đổi mật khẩu</h1>
            <div className="flex justify-center">
                    <form className="space-y-4 w-1/2" onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="oldPW" className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          id="oldPassword"
                          placeholder="Nhập mật khẩu hiện tại"
                          value={formChange.oldPassword}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {error.oldPassword && (
                          <p className="text-red-500 text-sm mt-1">{error.oldPassword}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="newPW" className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          placeholder="Nhập mật khẩu mới"
                          value={formChange.newPassword}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {error.newPassword && (
                          <p className="text-red-500 text-sm mt-1">{error.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="confirmPW" className="block text-sm font-medium text-gray-700 mb-1">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          placeholder="Xác nhận mật khẩu mới"
                          value={formChange.confirmPassword}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {error.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition duration-300 font-semibold"
                      >
                        Xác nhận
                      </button>
                    </form>
            </div>
        </div>
    </>
}
export default DoiMaTKhau;