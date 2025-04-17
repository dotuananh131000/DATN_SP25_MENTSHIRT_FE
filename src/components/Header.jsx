import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import {motion} from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { logOutSuccess } from "@/features/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TbBellRinging2Filled } from "react-icons/tb";
import ChangePasswordService from "@/services/ChangePasswordService";
import ThongBaoService from "@/services/ThongBaoService";
import dayjs from "dayjs";
import UseNotificationSocket from "@/lib/useNotificationSoket";
function Header() {
  const user = useSelector((state)=> state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isChange, setIsChange] = useState(true);
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
    if(!user.id || !form){
      console.log("Có lỗi khi gọi fetch API");
      return;
    }

    try {
      const response = await ChangePasswordService.changePasswordEmployee(id, form);
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

      const newError = {}

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
        fetchChangePassword(user.id, formChange)
      }
  }

  const handleLogout = () => {
    dispatch(logOutSuccess());
    navigate("/login");
  }

   const formatDate = (dateString) => {
      return dayjs(dateString).format("HH:mm:ss DD/MM/YYYY");
    };

  //Lấy thông báo của nhân viên
  const [thongBao, setThongBao] = useState([]);
  const fetchThongBao = async () => {
    try {
      const response = await ThongBaoService.GetAll(user.id);
      setThongBao(response);
    }catch (err){
      console.log("Không thể lấy danh sách thông báo của nhân viên", err);
    }
  }
  useEffect(() => {
    fetchThongBao();
  }, [])

  //Đã đọc
  const fetchSeen =async (id) => {
    try {
      await ThongBaoService.SEEN(id);
      fetchThongBao();
    }catch (err) {
      console.log("Lỗi khi đọc thông báo",err);
    }
  } 

  const handleClickDieuHuong = (id) => {
    fetchSeen(id)
    navigate("/admin/order")
  }

  const handleNewThongBao = (newNotification) => {
    setThongBao((prev) => [newNotification, ...prev]);
  }

  UseNotificationSocket(handleNewThongBao)

  //Đếm số lượng thong báo chưa đọc
  const thonngBaoChuaDoc = thongBao.filter(item => !item.daDoc);
  const soLuongChuaDoc = thonngBaoChuaDoc.length;


  return (
    <>
    <div className="header w-full h-12 relative ">
      <Sheet>
        <SheetTrigger asChild>
          <div className="absolute right-56 top-3  ">
            <div className="relative">
              <button
              // onClick={handleClickThongBao}
              className="text-2xl text-orange-500">
                <TbBellRinging2Filled />
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 h-4 flex items-center justify-center">
                {soLuongChuaDoc}
              </span>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Thông báo
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 ">
            {thongBao.map((item)=>(
              <div key={item.id}
              onClick={() => handleClickDieuHuong(item.id)} 
              className={`m-2 p-2 rounded-lg ${item.daDoc ?"bg-gray-100" :"bg-gray-300"} cursor-pointer active:scale-95 duration-200`}>
                <p className="font-">{item.noiDung}</p>
                <p className="text-orange-500">{formatDate(item.thoiGianTao)}</p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
     
      <div className="flex justify-center items-center gap-2 absolute right-8">
        <img src={user.avatarUrl} alt="" 
        className="skeleton h-7 w-7 border border-b border-gray-500 " />

        <Sheet onOpenChange={() => setIsChange(false)}>
          <SheetTrigger asChild>
            <Button className="bg-white text-black shadow-none hover:scale-105 duration-200 hover:bg-white">
              {user.tenNhanVien}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Tài khoản của bạn</SheetTitle>
            </SheetHeader>
            <motion.div className="mt-4">
              <div className="w-full flex justify-center items-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatarUrl}></AvatarImage>
                  <AvatarFallback>AVT</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4 border border-orange-500 rounded-lg p-2">
                {/* Thông tin tài khoản */}
                {!isChange && (
                    <div>
                      <div className="grid grid-cols-1 m-2">
                        <label htmlFor="ma" className="text-sm text-gray-500">Mã nhân viên:</label>
                        <input type="text" id="ma" 
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                        value={user.maNhanVien}/>
                      </div>

                      <div className="grid grid-cols-1 m-2">
                        <label htmlFor="ten" className="text-sm text-gray-500">Tên nhân viên:</label>
                        <input type="text" id="ten" 
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                        value={user.tenNhanVien}/>
                      </div>

                      <div className="grid grid-cols-1 m-2">
                        <label htmlFor="email" className="text-sm text-gray-500">Email:</label>
                        <input type="text" id="email" 
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={user.email}/>
                      </div>

                      <div className="grid grid-cols-1 m-2">
                        <label htmlFor="ten" className="text-sm text-gray-500">Số Điện Thoại:</label>
                        <input type="text" id="ten"
                        readOnly 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={user.soDienThoai}/>
                      </div>

                      <div className="grid grid-cols-1 m-2">
                        <label htmlFor="ten" className="text-sm text-gray-500">Vai trò:</label>
                        <input type="text" id="ten" 
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={user.vaiTro.maVaiTro}/>
                      </div>
                  </div>
                )}
                 
                 {/* Thay đổi mật khẩu */}
                 {isChange && (
                    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Đổi mật khẩu</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                 )}
                 
                <div className="flex justify-between items-center p-2 mt-3">
                  <button className="bg-orange-500 hover:scale-105 hover:bg-orange-600 duration-200 px-4 py-3 rounded-lg text-white"
                  onClick={() => setIsChange(!isChange)}
                  >
                    {isChange?"Quay lại":"Thay đổi mật khẩu"}
                  </button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="bg-gray-600 hover:scale-105 hover:bg-gray-700 duration-200 px-4 py-3 rounded-lg text-white">
                        Đăng xuất
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogTitle>Xác nhận</DialogTitle>
                      <DialogHeader>
                        Xác nhận đăng xuất tài khoản này !
                      </DialogHeader>
                      <div className="flex justify-center items-center space-x-4">
                        <DialogClose className="bg-gray-500 px-4 py-2 rounded-lg text-white shadow-lg">
                          Hủy
                        </DialogClose>
                        <button className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:scale-105 duration-200"
                        onClick={handleLogout}
                        >Xác nhận
                        </button>    
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                </div>
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
   
   
    </>
  );
}
export default Header;
