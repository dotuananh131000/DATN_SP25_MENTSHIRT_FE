import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
export default function QRCodeScanner({ onScan, onError, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10, // Giảm tốc độ quét để tăng độ chính xác
      qrbox: 250, // Khung quét rộng hơn
      aspectRatio: 1.0, // Tỉ lệ khung hình vuông để phát hiện mã QR dễ hơn
      rememberLastUsedCamera: true, // Nhớ camera đã chọn
    });
    scanner.render(
      (decodedText) => {
        if (onScan) onScan(decodedText);
      },
      (error) => {
        if (error) error(error);
      }
    );
    return () => {
      scanner.clear().catch((error) => {
        console.error("Lỗi khi dọn dẹp scanner:", error);
      });
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Quét QR</h3>
          <button
            onClick={onClose}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 "
          >
            Đóng
          </button>
        </div>
        <div
          id="qr-reader"
          className="w-250 h-250 aspect-square bg-black"
        ></div>
      </div>
    </div>
  );
}
