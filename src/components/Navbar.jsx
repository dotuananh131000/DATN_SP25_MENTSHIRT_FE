import React, { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isSticky, setIsSticky] = useState(false);
  const client = useSelector((state) => state.authClient?.client);

  // console.log("Đây là tài khoản của khách hàng:", client);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header className="w-full">
      {/* Phần trên của header */}
      <div className="w-full grid grid-cols-12 bg-black text-white">
        <div className="col-span-2"></div>
        <div className="col-span-8 p-2 flex justify-between">
          <div className="flex items-center gap-x-2">
            <FaPhone className="text-white" />
            <span className="font-semibold text-gray-400">Hotline: 0868.444.644</span>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <Link href="#" className="text-gray-400 hover:text-red-700 duration-200">Cách chọn Size</Link>
            <span className="text-gray-500">|</span>
            <Link href="#" className="text-gray-400 hover:text-red-700 duration-200">Chính sách khách vip</Link>
            <span className="text-gray-500">|</span>
            <Link href="#" className="text-gray-400 hover:text-red-700 duration-200">Giới thiệu</Link>
          </div>
        </div>
        <div className="col-span-2"></div>
      </div>
      {/* Phần dưới của header */}
      <motion.div  
        initial={{ y: 1, opacity: 1 }}
        animate={{ y: isSticky ? 0 : 0, opacity: isSticky ? 1 : 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className={`grid grid-cols-12 w-full bg-white shadow-lg transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 z-50 duration-200' : 'fixed top-8 left-0 z-50 duration-200'}`}
     >
        <div className="col-span-2"></div>
        <div className="col-span-8 flex justify-between items-center">
          <Link to="/home">
            <motion.img 
            className="col-span-4 w-28 h-22 object-cover rounded-lg  "
            src="/public/logodone.png"
            whileHover={{ scale: 1.1,  boxShadow: "0px 4px 15px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.2 }}
            />
          </Link>
          <div className="col-span-4 flex items-center space-x-4 uppercase font-base text-sm">
            <Link to="/home" className="text-gray-600 hover:text-orange-500 duration-200">Trang chủ</Link>
            <Link to="/products" className="text-gray-600 hover:text-orange-500 duration-200">Sản phẩm</Link>
            <Link to="/cart" className="text-gray-600 hover:text-orange-500 duration-200">Giỏ hàng</Link>
            <Link to="/order-history" className="text-gray-600 hover:text-orange-500 duration-200">Lịch sử mua hàng</Link>
            {!client && <Link to="/profile" className="text-gray-600 hover:text-orange-500 duration-200">Tài khoản</Link>}
          </div>
        </div>
        <div className="col-span-2 flex justify-center items-center">
            {client && (
              <>
                <p className="text-pink-800 text-sm mr-2">Xin chào !</p>
                <Link to="/profile">
                  <Avatar>
                    <AvatarImage src={client.avatarUrl}></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
              </>
            )}
        </div>
      </motion.div>
    </header>
    // <header className="bg-white w-full mt-4 ">
    //   <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
    //     <div className="flex h-16 items-center justify-between">
    //       <div className="flex-1 md:flex md:items-center md:gap-12">
    //         <Link to="/" className="block text-orange-600">
    //           <span className="sr-only">Home</span>
    //           <svg className="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //             <path
    //               d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
    //               fill="currentColor"
    //             />
    //           </svg>
    //         </Link>
    //       </div>

    //       <div className="md:flex md:items-center md:gap-12">
    //         <nav aria-label="Global" className="hidden md:block">
    //           <ul className="flex items-center gap-6 text-sm">
    //             <li>
    //               <Link to="/home" className="text-gray-500 transition hover:text-gray-500/75">
    //                 Trang chủ
    //               </Link>
    //             </li>
    //             <li>
    //               <Link to="/products" className="text-gray-500 transition hover:text-gray-500/75">
    //                 Sản phẩm
    //               </Link>
    //             </li>
    //             <li>
    //               <Link to="/cart" className="text-gray-500 transition hover:text-gray-500/75">
    //                 Giỏ hàng
    //               </Link>
    //             </li>
    //             <li>
    //               <Link to="/order-history" className="text-gray-500 transition hover:text-gray-500/75">
    //                 Lịch sử mua hàng
    //               </Link>
    //             </li>
    //             <li>
    //               <Link to="/profile" className="text-gray-500 transition hover:text-gray-500/75">
    //                 Tài khoản
    //               </Link>
    //             </li>
    //           </ul>
    //         </nav>

    //         <div className="hidden md:relative md:block">
    //           <button
    //             type="button"
    //             className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
    //             onClick={toggleMenu}
    //           >
    //             <span className="sr-only">Toggle dashboard menu</span>
    //             <img
    //               src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //               alt=""
    //               className="h-10 w-10 object-cover"
    //             />
    //           </button>

    //           {isMenuOpen && (
    //             <div
    //               className="absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
    //               role="menu"
    //             >
    //               <div className="p-2">
    //                 <Link
    //                   to="/profile"
    //                   className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    //                   role="menuitem"
    //                 >
    //                   My profile
    //                 </Link>
    //                 <Link
    //                   to="/billing"
    //                   className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    //                   role="menuitem"
    //                 >
    //                   Billing summary
    //                 </Link>
    //                 <Link
    //                   to="/settings"
    //                   className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    //                   role="menuitem"
    //                 >
    //                   Team settings
    //                 </Link>
    //               </div>

    //               {}

    //               <div className="p-2">
    //                 <form method="POST" action="#">
    //                   <button
    //                     type="submit"
    //                     className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
    //                     role="menuitem"
    //                   >
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       fill="none"
    //                       viewBox="0 0 24 24"
    //                       strokeWidth="1.5"
    //                       stroke="currentColor"
    //                       className="h-4 w-4"
    //                     >
    //                       <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
    //                       />
    //                     </svg>
    //                     Logout
    //                   </button>
    //                 </form>
    //               </div>
    //             </div>
    //           )}
    //         </div>

    //         <div className="block md:hidden">
    //           <button
    //             className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
    //             onClick={toggleMenu}
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               className="h-5 w-5"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //               strokeWidth="2"
    //             >
    //               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    //             </svg>
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </header>
  );
}

export default Navbar;