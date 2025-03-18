import { useState } from "react";
import { useSelector } from "react-redux";

function Header() {
  const user = useSelector((state)=> state.auth.user);
  const [isModal, setIsModal] = useState(false);
  // console.log(user);
  return (
    <>
    <div className="header w-full h-12 relative ">
      <div className="flex justify-center items-center gap-2 absolute right-8">
        <img src={user.avatarUrl} alt="" 
        className="skeleton h-7 w-7 border border-b border-gray-500 " />
        <span className="hover:scale-105 duration-300" onClick={()=>setIsModal(!isModal)}>
          {user.tenNhanVien}
          </span>
      </div>
    </div>
    {isModal && 
    (
      <div className="relative ">
        <div className="absolute right-2 top-[-10px] border  grid grid-flow-row-dense justify-center 
        h-60 w-1/4 px-4 py-3 bg-orange-400 text-gray-100 shadow-sm rounded-lg">
          <h1 className="text-center text-xl">Thông tin nhân viên</h1>
          <div className="flex justify-start items-center space-x-2">
            <h1>Tên nhân viên:</h1>
            <span>{user.tenNhanVien}</span>
          </div>
          <div className="flex justify-start items-center space-x-2">
            <h1>Mã nhân viên :</h1>
            <span>{user.maNhanVien}</span>
          </div>
          <div className="flex justify-start items-center space-x-2">
            <h1>Email :</h1>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-start items-center space-x-2">
            <h1>Số điện thoại :</h1>
            <span>{user.soDienThoai}</span>
          </div>
          <div className="flex justify-start items-center space-x-2">
            <h1>Giới tính :</h1>
            <span>{user.gioiTinh ===0?"Nam":"Nữ"}</span>
          </div>
          <div className="flex justify-start items-center space-x-2">
            <h1>Vai trò :</h1>
            <span>{user.vaiTro.maVaiTro}</span>
          </div>
        </div>
      </div>
    )}
   
    </>
  );
}
export default Header;
