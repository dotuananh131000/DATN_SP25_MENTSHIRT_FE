import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

const PrivateRounte = () =>{
    const user = useSelector((state)=> state.auth.user); // Lấy thông tin người dùng từ Redux

    if(!user){
        return <Navigate to="/login" replace /> // Nếu không có user, chuyển hướng về trang login
    }

    return <Outlet />
}
export default PrivateRounte;