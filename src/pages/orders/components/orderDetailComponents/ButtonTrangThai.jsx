import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import usePrint from "@/lib/usePrint";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
function ButtonTrangThai({hoaDon, 
    handleCapNhatDonHang, 
    handleClickHistory, 
    listHistoryHD, 
    setListHistoryHD, 
    handleTiepNhan, 
    gioHang, lichSuThanhToan,}){

        const renderChiTietHTML = () => {
            return gioHang.map((item, i) => (
               ` <tr>
                    <td class="border px-4 py-2">${i + 1}</td>
                    <td class="border px-4 py-2">${item.tenSanPham}</td>
                    <td class="border px-4 py-2 text-right">${item.soLuong}</td>
                    <td class="border px-4 py-2 text-center">${item.thanhTien}</td>
                </tr>`
            )).join('');
          };

          const renderLichSuThanhToanHTML = () => {
            return lichSuThanhToan.map((item, i) => (
               ` <tr>
                    <td class="border px-4 py-2">${i + 1}</td>
                    <td class="border px-4 py-2">${item.tenPhuongThuc}</td>
                    <td class="border px-4 py-2 text-right">${item.soTienThanhToan}</td>
                    <td class="border px-4 py-2 text-center">${item.nguoiXacNhan}</td>
                </tr>`
            )).join('');
          };

        const qrRef = useRef();

        <QRCodeCanvas
        value={hoaDon.id}
        size={140}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        ref={qrRef}
        />

    const handlePrint = () => {

        setTimeout(() => {
            const canvas = qrRef.current?.querySelector?.('canvas') || qrRef.current;
            if (!canvas) {
            alert("Không tìm thấy QR code để in");
            return;
            }

            const qrBase64 = canvas.toDataURL();
            const invoiceHtml = `
            <div class="w-full">
              <h1 class="text-2xl text-center font-bold mb-2">Men T-Shirt</h1>
              <p class="text-center text-xs">136 Hồ Tùng Mậu, Bắc Từ Liêm, Thành phố Hà Nội</p>
              <p class="text-center text-xs">Số điện thoại: 1900 1512</p>
              <p class="text-center text-xs">Mã hóa đơn: ${hoaDon.maHoaDon} - Ngày Tạo: ${hoaDon.ngayTao}</p>
              <hr />
              <div class="mt-4">
                  <p>Khách hàng: ${hoaDon.tenKhachHang || "Khách lẻ"}</p>
                  <p>Số điện thoại: ${hoaDon.soDienThoai || "Không có"}</p>
                  <p>Địa chỉ: ${hoaDon.diaChiNhanHang || "Tại quầy"}</p>
              </div>
               <hr />
               <div class="mt-4 ">
                  <p class="text-xl font-bold">Nội dung đơn hàng</p>
                  <table class="w-full mt-2 text-center px-3 py-2">
                      <thead>
                          <tr class="text-center">
                              <th>STT</th>
                              <th>Tên</th>
                              <th>Số lượng</th>
                              <th>Tổng tiền</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${renderChiTietHTML()}
                      <tbody>
                  </table>
              </div>
              <hr class="mt-4" />
             
              <div class="mt-4 ">
                  <p class="text-xl font-bold">Lịch sử thanh toán</p>
                  <table class="w-full mt-2 text-center px-3 py-2">
                      <tbody>
                          ${renderLichSuThanhToanHTML()}
                      <tbody>
                  </table>
              </div>
              <div class="mt-10 flex justify-center ">
                  <img src="${qrBase64}" alt="QR Code" class="w-36 h-36 mb-4" />
              </div>
            </div>
          `;
          
          usePrint(invoiceHtml);

            

        }, 500)
        
      };

    return <>
     <motion.div className="flex relative space-x-4 w-full bg-white rounded-lg shadow p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
     >

        <div>
        {/* QR ẩn để in */}
            <div style={{ display: "none" }}>
                <QRCodeCanvas
                value={hoaDon.maHoaDon}
                size={140}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                ref={qrRef}
                />
            </div>
        </div>
        {hoaDon.loaiDon === 0 && (
            <>
                {hoaDon.trangThaiGiaoHang !== 5 && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200">
                                Chuyển trạng thái
                            </button>
                        </DialogTrigger>
                        {!hoaDon.idNhanVien && (
                            <DialogContent className="top-10 max-w-md translate-y-0">
                                <DialogHeader>
                                    <DialogTitle className="text-lg">
                                        Tiếp nhận đơn hàng
                                    </DialogTitle>
                                </DialogHeader>
                                <div>
                                    Nhân viên vui lòng tiếp nhận đơn hàng trước khi thực hiện các thao tác!
                                </div>
                                <div className="w-full flex justify-center">
                                    <DialogClose 
                                    className="px-4 py-3 text-white bg-orange-600 hover:scale-95 duration-200 rounded-lg w-1/3"
                                    onClick={handleTiepNhan}
                                    >
                                        Xác nhận
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        )}
                        {hoaDon.idNhanVien && (
                            <DialogContent className="top-10 max-w-md translate-y-0">
                                <DialogHeader className="text-lg">
                                    <DialogTitle>
                                        Xác nhận chuyển trạng thái
                                    </DialogTitle>
                                </DialogHeader>
                                {
                                    hoaDon.trangThaiGiaoHang === 1
                                    ? "Chuyển trạng thái thành: Đã xác nhân"
                                    : hoaDon.trangThaiGiaoHang === 2
                                    ? "Chuyển trạng thái thành: Chờ vận chuyển"
                                    : hoaDon.trangThaiGiaoHang === 3
                                        ? "Chuyển trạng thái đơn hàng thành: Đang vận chuyển"
                                        : hoaDon.trangThaiGiaoHang === 4
                                        ? "Chuyển trạng thái thành: Đã hoàn thành"
                                            : ""
                                }

                                <div className="w-full flex justify-center">
                                    <DialogClose
                                    className="px-4 py-3 text-white bg-orange-600 hover:scale-95 duration-200 rounded-lg w-1/3"
                                    onClick={handleCapNhatDonHang}
                                    >
                                        Xác nhận
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        )}
                    </Dialog>
                   
                )}

                {hoaDon.trangThaiGiaoHang === 5 && (
                    <p className="text-orange-500 px-3 py-2"
                    >
                        Đơn hàng đã hoàn thành
                    </p>
                )}
            </>
        )}
        {(hoaDon.trangThaiGiaoHang === 1 || hoaDon.trangThaiGiaoHang === 8) && 
            <Dialog>
                <DialogTrigger asChild>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg hover:scale-105 duration-200">
                        Hủy
                    </button>
                </DialogTrigger>
                <DialogContent className="top-10 max-w-md translate-y-0">
                    <DialogHeader>
                        <DialogTitle>
                            Xác nhận hủy đơn hàng!
                        </DialogTitle>
                        <DialogDescription className="text-lg">
                            Bạn thật lòng muốn hủy hóa đơn này ư ?
                        </DialogDescription>
                       
                    </DialogHeader>
                    <div className="w-full flex justify-center">
                        <DialogClose className="px-4 py-3 text-white bg-orange-600 hover:scale-95 duration-200 rounded-lg w-1/3">
                            Xác nhận
                        </DialogClose>
                    </div>   
                </DialogContent>
            </Dialog>
           
        }
        <div className="p-4"></div>
        
        <div className="absolute right-4 space-x-4">
            <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200">
                In hóa đơn
            </button>
            <Drawer>
                <DrawerTrigger asChild>
                    <button
                    onClick={handleClickHistory}
                    className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:scale-105 duration-200">
                        Chi tiết
                    </button>
                </DrawerTrigger>
                <DrawerContent className="w-[500px] h-3/4 ml-auto mr-0 overflow-y-auto">
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle className="text-center text-lg">Lịch sử hóa đơn</DrawerTitle>
                        </DrawerHeader>
                        {listHistoryHD.map((item, i) => (
                            <div key={item.id}>
                                <hr className="border border-1 bor m-2" />
                                <div className="pl-2">
                                    <h1 className="font-bold text-lg text-gray-500">{item.nguoiThayDoi}</h1>
                                    <p><span className="font-bold text-lg text-gray-500">Thời gian:</span> {item.thoiGianThayDoi}</p>  
                                    <p><span className="font-bold text-lg text-gray-500" >Hành động:</span> {item.hanhDong}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DrawerContent>
            </Drawer>
            
        </div>
     </motion.div>
    </>

}
export default ButtonTrangThai;