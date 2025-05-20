import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UseFormatMoney from "@/lib/useFormatMoney";
import OrderDetailService from "@/services/OrderDetailService";
import Productdetail from "@/services/ProductDetailService";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

export default function ProductModal ({setCartItems, cartItems, order, fetchOrder}){

     // Hàm lấy danh sách sản phẩm
     const [productList, setProductList] = useState([]);
     const [page, setPage] = useState(0);
     const [size, setSize] = useState(10);
     const [keyword, setKeyword] = useState("");
    const [totalPages, setTotalPageSP] = useState(0);
     const fetchProduct = async () => {
         try {
            const response = await Productdetail.getAllActive(page, size, keyword);
            setProductList(response.data.content)
            setTotalPageSP(response.data.totalPages)
         }catch (err){
             console.log("Không thể lấy danh sách hóa đơn", err);
         }
     }

    //  const handleOnClick = () => {
    //     fetchProduct();
    //  }

    const onCancle = () => {
        setPage(0);
        setKeyword("");
    }

    //Thay đôi key
    const handleChangeKye = (e) => {
        const newKey = e.target.value;
        setKeyword(newKey);
    }

     useEffect(() => {
        fetchProduct();
     }, [page, keyword])



    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState("");
    const validate = () => {
        let isValid = true;
        let newError = "";
        const quantityRegex = /^[0-9]{1,4}$/; 
        if(!quantityRegex.test(quantity)){
            newError = "Số lượng không hợp lệ";
            isValid = false;
        }
        setError(newError);
        return isValid;
    }

    // Gọi fetch thêm hóa đơn chi tiết
    const fetchAdd = async (form) => {
        try {
            const response = await OrderDetailService.Add(form);
            const addedItem = response.data;

            //Check sản phẩm đã tông tại
            setCartItems((prev) => {
                const existingIndex = prev.findIndex(
                    item => item.idSPCT === addedItem.idSPCT
                );

                if(existingIndex !== -1) {
                    // Nếu đã có trong giở hàng, cập nhật số lượng và thành tiền
                    const updatedItems = [...prev];
                    updatedItems[existingIndex] = {
                        ...updatedItems[existingIndex],
                        soLuong: addedItem.soLuong,
                        thanhTien: addedItem.thanhTien,
                    };
                    return updatedItems;
                } else {
                    //Nếu chưa có thì thêm vào giỏ hàng
                    return [...prev,addedItem];
                }
            });
            toast.success("Đã thêm sản phẩm và đơn hàng");
            fetchOrder();
        }catch(err) {
            console.log("Lỗi khi thêm hóa đơn chi tiết", err);
            toast.error("Sản phẩm bạn muốn thêm vượt quá số lượng trong kho.");
        }
    };
    
    const handleOnchange = (e) => {
        const onlyNumbers = e.target.value.replace(/\D/g, ""); // loại bỏ mọi thứ không phải số
        setQuantity(onlyNumbers);
    }


    //Hàm thêm sản phẩm và giỏ hàng của hóa đơn
    const handleAddProduct = (item) => {
        if(validate()){
            if(quantity > item.soLuong) {
                setError("Số lượng sản phẩm không đủ!")
            }else {
                let form = {
                    idHoaDon: order.id || null,
                    idSPCT: item.id || null,
                    soLuong: Number(quantity) ?? "",
                }

                fetchAdd(form);
            } 
        }
    }

    const handleClose = () => {
        setError("");
        setQuantity("");
    }




    return <div className="w-full mt-4 flex justify-between">
        <div></div>
        <div className="relative">
            {order.trangThaiGiaoHang === 1 && (
                <Dialog onOpenChange={onCancle}>
                <DialogTrigger asChild>
                    <button
                    // onClick={handleOnClick}
                    className="bg-orange-500 text-white rounded-lg px-2 py-2 active:scale-95 duration-200 mb-4 mr-3"
                    >Thêm sản phẩm</button>
                </DialogTrigger>
                <DialogContent 
                className="fixed left-1/2 -translate-x-1/2 w-full max-w-4xl max-h-[600px] bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm sản phẩm</DialogTitle>
                    </DialogHeader>
                    <div className="">
                        <div>
                            <input 
                            onChange={(e) => handleChangeKye(e)}
                            className="w-full m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            />
                        </div>
                        <table className="table table-auto w-full bg-white rounded-lg shadow text-center text-xs mt-2">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">STT</th>
                                    <th className="border p-2">Ảnh</th>
                                    <th className="border p-2">Tên</th>
                                    <th className="border p-2">Màu sắc</th>
                                    <th className="border p-2">Kích thước</th>
                                    <th className="border p-2">Chất liệu</th>
                                    <th className="border p-2">Số lượng</th>
                                    <th className="border p-2">Giá</th>
                                    <th className="border p-2">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList.map((item, i) => (
                                    <tr key={item.id}>
                                        <td>{i + 1}</td>
                                        <td className="border p-2 flex justify-center">
                                            <img
                                                className="skeleton w-[50px] h-[50px] object-cover"
                                                src={item.hinhAnh}
                                                alt="Đây là ảnh SP"
                                            />
                                        </td>
                                        <td className="border p-2">{item.sanPham.tenSanPham}</td>
                                        <td className="border p-2">{item.mauSac.tenMauSac}</td>
                                        <td className="border p-2">{item.kichThuoc.tenKichThuoc}</td>
                                        <td className="border p-2">{item.chatLieu.tenChatLieu}</td>
                                        <td className="border p-2">{item.soLuong}</td>
                                        <td className="border p-2">{UseFormatMoney(item.donGia)}</td>
                                        <td className="border p-2">
                                            <Dialog onOpenChange={handleClose} >
                                                <DialogTrigger asChild>
                                                    <button 
                                                    className="text-orange-500 active:scale-75 duration-200">Thêm</button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Chi tiết sản phẩm</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="flex space-x-4">
                                                        <img
                                                        className="skeleton w-[160px] h-[180px] object-cover rounded-lg shadow"
                                                        src={item.hinhAnh} alt=""
                                                        />
                                                        <div>
                                                        <p className="text-lg text-orange-500">{item.sanPham.tenSanPham}</p>
                                                            <div className="flex items-center space-x-4">
                                                                <p className="text-sm">Màu sắc: {item.mauSac.tenMauSac}</p>
                                                                <p>-</p>
                                                                <p className="text-sm">Kích thước: {item.kichThuoc.tenKichThuoc}</p>
                                                            </div>
                                                            <p className="text-sm">Giá: 
                                                                <span className="text-red-600 ml-2">{UseFormatMoney(item.donGia)}</span>
                                                            </p>
                                                            <p className="text-sm mt-2">Số lượng: 
                                                                <span className="ml-3">
                                                                <input type="text"
                                                                value={quantity} 
                                                                onChange={(e) => handleOnchange(e)}
                                                                className="w-1/3 m-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                                                                />
                                                                </span>
                                                            </p>  
                                                            {error && (<p className="text-sm text-red-500">{error}</p>)}  
                                                            <p className="text-sm mt-2">Số lượng tồn: <span>{item.soLuong}</span></p>    
                                                        </div>                                              
                                                    </div>
                                                    <div className="absolute bottom-4 right-4">
                                                        <DialogFooter>
                                                            <DialogClose
                                                            onClick={handleClose}
                                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                                                                Hủy
                                                            </DialogClose>
                                                            <button 
                                                            onClick={() => handleAddProduct(item)}
                                                            className="bg-orange-500 text-white px-3 py-2 rounded-lg active:scale-95 duration-200">
                                                                Thêm
                                                            </button>
                                                        </DialogFooter>
                                                    </div>
                                                </DialogContent>
                                                
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex items-center mt-2 px-2 relative">
                            <div className="flex items-center absolute right-2 top-1">
                                <ReactPaginate
                                previousLabel="<"
                                nextLabel=">"
                                breakLabel="..."
                                pageCount={totalPages}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={(e) => setPage(e.selected)}
                                forcePage={page}
                                containerClassName="flex justify-center items-center space-x-2"
                                pageClassName="border border-gray-300 rounded"
                                pageLinkClassName="px-3 py-1"
                                activeClassName="bg-orange-500 text-white"
                                previousClassName="border border-gray-300 rounded px-3 py-1"
                                nextClassName="border border-gray-300 rounded px-3 py-1"
                                disabledClassName="text-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                </DialogContent>
                </Dialog>
            )}
           
           
        </div>
        
    </div>
}