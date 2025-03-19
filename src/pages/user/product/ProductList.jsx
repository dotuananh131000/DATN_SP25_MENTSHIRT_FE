import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from 'react-select';
import { FiSearch } from "react-icons/fi";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ProductService from "./services/ProductService";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    thuongHieuIds: [],
    xuatXuIds: [],
    chatLieuIds: [],
    coAoIds: [],
    tayAoIds: [],
    mauSacIds: [],
    kichThuocIds: [],
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: "id,desc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [thuongHieuOptions, setThuongHieuOptions] = useState([]);
  const [xuatXuOptions, setXuatXuOptions] = useState([]);
  const [chatLieuOptions, setChatLieuOptions] = useState([]);
  const [coAoOptions, setCoAoOptions] = useState([]);
  const [tayAoOptions, setTayAoOptions] = useState([]);
  const [mauSacOptions, setMauSacOptions] = useState([]);
  const [kichThuocOptions, setKichThuocOptions] = useState([]);

  useEffect(() => {
    if (filters) {
      fetchProducts();
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  function handleColorClick(colorId) {
    const currentColorIds = filters.mauSacIds || [];
    const updatedColorIds = currentColorIds.includes(colorId)
      ? currentColorIds.filter(id => id !== colorId)
      : [...currentColorIds, colorId];

    handleFilterChange("mauSacIds", updatedColorIds);
  }


  function handleSizeClick(sizeId) {
    // Toggle size selection
    const currentSizeIds = filters.kichThuocIds || [];
    const updatedSizeIds = currentSizeIds.includes(sizeId)
      ? currentSizeIds.filter(id => id !== sizeId)
      : [...currentSizeIds, sizeId];

    handleFilterChange("kichThuocIds", updatedSizeIds);
  }

  function handleResetFilters() {
    setFilters({
      search: "",
      thuongHieuIds: [],
      xuatXuIds: [],
      chatLieuIds: [],
      coAoIds: [],
      tayAoIds: [],
      mauSacIds: [],
      kichThuocIds: [],
      minPrice: 0,
      maxPrice: 1000000,
      sortBy: "id,desc",
      page: 0,
      size: 9
    });
  }

  // For component state
  const [selectedSizes, setSelectedSizes] = useState([]);
  useEffect(() => {
    setSelectedSizes(filters.kichThuocIds || []);
  }, [filters.kichThuocIds]);

  const fetchProducts = async () => {
    try {
      const [sortBy, sortDir] = (filters.sortBy ?? 'id,desc').split(',');
      const response = await ProductService.getAllProducts(
        currentPage - 1,
        10,
        filters.search ?? '',
        sortBy,
        sortDir,
        filters
      );
      setProducts(response.content);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const thuongHieuResponse = await ProductService.getThuongHieu();
      setThuongHieuOptions(thuongHieuResponse.map(item => ({ value: item.id, label: item.tenThuongHieu })));

      const xuatXuResponse = await ProductService.getXuatXu();
      setXuatXuOptions(xuatXuResponse.map(item => ({ value: item.id, label: item.tenXuatXu })));

      const chatLieuResponse = await ProductService.getChatLieu();
      setChatLieuOptions(chatLieuResponse.map(item => ({ value: item.id, label: item.tenChatLieu })));

      const coAoResponse = await ProductService.getCoAo();
      setCoAoOptions(coAoResponse.map(item => ({ value: item.id, label: item.tenCoAo })));

      const tayAoResponse = await ProductService.getTayAo();
      setTayAoOptions(tayAoResponse.map(item => ({ value: item.id, label: item.tenTayAo })));

      const mauSacResponse = await ProductService.getMauSac();
      setMauSacOptions(mauSacResponse.map(item => ({ value: item.id, label: item.tenMauSac, maHex: item.maHex })));

      const kichThuocResponse = await ProductService.getKichThuoc();
      setKichThuocOptions(kichThuocResponse.map(item => ({ value: item.id, label: item.tenKichThuoc })));
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > Math.ceil(totalItems / 10)) return;
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / 10);

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Hero Banner */}
          <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 shadow-xl">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern)" />
              </svg>
            </div>
            <div className="relative p-8 md:p-12">
              <div className="max-w-lg">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">Bộ sưu tập mới nhất</h1>
                <p className="mt-4 text-white/90">
                  Khám phá phong cách mới với những thiết kế độc đáo, chất liệu cao cấp và kiểu dáng hiện đại.
                </p>
                <div className="mt-8">
                  <a href="#products" className="inline-block rounded-full bg-white px-8 py-3 text-sm font-medium text-orange-600 shadow-md transition hover:bg-gray-100">
                    Khám phá ngay
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Header with Search */}
          <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-orange-500 rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Tất cả sản phẩm</h2>
            </div>

            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="text-gray-400 h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full rounded-full border-2 border-orange-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 p-1.5 text-white transition hover:bg-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </header>

          {/* Mobile Filter Button */}
          <div className="mt-6 block lg:hidden">
            <button className="flex w-full items-center justify-between rounded-lg bg-orange-100 p-4 text-sm font-medium text-orange-600 shadow hover:bg-orange-200">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Lọc & Sắp xếp
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div id="products" className="mt-6 lg:mt-8 lg:grid lg:grid-cols-8 lg:gap-8">
            {/* Sidebar Filters */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-4 space-y-6 rounded-2xl bg-white p-6 shadow-lg">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    Bộ lọc
                  </h3>
                </div>

                <div>
                  <label htmlFor="SortBy" className="block text-sm font-medium text-gray-700">
                    Sắp xếp theo
                  </label>
                  <select
                    id="SortBy"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  >
                    <option value="id,desc">Mặc định</option>
                    <option value="tenSanPham,asc">Tên sản phẩm (A → Z)</option>
                    <option value="tenSanPham,desc">Tên sản phẩm (Z → A)</option>
                    <option value="gia,asc">Giá thấp đến cao</option>
                    <option value="gia,desc">Giá cao đến thấp</option>
                    <option value="soLuongDaBan,asc">Bán ít đến nhiều</option>
                    <option value="soLuongDaBan,desc">Bán nhiều đến ít</option>
                  </select>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Thương hiệu</h4>
                  <div className="styled-select">
                    <Select
                      isMulti
                      options={thuongHieuOptions}
                      onChange={(selected) => handleFilterChange("thuongHieuIds", selected ? selected.map(option => option.value) : [])}
                      placeholder="Chọn thương hiệu"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          boxShadow: 'none',
                          '&:hover': {
                            border: '1px solid #f97316',
                          },
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: '#ffedd5',
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: '#c2410c',
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          color: '#c2410c',
                          '&:hover': {
                            backgroundColor: '#f97316',
                            color: 'white',
                          },
                        }),
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Xuất xứ</h4>
                  <Select
                    isMulti
                    options={xuatXuOptions}
                    onChange={(selected) => handleFilterChange("xuatXuIds", selected ? selected.map(option => option.value) : [])}
                    placeholder="Chọn xuất xứ"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: 'none',
                        '&:hover': {
                          border: '1px solid #f97316',
                        },
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#ffedd5',
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#c2410c',
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: '#c2410c',
                        '&:hover': {
                          backgroundColor: '#f97316',
                          color: 'white',
                        },
                      }),
                    }}
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Chất liệu</h4>
                  <Select
                    isMulti
                    options={chatLieuOptions}
                    onChange={(selected) => handleFilterChange("chatLieuIds", selected ? selected.map(option => option.value) : [])}
                    placeholder="Chọn chất liệu"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Kiểu cổ áo</h4>
                  <Select
                    isMulti
                    options={coAoOptions}
                    onChange={(selected) => handleFilterChange("coAoIds", selected ? selected.map(option => option.value) : [])}
                    placeholder="Chọn kiểu cổ áo"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Kiểu tay áo</h4>
                  <Select
                    isMulti
                    options={tayAoOptions}
                    onChange={(selected) => handleFilterChange("tayAoIds", selected ? selected.map(option => option.value) : [])}
                    placeholder="Chọn kiểu tay áo"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Màu sắc</h4>
                  <div className="flex flex-wrap gap-2">
                    {mauSacOptions.map((mauSac) => (
                      <button
                        key={mauSac.value}
                        className={`w-8 h-8 rounded-full border-2 ${filters.mauSacIds.includes(mauSac.value) ? "border-orange-500" : "border-gray-300"
                          }`}
                        style={{ backgroundColor: mauSac.maHex }}
                        onClick={() => handleColorClick(mauSac.value)}
                      />
                    ))}
                  </div>
                  {/* <Select
                    isMulti
                    options={mauSacOptions}
                    onChange={(selected) => handleFilterChange("mauSacIds", selected ? selected.map(option => option.value) : [])}
                    placeholder="Xem tất cả màu"
                    

                  /> */}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Kích thước</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {kichThuocOptions.map((size) => (
                      <button
                        key={size.value}
                        className={`border-2 rounded-md py-1 text-center text-sm font-medium transition ${selectedSizes.includes(size.value)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-gray-200 text-gray-700 hover:border-orange-300'
                          }`}
                        onClick={() => handleSizeClick(size.value)}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Khoảng giá</h4>
                  <Slider
                    range
                    min={0}
                    max={1000000}
                    value={[filters.minPrice, filters.maxPrice]}
                    onChange={(value) => {
                      handleFilterChange("minPrice", value[0]);
                      handleFilterChange("maxPrice", value[1]);
                    }}
                    trackStyle={[{ backgroundColor: '#f97316' }]}
                    handleStyle={[
                      { borderColor: '#f97316', backgroundColor: '#f97316' },
                      { borderColor: '#f97316', backgroundColor: '#f97316' }
                    ]}
                    railStyle={{ backgroundColor: '#fed7aa' }}
                  />
                  <div className="flex justify-between text-xs mt-2">
                    <span>{filters.minPrice.toLocaleString()} ₫</span>
                    <span>{filters.maxPrice.toLocaleString()} ₫</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <button
                    className="w-full rounded-lg bg-orange-500 py-3 font-medium text-white shadow-md hover:bg-orange-600 transition"
                    onClick={handleResetFilters}
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="lg:col-span-6">
              {/* Product Count */}
              <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-600">
                  Hiển thị <span className="font-medium text-orange-600">{products?.length || 0}</span> trên tổng số <span className="font-medium text-orange-600">{totalItems || 0}</span> sản phẩm
                </p>
              </div>

              {/* Products */}
              {products && products.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group rounded-xl overflow-hidden bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    >
                      <Link to={`/product/${product.id}`} className="block relative">
                        <div className="relative h-60 overflow-hidden bg-gray-100">
                          <img
                            src={product.hinhAnh}
                            alt={product.tenSanPham}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {product.giamGia && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{product.giamGia}%
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
                            Đã bán {product.soLuongDaBan}
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex mb-2">
                            {product.soLuong < 10 && (
                              <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                                Sắp hết
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-semibold text-gray-800 group-hover:text-orange-600 transition line-clamp-2 h-12">
                            {product.tenSanPham}
                          </h3>

                          {/* Hiển thị số lượng sản phẩm */}
                          <p className="text-sm text-gray-600 mt-1">Số lượng: {product.soLuong}</p>

                          <div className="mt-2 flex items-end justify-between">
                            {product.giamGia ? (
                              <div>
                                <p className="text-lg font-bold text-orange-600">
                                  {((product.gia * (100 - product.giamGia)) / 100).toLocaleString()} ₫
                                </p>
                                <p className="text-sm text-gray-500 line-through">
                                  {product.gia.toLocaleString()} ₫
                                </p>
                              </div>
                            ) : (
                              <p className="text-lg font-bold text-orange-600">
                                {product.gia.toLocaleString()} ₫
                              </p>
                            )}

                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition hover:bg-orange-500 hover:text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
                  <svg className="h-16 w-16 text-orange-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    Không có sản phẩm nào phù hợp với bộ lọc hiện tại. Vui lòng thử lại với các tiêu chí khác.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${currentPage === 1 ? 'border-gray-200 bg-gray-100 text-gray-400' : 'border-orange-200 bg-white text-orange-600 hover:bg-orange-50'}`}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Trang trước</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {[...Array(totalPages).keys()].map((page) => {
                    const pageNumber = page + 1;

                    // Show limited page numbers with dots
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${currentPage === pageNumber
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-white text-gray-900 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }

                    // Show dots for skipped pages
                    if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return <span key={page} className="px-2">...</span>;
                    }

                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${currentPage === totalPages ? 'border-gray-200 bg-gray-100 text-gray-400' : 'border-orange-200 bg-white text-orange-600 hover:bg-orange-50'}`}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Trang sau</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductList;