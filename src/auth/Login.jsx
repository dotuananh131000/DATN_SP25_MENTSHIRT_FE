import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import login from "../api/Auth";
import { loginSuccess } from "../features/AuthSlice";
import axios from "axios";
function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.auth?.user);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
            const response = await login.CheckLogin(email, password)
            //   console.log(response.data.token);
            const token = response.data.token;

            const userRes = await axios.get(`http://localhost:8080/api/nhan-vien/myAccount`,
                {
                    headers:{Authorization: `Bearer ${token}`}
                }
            );
            const userInfo ={
                token: token,
                ...userRes.data.data
            }
            dispatch( loginSuccess(userInfo)); // Lưu token vào context
            navigate("/admin"); // Chuyển hướng sau khi đăng nhập thành công
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Lỗi đăng nhập từ server!");
            } else {
                setError("Không thể kết nối đến server!");
            }
        }finally {
            setLoading(false); // Cho phép nhấn lại nút
        }
      };
    return <>
    {error && <p className="error">{error}</p>}
    {user && <p>Đã đăng nhập với email: {user.email}</p>}
   <section  className=" bg-gray-50 min-h-screen flex justify-center items-center ">
        {/* Login container */}
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
            {/* form */}
            <div className="md:w-1/2 px-16">
                <h1 className="font-bold text-2xl text-[#002D74]">Login</h1>
                <p className="text-sm mt-4 text-[#002D74]">If you already a member, easily login</p>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input className="p-2 mt-8 rounded-xl border" type="email" name="email" placeholder="Email"
                    value={email} onChange={(e)=> setEmail(e.target.value)}
                    />
                    <div className="relative">
                        <input className="p-2 rounded-xl border w-full" type="password" name="password" placeholder="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"><FaRegEye /></p>
                    </div>
                    <button 
                    className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
                    disabled={loading}
                    >
                    {loading ? "Đang đăng nhập..." : "Login"}
                    </button>
                </form>
                <div className="mt-10 grid grid-cols-3 items-center text-gray-500">
                    <hr className="border-gray-400"/>
                    <p className=" text-center text-sm">Or</p>
                    <hr className="border-gray-400"/>
                </div>
                <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm
                hover:scale-105 duration-300">
                    <FcGoogle className="w-[25px] h-[25px] mr-3" />
                    Login with google
                </button>
                <p className="text-xs mt-5 border-b border-gray-400 py-4">Forgot your password</p>
                <div className="text-xs flex justify-between items-center mt-3">
                    <p>Don't have an account...</p>
                    <button className="py-2 px-5 border rounded-xl hover:scale-110 duration-300">Register</button>
                </div>
            </div>
            {/* image */}
            <div className="md:block hidden w-1/2 p-5">
                <img className="rounded-2xl hover:scale-105 duration-500" 
                src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80" 
                alt="" />
            </div>
        </div>
   </section>
</>
}
export default Login;