import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import ProductDetailService from "./services/ProductDetailService";
import { toast } from "react-toastify";
import ProductUpdateModal from "./components/ProductUpdateModal";
import ProductTable from './components/ProductTable';
import Pagination from './components/Pagination';
import ProductFilters from './components/ProductFilters';

export default function ProductDetail() {
  const { maSanPham } = useParams();

  const [sanPhams, setSanPhams] = useState([]);
  const [chatLieus, setChatLieus] = useState([]);
  const [coAos, setCoAos] = useState([]);
  const [kichThuocs, setKichThuocs] = useState([]);
  const [mauSacs, setMauSacs] = useState([]);
  const [tayAos, setTayAos] = useState([]);
  const [thuongHieus, setThuongHieus] = useState([]);
  const [xuatXus, setXuatXus] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const [filters, setFilters] = useState({
    thuongHieuIds: [],
    xuatXuIds: [],
    chatLieuIds: [],
    coAoIds: [],
    tayAoIds: [],
    mauSacIds: [],
    kichThuocIds: [],
    minPrice: 0,
    maxPrice: 10000000,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportToExcel = () => {
    const dataToExport = sanPhams.map((sanPham, index) => ({
      "STT": index + 1,
      "Mã sản phẩm": sanPham.sanPham.maSanPham,
      "Tên sản phẩm": sanPham.sanPham.tenSanPham,
      "Chất liệu": sanPham.chatLieu?.tenChatLieu || "N/A",
      "Cổ áo": sanPham.coAo?.tenCoAo || "N/A",
      "Màu sắc": sanPham.mauSac?.tenMauSac || "N/A",
      "Kích thước": sanPham.kichThuoc?.tenKichThuoc || "N/A",
      "Tay áo": sanPham.tayAo?.tenTayAo || "N/A",
      "Thương hiệu": sanPham.thuongHieu?.tenThuongHieu || "N/A",
      "Xuất xứ": sanPham.xuatXu?.tenXuatXu || "N/A",
      "Số lượng": sanPham.soLuong,
      "Đơn giá": sanPham.donGia,
      "Ngày tạo": format(new Date(sanPham.ngayTao), "HH:mm:ss dd/MM/yyyy"),
      "Trạng thái": sanPham.trangThai ? "Còn hàng" : "Hết hàng",
    }));

    const ws = utils.json_to_sheet(dataToExport);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sản phẩm");

    writeFile(wb, "san_pham.xlsx");
  };


  useEffect(() => {
    fetchSelectOptions();
  }, []);

  useEffect(() => {
    if (maSanPham) {
      setSearch(maSanPham);
      setPage(0);
    }
  }, [maSanPham]);

  useEffect(() => {
    if (search) {
      fetchProductDetails();
    }
  }, [search, page, pageSize, sortConfig, filters]);

  const fetchSelectOptions = async () => {
    try {
      const chatLieuData = await ProductDetailService.getChatLieu();
      setChatLieus(chatLieuData);

      const coAoData = await ProductDetailService.getCoAo();
      setCoAos(coAoData);

      const kichThuocData = await ProductDetailService.getKichThuoc();
      setKichThuocs(kichThuocData);

      const mauSacData = await ProductDetailService.getMauSac();
      setMauSacs(mauSacData);

      const tayAoData = await ProductDetailService.getTayAo();
      setTayAos(tayAoData);

      const thuongHieuData = await ProductDetailService.getThuongHieu();
      setThuongHieus(thuongHieuData);

      const xuatXuData = await ProductDetailService.getXuatXu();
      setXuatXus(xuatXuData);

    } catch (error) {
      setError("Error fetching select options");
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const result = await ProductDetailService.getAllProductDetails(
        page,
        size,
        search,
        "id",
        "desc",
        filters
      );
      setSanPhams(result.content);
      setTotalPages(result.totalPages);
      setLoading(false);
    } catch (error) {
      setError("Error fetching product details");
      setLoading(false);
    }
  };


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handlePriceChange = (field, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value ? parseFloat(value) : ""
    }));
    setPage(0);
  };


  const handleFilterChange = (field, selectedOptions) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
    setPage(0);
  };


  const resetFilters = () => {
    setFilters({
      thuongHieuIds: [],
      xuatXuIds: [],
      chatLieuIds: [],
      coAoIds: [],
      tayAoIds: [],
      mauSacIds: [],
      kichThuocIds: [],
      minPrice: 0,
      maxPrice: 10000000,
    });
    setPage(0);
    fetchProductDetails();
  };


  const handleToggleStatus = async (id) => {
    try {
      const updatedProduct = await ProductDetailService.toggleProductDetailStatus(id);

      setSanPhams((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, trangThai: updatedProduct.trangThai } : product
        )
      );
      toast.success("Thay đổi trạng thái thành công!");
    } catch (error) {
      console.error("Error toggling product detail status:", error);
      toast.error("Không thể thay đổi trạng thái. Vui lòng thử lại!");
    }
  };


  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleUpdateProduct = (product) => {
    console.log("Updating product:", product);
    setCurrentProduct(product);
    setModalVisible(true);
  };

  const handleProductUpdate = (updatedProduct) => {
    setSanPhams((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const confirmDeleteProduct = async () => {
    try {
      if (productToDelete) {
        await ProductDetailService.deleteProductDetail(productToDelete.id);
        setSanPhams((prev) =>
          prev.filter((p) => p.id !== productToDelete.id)
        );
        toast.success("Xóa sản phẩm thành công!");
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại!");
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen"><h1 className="text-xl font-bold mb-4">
      Chi tiết sản phẩm {sanPhams.length > 0 ? sanPhams[0].sanPham.tenSanPham : ""}
    </h1>

      <ProductFilters
        filters={filters}
        search={search}
        handleFilterChange={handleFilterChange}
        handleSearchChange={handleSearchChange}
        handlePriceChange={handlePriceChange}
        thuongHieus={thuongHieus}
        xuatXus={xuatXus}
        chatLieus={chatLieus}
        coAos={coAos}
        tayAos={tayAos}
        mauSacs={mauSacs}
        kichThuocs={kichThuocs}
        minPrice={minPrice}
        maxPrice={maxPrice}
        resetFilters={resetFilters}
        exportToExcel={exportToExcel}
      />

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <ProductTable
            sanPhams={sanPhams}
            handleToggleStatus={handleToggleStatus}
            handleUpdateProduct={handleUpdateProduct}
            openDeleteModal={openDeleteModal}
          />
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />

      <ProductUpdateModal
        modalVisible={modalVisible}
        currentProduct={currentProduct}
        onClose={handleModalClose}
        onUpdate={handleProductUpdate}
        thuongHieus={thuongHieus}
        xuatXus={xuatXus}
        chatLieus={chatLieus}
        coAos={coAos}
        tayAos={tayAos}
        mauSacs={mauSacs}
        kichThuocs={kichThuocs}
      />



      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md mr-2 hover:bg-gray-400"
                onClick={closeDeleteModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={confirmDeleteProduct}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
