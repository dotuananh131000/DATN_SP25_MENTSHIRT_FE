import { FaRegTrashAlt } from "react-icons/fa";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HoaDonChiTietService from "@/pages/detailOrder/service/HoaDonChiTietService";
import Select from 'react-select';
import ReactPaginate from "react-paginate";
import HoaDonService from "@/pages/counterSales/services/HoaDonService";

function Cart({hoaDon, gioHang, fetchGioHang,fetchSanPhamChiTiet, fetchHoaDonById,
    spcts,
    totalPages,
    page,
    setPage,
    size,
    setSize,
    setSearch,
    quantity,
    setQuantity,
    thuongHieus,
    xuatXus,
    chatLieus,
    coAos,
    tayAos,
    mauSacs,
    kichThuocs,
    handleFilterChange,
    resetFilters
 }){

    const [hoaDonChiTietUpdate, setHoaDonChiTietUpdate] = useState(null);
    const [isError, setIsError] = useState(false);
    const [HDCTRequest, setHDCTRequest] = useState({
        idHoaDon: null,
        idSPCT: null,
        soLuong: 1,
    });

    //Hàm cập nhật số lượng hóa đơn chi tiết
    const fetchSoLuong = async(idHDCT, sl) => {
        try {
            const response = await HoaDonChiTietService.updateSoLuongHDCT(idHDCT, sl);
            fetchGioHang();
            fetchHoaDonById(hoaDon.id);
        }catch (error) {
            toast.error("Cập nhận số lượng thất bại! Vui lòng thử lại.")
        }
    }

    const handleBlur = (hoaDonChiTiet) => {
        if(!hoaDonChiTiet) {
            toast.success("Lỗi khi cập nhật số lượng.");
            return;
        }
        if (!quantity || !Number.isInteger(Number(quantity))|| Number(quantity) <= 0) {
              toast.error(`Số lượng phải là số nguyên dương lớn hơn 0.`);
              setHoaDonChiTietUpdate(null);
              return false;
            }
        if(quantity > hoaDonChiTiet.soLuongTon) {
            toast.error("Số lượng thêm vượt quá số lượng sản phẩm sẵn có");
            setHoaDonChiTietUpdate(null);
            return;
        }
        if (hoaDonChiTiet.soLuong === quantity) {
            setHoaDonChiTietUpdate(null);
            return;
        }
        fetchSoLuong(hoaDonChiTietUpdate, quantity);
        toast.success("Cập nhật số lượng thành công.");
        setQuantity(0);
        setHoaDonChiTietUpdate(null);
    };

    const onDoubleClick = (hoaDonChiTiet) => {
        setQuantity(hoaDonChiTiet.soLuong);
        setHoaDonChiTietUpdate(hoaDonChiTiet.id);
    }

    const prevSoLuongSanPham = (hoaDonChiTiet) => {
        if(!hoaDonChiTiet){
            toast.error("Lỗi khi trừ số lượng.")
            return;
        }
        if(hoaDonChiTiet.soLuong <=1) {
            toast.warning("Số lượng sản phẩm tối thiểu là 1.");
            return;
        }
        fetchSoLuong(hoaDonChiTiet.id, hoaDonChiTiet.soLuong - 1);
    }

    const nextSoLuongSanPham = (hoaDonChiTiet) => {
        if(!hoaDonChiTiet) {
            toast.error("Lỗi khi thêm số lượng sản phẩm.");
            return;
        }
        if(quantity > hoaDonChiTiet.soLuongTon) {
            toast.error("Số lượng thêm vượt quá số lượng sản phẩm sẵn có");
            setHoaDonChiTietUpdate(null);
            return;
        }
        fetchSoLuong(hoaDonChiTiet.id, hoaDonChiTiet.soLuong + 1);
    }

    //Hàm thêm sản phẩm vào giỏ hàng.
    const fetchThemHoaDonChiTiet = async() => {
        try {
            if(!HDCTRequest.idHoaDon || !HDCTRequest.idSPCT){
                return;
            }
            const response = await HoaDonService.ThemSPVaoGioHang(HDCTRequest);
            fetchSanPhamChiTiet();
            fetchGioHang();
            fetchHoaDonById(hoaDon.id);
            toast.success("Đã thêm sản phẩm vào giỏ hàng.");
        }catch (error) {
            toast.error("Lỗi khi thêm sản phẩm, vui lòng thử lại.");
            console.log("Không thể thêm được sản phẩm vào giỏ hàng", error);
        }
    }
    const handleConfirm = (spct) => {
        if(!quantity || !Number.isInteger(Number(quantity))|| Number(quantity) <= 0){
            setIsError("Số lượng phải là số nguyên dương lớn hơn 0.");
            setQuantity(0);
            return;
        }
        if(quantity > spct.soLuong) {
            setIsError("Số lượng thêm vượt quá số lượng sản phẩm sẵn có");
            setQuantity(0);
            setHoaDonChiTietUpdate(null);
            return;
        }
        setHDCTRequest((prev) => ({
            ...prev,
            idHoaDon: hoaDon.id,
            idSPCT : spct.id,
            soLuong: Number(quantity),
        }))
        setIsError("");
    }
    useEffect(() => {
        fetchThemHoaDonChiTiet();
        console.log("Đây là hóa đơn request", HDCTRequest);
    }, [HDCTRequest])

    //Hàm xóa sản phẩm ra khỏi giỏ hàng

    const deleteSP = (hoaDonChiTiet) => {
        const fetchDeleteSP = async () => {
            try{
                const response = await HoaDonChiTietService.deleteHDCT(hoaDonChiTiet.id)
                fetchGioHang();
                fetchSanPhamChiTiet();
                fetchHoaDonById(hoaDon.id);
                toast.success("Đã xóa sản phẩm ra khỏi giỏ hàng.");
            }catch (error) {
                toast.error("Lỗi xóa sản phẩm, vui lòng thử lại");
                console.log("Lỗi xóa sản phẩm, vui lòng thử lại", error);
            }
        }
        fetchDeleteSP();
    }
    return <>
        <motion.div className="bg-white rounded-lg shadow w-full p-4 relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Dialog onOpenChange={resetFilters}>
                {(hoaDon.trangThaiGiaoHang === 1 || hoaDon.trangThaiGiaoHang === 8) && (
                    <DialogTrigger asChild>
                        <button className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200 absolute top-3 right-4">
                            Thêm sản phẩm
                        </button>
                    </DialogTrigger>
                )}
                <DialogContent className="w-full max-w-5xl max-h-[700px] overflow-y-auto">  
                <DialogTitle className="font-md">Danh sách sản phẩm</DialogTitle>
                    <motion.div>
                        <input
                            type="text"
                            onChange={(e)=>{setSearch(e.target.value)}}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
                            placeholder="Tìm kiếm sản phẩm "
                        />
                        <div className="grid grid-cols-4 gap-3 ">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Thương hiệu</label>
                                <Select
                                    name="thuongHieuId"
                                    options={thuongHieus.map(th => ({ value: th.id, label: th.tenThuongHieu }))}
                                    isMulti
                                    onChange={selectedOptions => handleFilterChange("thuongHieuIds", selectedOptions)}
                                    className="text-xs"
                                    placeholder="Chọn thương hiệu"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">Xuất xứ</label>
                                <Select
                                    name="xuatXuId"
                                    options={xuatXus.map(x => ({ value: x.id, label: x.tenXuatXu }))}
                                    isMulti
                                    onChange={selectedOptions => handleFilterChange("xuatXuIds", selectedOptions)}
                                    className="text-xs"
                                    placeholder="Chọn xuất xứ"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">Chất liệu</label>
                                <Select
                                    name="chatLieuId"
                                    options={chatLieus.map(c => ({ value: c.id, label: c.tenChatLieu }))}
                                    isMulti
                                    onChange={selectedOptions => handleFilterChange("chatLieuIds", selectedOptions)}
                                    className="text-xs"
                                    placeholder="Chọn chất liệu"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">Cổ áo</label>
                                <Select
                                    name="coAoId"
                                    options={coAos.map(c => ({ value: c.id, label: c.tenCoAo }))}
                                    isMulti
                                    onChange={selectedOptions => handleFilterChange("coAoIds", selectedOptions)}
                                    className="text-xs"
                                    placeholder="Chọn kiểu cổ áo"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">Tay áo</label>
                                <Select
                                    name="tayAoId"
                                    options={tayAos.map(t => ({ value: t.id, label: t.tenTayAo }))}
                                    isMulti
                                    onChange={selectedOptions => handleFilterChange("tayAoIds", selectedOptions)}
                                    className="text-xs"
                                    placeholder="Chọn kiểu tay áo"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">Màu sắc</label>
                                <Select
                                    name="mauSacId"
                                    options={mauSacs.map(m => ({ value: m.id, label: m.tenMauSac }))}
                                    isMulti
                                    onChange={selectedOptions => handleFilterChange("mauSacIds", selectedOptions)}
                                    className="text-xs"
                                    placeholder="Chọn màu sắc"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">Kích thước</label>
                                <Select
                                    name="kichThuocId"
                                    options={kichThuocs.map(k => ({ value: k.id, label: k.tenKichThuoc }))}
                                    isMulti
                                    onChange={selectedOptions => handleFilterChange("kichThuocIds", selectedOptions)}
                                    className="text-xs"
                                    placeholder="Chọn kích thước"
                                />
                            </div>
                        </div>
                    </motion.div>
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
                        {spcts.map((spct, i)=>(
                            <tr key={spct.id} className="hover:bg-gray-100 text-center">
                                <td className="border p-2">{page * size + i + 1}</td>
                                <td className="border p-2 flex justify-center">
                                <img
                                    className="skeleton w-[50px] h-[50px] object-cover"
                                    src={spct.hinhAnh}
                                    alt="Đây là ảnh SP"
                                />
                                </td>
                                <td className="border p-2">{spct.sanPham.tenSanPham}</td>
                                <td className="border p-2">{spct.mauSac.tenMauSac}</td>
                                <td className="border p-2">{spct.kichThuoc.tenKichThuoc}</td>
                                <td className="border p-2">{spct.chatLieu.tenChatLieu}</td>
                                <td className="border p-2">{spct.soLuong}</td>
                                <td className="border p-2">{
                                new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(spct?.donGia)}</td>
                                <td className="border p-2">
                                    <Dialog onOpenChange={() => setQuantity(1)}>
                                        <DialogTrigger asChild>
                                            <button className="btn bg-orange-600 hover:bg-orange-700 text-white"
                                            >
                                                Thêm
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
                                            <motion.div className="flex space-x-4">
                                                <img
                                                    className="skeleton w-[160px] h-[180px] object-cover rounded-lg shadow"
                                                    src={spct.hinhAnh} alt="" 
                                                />
                                                <motion.div>
                                                    <p className="text-lg text-orange-500">{spct.sanPham.tenSanPham}</p>
                                                    <div className="flex items-center space-x-4">
                                                        <p className="text-sm">Màu sắc: {spct.mauSac.tenMauSac}</p>
                                                        <p>-</p>
                                                        <p className="text-sm">Kích thước: {spct.kichThuoc.tenKichThuoc}</p>
                                                    </div>
                                                    <p className="text-sm">Giá: 
                                                        <span className="text-red-600 ml-2">{new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }).format(spct?.donGia)}</span>
                                                    </p>
                                                    <p className="text-sm mt-2">Số lượng: 
                                                        <span className="ml-3">
                                                            <input type="number" 
                                                                min={1}
                                                                className="border h-8 rounded p-2"
                                                                value={quantity}
                                                                onChange={(e) => setQuantity(e.target.value)} 
                                                            /> 
                                                        </span>
                                                    </p>
                                                   {isError &&  <span className="text-sm text-red-500">{isError}</span>}
                                                    
                                                </motion.div> 
                                                    <div className="absolute bottom-6 right-4">
                                                        <DialogFooter className="sm:justify-end">
                                                            <DialogClose className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                                                                Hủy
                                                            </DialogClose>  
                                                                <button
                                                                    onClick={() => handleConfirm(spct)}
                                                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                                                                    Xác nhận
                                                                </button>    
                                                        </DialogFooter>
                                                    </div>                      
                                            </motion.div>
                                            
                                        </DialogContent>
                                    </Dialog>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between mt-4 ">
                    <select
                        value={size}
                        onChange={(e)=>setSize(e.target.value)}
                        className="w-[90px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
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
                </DialogContent>
            </Dialog>
           
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="text-lg mb-2">
                        Giỏ hàng
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <table className="table table-auto rounded-lg shadow mt-2">
                <thead className="bg-gray-200">
                    <tr className="text-center">
                        <th className="px-4 py-2">STT</th>
                        <th className="px-4 py-2">Hình ảnh</th>
                        <th className="px-4 py-2">Tên sản phẩm</th>
                        <th className="px-4 py-2">Số lượng</th>
                        <th className="px-4 py-2">Thành tiền</th>
                        <th className="px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
                <tbody>
                    {gioHang.map((item, i) => (
                        <tr key={item.id} className="text-center">
                            <td className="px-4 py-2">{i + 1}</td>
                            <td className="px-4 py-2 flex justify-center">
                                <img src={item.hinhAnh} alt="Đây là ảnh" className="skeleton h-32 w-32 object-cover" />
                            </td>
                            <td className="px-4 py-2">
                                <p className="text-base font-bold">
                                    {item.tenSanPham} [{item.tenMauSac} - {item.tenKichThuoc}]
                                </p>
                                <p>Mã SP: SPCT{item.idSPCT}</p>
                                <p>
                                    Đơn giá:{" "}
                                    <strong className="text-orange-600">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(item.donGia)}
                                    </strong>
                                </p>
                            </td>
                            <td className="px-4 py-2 ">
                                
                                <div className="p-4 flex justify-center items-center space-x-4">
                               {(hoaDon.trangThaiGiaoHang ===1 || hoaDon.trangThaiGiaoHang === 8) && (
                                 <button onClick={() => prevSoLuongSanPham(item)} 
                                 className="px-4 py-1 bg-gray-200 rounded-lg text-lg">-</button>
                               )}
                                    {(hoaDonChiTietUpdate === item.id && 
                                    (hoaDon.trangThaiGiaoHang === 1 || hoaDon.trangThaiGiaoHang === 8)) ? (
                                        <motion.input
                                            type="number"
                                            defaultValue={item.soLuong}
                                            autoFocus
                                            onChange={(e) => setQuantity(e.target.value)}
                                            onBlur={() => handleBlur(item)}
                                            className="border border-gray-300 rounded p-1 w-20"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                        />
                                    ) : (
                                        <motion.p 
                                            onDoubleClick={() => onDoubleClick(item)} 
                                            className="cursor-pointer hover:underline px-4 py-1"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                        >
                                            {item.soLuong}
                                        </motion.p>
                                    )}
                               {(hoaDon.trangThaiGiaoHang ===1 || hoaDon.trangThaiGiaoHang === 8) && (
                                 <button onClick={() => nextSoLuongSanPham(item)} 
                                 className="px-4 py-1 bg-gray-200 rounded-lg text-lg">+</button>
                               )}
                                </div>
                                
                            </td>
                            <td className="px-4 py-2">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(item.thanhTien)}
                            </td>
                            <td className="text-center">
                                <Dialog>
                                    {(hoaDon.trangThaiGiaoHang === 1 || hoaDon.trangThaiGiaoHang === 8) &&(
                                        <DialogTrigger>
                                            <FaRegTrashAlt className="text-orange-500 text-lg" />
                                        </DialogTrigger>
                                    )}
                                    <DialogContent className="w-[300px] ">
                                        <DialogHeader className="text-lg">Xác nhận để xóa sản phẩm này !</DialogHeader>
                                            <DialogFooter className="sm:justify-center">
                                                <DialogClose className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                                                    Hủy
                                                </DialogClose>
                                                    <button onClick={() => deleteSP(item)} className="px-4 py-2 bg-orange-500 text-white rounded-lg ">
                                                        Xác nhận
                                                    </button>
                                            </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    </>

}
export default Cart;