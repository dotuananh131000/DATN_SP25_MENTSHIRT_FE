import { createRoot } from "react-dom/client";
import { QRCodeCanvas } from "qrcode.react";
import usePrint from "@/lib/usePrint";
import UseFormatMoney from "@/lib/useFormatMoney";

export const printBill = (order, cartItems, listLSTT, tienGiam, totalItemsPrice, phiShip) => {
    const canvasContainer = document.createElement("div");
    document.body.appendChild(canvasContainer);

    const QRComponent = (
        <div>
            <QRCodeCanvas
                value={order.maHoaDon}
                size={140}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                id="qrCodeCanvas"
            />
        </div>
    );

    // ✅ Render thực sự QR vào DOM
    const root = createRoot(canvasContainer);
    root.render(QRComponent);

    // ⏳ Chờ QR vẽ xong, rồi lấy canvas -> in
    setTimeout(() => {
        const canvas = canvasContainer.querySelector('canvas');
        if (!canvas) {
            alert("Không tìm thấy QR code");
            return;
        }

        const qrBase64 = canvas.toDataURL();

        const renderChiTietHTML = () => {
            return cartItems.map((item, i) => (
                ` <tr>
                    <td class="border px-4 py-2">${i + 1}</td>
                    <td class="border px-4 py-2">${item.tenSanPham}</td>
                    <td class="border px-4 py-2 text-right">${item.soLuong}</td>
                    <td class="border px-4 py-2 text-center">${item.thanhTien}</td>
                </tr>`
            )).join('');
        };

        const renderLichSuThanhToanHTML = () => {
            return listLSTT.map((item, i) => (
                ` <tr>
                    <td class="border px-4 py-2">${i + 1}</td>
                    <td class="border px-4 py-2">${item.tenPhuongThuc}</td>
                    <td class="border px-4 py-2 text-right">${UseFormatMoney(item.soTienThanhToan)}</td>
                    <td class="border px-4 py-2 text-center">${item.nguoiXacNhan}</td>
                </tr>`
            )).join('');
        };

        const invoiceHtml = `
        <div class="w-full">
          <h1 class="text-2xl text-center font-bold mb-2">Men T-Shirt</h1>
          <p class="text-center text-xs">136 Hồ Tùng Mậu, Bắc Từ Liêm, Hà Nội</p>
          <p class="text-center text-xs">SĐT: 1900 1512</p>
          <p class="text-center text-xs">Mã hóa đơn: ${order.maHoaDon} - Ngày Tạo: ${order.ngayTao}</p>
          <hr />
          <div class="mt-4">
              <p>Khách hàng: ${order.tenKhachHang || "Khách lẻ"}</p>
              <p>SĐT: ${order.soDienThoai || "Không có"}</p>
              <p>Địa chỉ: ${order.diaChiNhanHang || "Tại quầy"}</p>
          </div>
           <hr />
           <div class="mt-4">
              <p class="text-xl font-bold">Nội dung đơn hàng</p>
              <table class="w-full mt-2 text-center px-3 py-2">
                  <thead>
                      <tr>
                          <th>STT</th>
                          <th>Tên</th>
                          <th>Số lượng</th>
                          <th>Tổng tiền</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${renderChiTietHTML()}
                  </tbody>
              </table>
          </div>

          <div class="mt-4">
             <div><span>Tổng tiền hàng:</span> <span>${UseFormatMoney(totalItemsPrice)}</span></div>
             <div><span>Giảm Giá:</span> <span>${UseFormatMoney(tienGiam)}</span></div>
             <div><span>Phí Ship:</span> <span>${UseFormatMoney(phiShip)}</span></div>
             <div><span>Tổng hóa đơn:</span> <span>${UseFormatMoney(order.tongTien)}</span></div>
          </div>

          <hr class="mt-4" />

          <div class="mt-4">
              <p class="text-xl font-bold">Lịch sử thanh toán</p>
              <table class="w-full mt-2 text-center px-3 py-2">
                    <thead>
                      <tr>
                          <th>STT</th>
                          <th>Phương thức</th>
                          <th>Số Tiền</th>
                          <th>Người xác nhận</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${renderLichSuThanhToanHTML()}
                  </tbody>
              </table>
          </div>

          <div class="mt-10 flex justify-center">
              <img src="${qrBase64}" alt="QR Code" class="w-36 h-36 mb-4" />
          </div>
        </div>
        `;

        usePrint(invoiceHtml);

        // ✅ Xoá khỏi DOM sau khi in
        root.unmount();
        document.body.removeChild(canvasContainer);
    }, 400); // delay 500ms để canvas vẽ xong
};
