import React from 'react';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { AiOutlineSearch } from "react-icons/ai";

const ProductFilters = ({
    filters,
    search,
    handlePriceChange,
    handleSearchChange,
    handleFilterChange,
    exportToExcel,
    thuongHieus,
    xuatXus,
    chatLieus,
    coAos,
    tayAos,
    mauSacs,
    kichThuocs
}) => {
    return (
        <div className="space-y-3 mb-4">
            {/* Hàng 1: Ô tìm kiếm & Khoảng giá */}
            <div className="grid grid-cols-6 gap-3">
                {/* Ô tìm kiếm */}
                <div className="relative col-span-3">
                    <label className="block text-xs font-medium text-gray-700">Tìm kiếm</label>
                    <input
                        type="text"
                        placeholder="Mã / tên sản phẩm"
                        value={search}
                        onChange={handleSearchChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full pl-8 text-sm"
                    />
                    <AiOutlineSearch className="absolute left-2 top-7 text-gray-400" />
                </div>

                {/* Khoảng giá */}
                <div className="relative col-span-3">
                    <label className="block text-xs font-medium text-gray-700">Khoảng giá</label>
                    <div className="px-3 py-1 border border-gray-300 rounded-md">
                        <div className="flex justify-between text-xs">
                            <span>{filters.minPrice.toLocaleString()} đ</span>
                            <span>{filters.maxPrice.toLocaleString()} đ</span>
                        </div>
                        <Slider
                            range
                            min={0}
                            max={10000000}
                            step={10000}
                            value={[filters.minPrice, filters.maxPrice]}
                            defaultValue={[0, 10000000]}
                            onChange={(value) => {
                                handlePriceChange("minPrice", value[0]);
                                handlePriceChange("maxPrice", value[1]);
                            }}
                            trackStyle={[{ backgroundColor: '#f97316' }]}
                            handleStyle={[
                                { borderColor: '#f97316', backgroundColor: '#f97316' },
                                { borderColor: '#f97316', backgroundColor: '#f97316' }
                            ]}
                            railStyle={{ backgroundColor: '#e5e7eb' }}
                        />

                    </div>

                </div>

            </div>

            {/* Hàng 2: Các bộ lọc */}
            <div className="grid grid-cols-4 gap-3">
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
                <div className="flex items-center gap-3 mt-4 col-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full col-1 py-2 px-3 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition"
                    >
                        Khôi phục bộ lọc
                    </button>


                    <button
                        className="w-full py-2 px-3 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition"
                        onClick={exportToExcel}
                    >
                        Xuất Excel
                    </button>
                </div>

            </div>

        </div>
    );
};

export default ProductFilters;
