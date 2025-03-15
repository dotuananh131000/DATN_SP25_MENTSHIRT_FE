import { useEffect, useState } from "react";
export default function Stepper({ hoaDon }) {
  const [currentStep, setCurrentStep] = useState(0);
  console.log(hoaDon);
  const stepsList =
    hoaDon.loaiDon === 1
      ? [
          { label: "Tạo hóa đơn", key: 8 },
          { label: "Đã thanh toán", key: 9 },
          { label: "Đã xác nhận", key: 0 },
        ]
      : [
          { label: "Tạo hóa đơn", key: 8 },
          { label: "Chờ xác nhận", key: 1 },
          { label: "Đã xác nhận", key: 2 },
          { label: "Chờ vận chuyển", key: 3 },
          { label: "Vận chuyển", key: 4 },
          { label: "Thành công", key: 5 },
        ];

  useEffect(() => {
    if (hoaDon?.trangThaiGiaoHang === 1) {
      setCurrentStep(1);
    } else if (hoaDon?.trangThaiGiaoHang === 2) {
      setCurrentStep(2);
    } else if (hoaDon?.trangThaiGiaoHang === 3) {
      setCurrentStep(3);
    } else if (hoaDon?.trangThaiGiaoHang === 4) {
      setCurrentStep(4);
    } else if (hoaDon?.trangThaiGiaoHang === 5) {
      setCurrentStep(5);
    } else if (hoaDon?.trangThaiGiaoHang === 9) {
      setCurrentStep(3);
    } else if (hoaDon?.trangThaiGiaoHang === 8) {
      setCurrentStep(0);
    }
  }, [currentStep, hoaDon]);

  console.log(hoaDon?.trangThaiGiaoHang);
  console.log(currentStep);
  return (
    <>
      <div className="bg-white w-full h-[200px] mb-4 rounded-lg shadow">
        <div className="flex justify-center items-center h-full">
          <ul className="steps steps-horizontal w-full ">
            {stepsList.map((step, i) => (
              <li
                data-content={`${i < currentStep ? "✓" : i === currentStep ? "✓" : "?"}`}
                key={i}
                className={` step ${
                  i < currentStep
                    ? "step-info"
                    : i === currentStep
                      ? "step-warning "
                      : "step-error "
                } transition-all duration-300 font-bold text-lg`}
              >
                {step.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
