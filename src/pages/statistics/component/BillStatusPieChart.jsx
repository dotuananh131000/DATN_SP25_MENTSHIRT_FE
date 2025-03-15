import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);
export default function BillStatusPieChart({ ttdh }) {
  // console.log(ttdh);
  const data = {
    labels: [
      "Chờ xác nhận",
      "Xác Nhận",
      "Chờ vận chuyển",
      "Đang vận chuyển",
      "Thành công",
      "Hoàn hàng",
      "Đã hủy",
    ],
    datasets: [
      {
        label: "Trạng thái đơn hàng",
        data: [
          ttdh?.cho_xac_nhan,
          ttdh?.xac_nhan,
          ttdh?.cho_van_chuyen,
          ttdh?.van_chuyen,
          ttdh?.thanh_cong,
          ttdh?.hoan_hang,
          ttdh?.da_huy,
        ], // Số lượng đơn hàng cho từng trạng thái
        backgroundColor: [
          "#4CAF50",
          "#FFEB3B",
          "#F44336",
          // "#2196F3",
          "#FFC107",
          "#9C27B0",
          "#009688",
          "#795548",
        ],
        borderColor: [
          "#4CAF50",
          "#FFEB3B",
          "#F44336",
          // "#2196F3",
          "#FFC107",
          "#9C27B0",
          "#009688",
          "#795548",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Tùy chỉnh các tùy chọn biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} đơn hàng`;
          },
        },
      },
    },
  };
  return (
    <div className="w-full max-w-xs mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
}
