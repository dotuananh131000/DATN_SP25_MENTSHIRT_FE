import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomerService from "@/services/CustomerService";
import OrderService from "@/services/OrderService";
import { useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { toast } from "react-toastify";
function CustomerOfBill ({ customer, setCustomer, order, setOrder }) {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });

    const fetchCustomers = async () => {
        try {
          const { content, totalPages } = await CustomerService.getAll(
            currentPage,
            pageSize,
            search,
            sortConfig.key,
            sortConfig.direction
          );
          setCustomers(content);
          setTotalPages(totalPages);
        } catch (error) {
          console.error("Error fetching customers:", error);
        }
      };
    
      useEffect(() => {
        fetchCustomers();
      }, [currentPage, pageSize, search, sortConfig]);

      const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
          direction = "desc";
        }
        setSortConfig({ key, direction });
      };
    
      const handleSearch = (event) => {
        setSearch(event.target.value);
      };
    
      const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
          setCurrentPage(currentPage + 1);
        }
      };
    
      const handlePrevPage = () => {
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      };

      const renderRows = () => {
        const sortedItems = [...customers].sort((a, b) => {
          if (sortConfig.key === null) return 0;
    
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
    
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
    
        return sortedItems.map((item, index) => (
          <tr key={item.id} className="bg-white hover:bg-gray-100 transition-colors">
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{item.maKhachHang}</td>
            <td className="px-4 py-2 flex items-center justify-center">
              <img src={item.avatarUrl} className="w-8 h-8 rounded-full mr-2" />
              {/* {item.tenDangNhap} */}
            </td>
            <td className="px-4 py-2">{item.tenKhachHang}</td>
            <td className="px-4 py-2">{item.email}</td>
            <td className="px-4 py-2">{item.soDienThoai}</td>
            <td className="px-4 py-2">{item.gioiTinh === 0 ? "Nam" : "Nữ"}</td>
            <td className="px-4 py-2">
                <button 
                onClick={() => getCustomer(item)}
                className="hover:scale-105 hover:text-orange-500 duration-200">
                    Chọn
                </button>
            </td>
          </tr>
        ));
      };

      // Goi hàm chọn khách hàng
      const fetchChonKhachHang = async (idKhachHang) => {
        try {
          const idHD = order.id || "";
          const idKH = idKhachHang || "";
          const response = await OrderService.chonKhachHang(idHD, idKH );
          toast.success(response.message);
          setOrder(response.data);
        }catch (err) {
          console.log("Không thể chọn khách hàng", err);
          toast.error("Không thể chọn khách hàng");
        }
      }

      // Gọi hàm tìm hách hàng theo Id
      const fetchKHById = async (idKH) => {
        try {
          if(!idKH) {
            setCustomer({});
            return;
          };
          const response = await CustomerService.getCustomerById(idKH);
          setCustomer(response.data);
        }catch (err){
          console.log("Không thể tìm thấy khach hàng",err);
        }
      }
      useEffect(() => {
        fetchKHById(order.idKhachHang);
      }, [order]);

      // Goi hàm bỏ chọn khách hàng
      const fetchBoChonKhachHang = async () => {
        try {
          const idHD = order.id || "";
          const response = await OrderService.boKhachHang(idHD);
          toast.success(response.message);
          setOrder(response.data);
        }catch (err) {
          console.log("Không thể bỏ chọn khách hàng", err);
          toast.error("Không thể bỏ chọn khách hàng");
        }
      }

      //Lấy khách hàng trong danh sách khách hàng
      const getCustomer = (cus) => {
        fetchChonKhachHang(cus.id);
      };

      // Bỏ chọn khách hàng ra khỏi hóa đơn
      const removeCustomer = () => {
        setTimeout(() => {
            fetchBoChonKhachHang();
        }, 200)
        
      };


      const renderSortableHeader = (label, sortKey) => {
          const isSorted = sortConfig.key === sortKey;
          const isAscending = isSorted && sortConfig.direction === "asc";
      
          return (
            <th
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors relative"
              onClick={() => handleSort(sortKey)}
            >
              <div className="flex items-center justify-center">
                {label}
                <div className="ml-2 flex flex-col">
                  <AiFillCaretUp
                    className={`text-sm ${isSorted && isAscending ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
                  />
                  <AiFillCaretDown
                    className={`text-sm ${isSorted && !isAscending ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
                  />
                </div>
              </div>
            </th>
          );
        };

    const newAdd = () => {
        return <Dialog>
                    <DialogTrigger className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600">
                        Thêm Mới +
                    </DialogTrigger>
                    <DialogContent className="w-96">
                        <DialogHeader>
                            <DialogTitle>Thêm mới khách hàng</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 space-y-2">
                            <label htmlFor="tenKhachHang">Tên khách hàng</label>
                            <input type="text" id="tenKhachHang" 
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />

                            <label htmlFor="soDienThoai">Số điện thoại</label>
                            <input type="text" id="soDienThoai" 
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />

                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" 
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:scale-105 duration-200">Thêm</button>
                        </div>

                    </DialogContent>
                </Dialog>
    }

    return <div className="bg-white rounded-lg shadow p-2 mb-4">
        <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-bold">Thông tin khách hàng</h1>
            <div>
                <Dialog>
                    <DialogTrigger>
                        <button className="px-3 py-2 bg-orange-500 text-white rounded-lg active:scale-95 duration-200">
                            Chọn khách hàng
                        </button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-5xl max-h-[700px] overflow-y-auto">
                        <DialogTitle className="text-lg">
                            Danh sách khách hàng
                        </DialogTitle>
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm khách hàng"
                                    className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={search}
                                    onChange={handleSearch}
                                />
                                </div>

                                <div className="flex gap-2">
                                {newAdd()}
                                </div>
                            </div>

                            <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs">
                                <thead>
                                <tr className="bg-gray-100 text-center">
                                    <th className="px-4 py-2">STT</th>
                                    {renderSortableHeader("Mã", "maKhachHang")}
                                    {renderSortableHeader("Ảnh", "tenDangNhap")}
                                    {renderSortableHeader("Tên", "tenKhachHang")}
                                    {renderSortableHeader("Email", "email")}
                                    {renderSortableHeader("Số điện thoại", "soDienThoai")}
                                    {renderSortableHeader("Giới tính", "gioiTinh")}
                                    <th className="px-4 py-2">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>{renderRows()}</tbody>
                            </table>

                            <div className="flex items-center justify-end gap-2 mt-3">
                                <button
                                    className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 0}  // Disable khi ở trang đầu
                                >
                                    {"<"}
                                </button>
                                <span className="text-sm text-gray-700">Trang {currentPage + 1} / {totalPages}</span>
                                <button
                                    className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages - 1}  // Disable khi ở trang cuối
                                >
                                    {">"}
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        <div className="bg-gray-200 p-2 rounded-lg relative">
            {order.idKhachHang && (
                <button 
                onClick={removeCustomer}
                className="absolute right-3 bg-gray-500 text-white rounded active:scale-95 duration-200">
                    Hủy chọn
                </button>
            )}
            <h2>Tên khách hàng: {customer.tenKhachHang || "Khách lẻ"}</h2>
            <h2>Số điện thoai: {customer.soDienThoai || "Khách lẻ"}</h2>
            <h2>Email: {customer.email || "Khách lẻ"}</h2>
        </div>
    </div>
}
export default CustomerOfBill;