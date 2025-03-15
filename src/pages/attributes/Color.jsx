import React, { useState, useEffect, useRef } from "react";
import { AiFillCaretUp, AiFillCaretDown, AiOutlineDelete } from "react-icons/ai";
import Switch from "react-switch";
import ColorService from "./services/ColorService";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import Modal from './component/DeleteModal';

export default function MauSac() {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [mauSacToUpdateTen, setMauSacToUpdateTen] = useState(null);
    const [mauSacToUpdateMaHex, setMauSacToUpdateMaHex] = useState(null);
    const [updatedTenMauSac, setUpdatedTenMauSac] = useState("");
    const [updatedMaHex, setUpdatedMaHex] = useState("");
    const [mauSacToDelete, setMauSacToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newTenMauSac, setNewTenMauSac] = useState("");
    const [newMaHex, setNewMaHex] = useState("");
    const inputRefTenMauSac = useRef(null);
    const inputRefMaHex = useRef(null);


    const fetchMauSac = async () => {
        try {
            const { content, totalPages } = await ColorService.getAll(currentPage, pageSize, search);
            setItems(content);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching colors:", error);
        }
    };

    useEffect(() => {
        fetchMauSac();
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

    const handleDoubleClickTenMauSac = (mauSac) => {
        setMauSacToUpdateTen(mauSac.id);
        setMauSacToUpdateMaHex(null);
        setUpdatedTenMauSac(mauSac.tenMauSac);
    };

    const handleDoubleClickMaHex = (mauSac) => {
        setMauSacToUpdateMaHex(mauSac.id);
        setMauSacToUpdateTen(null);
        setUpdatedMaHex(mauSac.maHex);
    };

    const handleClickOutside = (event) => {
        if (
            inputRefTenMauSac.current && !inputRefTenMauSac.current.contains(event.target) &&
            inputRefMaHex.current && !inputRefMaHex.current.contains(event.target)
        ) {
            setMauSacToUpdateTen(null);
            setMauSacToUpdateMaHex(null);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleUpdateTenMauSac = async () => {
        if (updatedTenMauSac.trim() === "" || updatedTenMauSac === items.find(item => item.id === mauSacToUpdateTen)?.tenMauSac) {
            return;
        }

        try {
            await ColorService.update(mauSacToUpdateTen, { tenMauSac: updatedTenMauSac });
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === mauSacToUpdateTen ? { ...item, tenMauSac: updatedTenMauSac } : item
                )
            );
            toast.success("Cập nhật tên màu sắc thành công!");
        } catch (error) {
            toast.error("Cập nhật thất bại, vui lòng thử lại!");
        } finally {
            setMauSacToUpdateTen(null);
            setUpdatedTenMauSac("");
        }
    };

    const handleUpdateMaHex = async () => {
        if (updatedMaHex.trim() === "" || updatedMaHex === items.find(item => item.id === mauSacToUpdateMaHex)?.maHex) {
            return;
        }

        try {
            await ColorService.update(mauSacToUpdateMaHex, { maHex: updatedMaHex });
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === mauSacToUpdateMaHex ? { ...item, maHex: updatedMaHex } : item
                )
            );
            toast.success("Cập nhật mã màu thành công!");
        } catch (error) {
            toast.error("Cập nhật thất bại, vui lòng thử lại!");
        } finally {
            setMauSacToUpdateMaHex(null);
            setUpdatedMaHex("");
        }
    };

    const handleBlurTenMauSac = () => {
        if (updatedTenMauSac !== "") {
            handleUpdateTenMauSac();
        }
        setMauSacToUpdateTen(null);
    };

    const handleBlurMaHex = () => {
        if (updatedMaHex !== "") {
            handleUpdateMaHex();
        }
        setMauSacToUpdateMaHex(null);
    };

    const handleChangeTenMauSac = (event) => {
        setUpdatedTenMauSac(event.target.value);
    };

    const handleChangeMaHex = (event) => {
        setUpdatedMaHex(event.target.value);
    };


    const handleToggleStatus = async (id) => {
        try {
            await ColorService.toggleStatus(id);
            const updatedItems = items.map((item) =>
                item.id === id ? { ...item, trangThai: !item.trangThai } : item
            );
            setItems(updatedItems);
            toast.success("Thay đổi trạng thái màu sắc thành công!");
        } catch (error) {
            console.error("Error toggling color status:", error);
            toast.error("Không thể thay đổi trạng thái màu sắc. Vui lòng thử lại!");
        }
    };

    const handleDeleteMauSac = (id) => {
        setMauSacToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            if (mauSacToDelete) {
                await ColorService.delete(mauSacToDelete);
                setItems(items.filter((item) => item.id !== mauSacToDelete));
                toast.success("Xóa màu sắc thành công!");
                setShowDeleteModal(false);
                fetchMauSac();
            }
        } catch (error) {
            console.error("Error deleting color:", error);
            toast.error("Không thể xóa màu sắc. Vui lòng thử lại!");
        } finally {
            setMauSacToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setMauSacToDelete(null);
    };


    const handleAddMauSac = async () => {
        if (newTenMauSac.trim() === "" || !newMaHex.trim()) {
            toast.error("Tên màu sắc và mã màu hex không được để trống!");
            return;
        }
        try {
            const newColor = await ColorService.add({
                tenMauSac: newTenMauSac,
                maHex: newMaHex
            });
            setItems([newColor, ...items]);
            setNewTenMauSac("");
            setNewMaHex("");
            setShowModal(false);
            fetchMauSac();
            toast.success("Thêm màu sắc thành công!");
        } catch (error) {
            console.error("Error adding color:", error);
            toast.error("Không thể thêm màu sắc. Vui lòng thử lại!");
        }
    };

    const exportToExcel = () => {
        const dataToExport = items.map(item => ({
            "Mã màu sắc": item.id,
            "Tên màu sắc": item.tenMauSac,
            "Ngày tạo": new Date(item.ngayTao).toLocaleDateString(),
            "Trạng thái": item.trangThai ? "Kích hoạt" : "Ngừng hoạt động",
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Màu sắc");
        XLSX.writeFile(wb, "thuong_hieu.xlsx");
    };

    const renderRows = () => {
        const sortedItems = [...items].sort((a, b) => {
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

                <td
                    className="px-4 py-2 cursor-pointer"
                    onDoubleClick={() => handleDoubleClickTenMauSac(item)}
                >
                    {mauSacToUpdateTen === item.id ? (
                        <input
                            ref={inputRefTenMauSac}
                            type="text"
                            value={updatedTenMauSac}
                            onChange={handleChangeTenMauSac}
                            onBlur={handleBlurTenMauSac}
                            autoFocus
                        />
                    ) : (
                        item.tenMauSac
                    )}
                </td>

                <td
                    className="px-4 py-2 cursor-pointer flex justify-center items-center"
                    onDoubleClick={() => handleDoubleClickMaHex(item)}
                >
                    {mauSacToUpdateMaHex === item.id ? (
                        <div className="relative w-full flex justify-center items-center">
                            <input
                                type="color"
                                ref={inputRefMaHex}
                                value={updatedMaHex}
                                onChange={handleChangeMaHex}
                                onBlur={handleBlurMaHex}
                                autoFocus
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div
                                style={{ backgroundColor: updatedMaHex }}
                                className="w-8 h-6 border rounded-md cursor-pointer border-gray-300"
                                alt="dẳd dsfsfddsfsfd"
                            > 
                            </div>
                        </div>
                    ) : (
                        <span className="text-gray-700">{item.maHex}</span>
                    )}
                </td>

                <td className="px-4 py-2">{new Date(item.ngayTao).toLocaleDateString()}</td>

                <td className={`px-4 py-2 ${item.trangThai ? "status-active" : "status-inactive"}`}>
                    <span className="status-dot"></span>
                    {item.trangThai ? " Kích hoạt" : " Ngừng hoạt động"}
                </td>

                <td className="px-4 py-2 flex justify-center gap-4">
                <div title={item.trangThai ? "Click để tắt" : "Click để kích hoạt"}>
            <Switch
              onChange={() => handleToggleStatus(item.id)}
              checked={item.trangThai}
              offColor="#808080"
              onColor="#00a000"
              uncheckedIcon={false}
              checkedIcon={false}
              height={20}
              width={40}
            />
            </div>
                    {/* <AiOutlineDelete
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteMauSac(item.id)}
                    /> */}
                </td>
            </tr>
        ));
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
                            className={`text-sm ${isSorted && isAscending ? "text-orange-500" : "text-gray-400"}`}
                        />
                        <AiFillCaretDown
                            className={`text-sm ${isSorted && !isAscending ? "text-orange-500" : "text-gray-400"}`}
                        />
                    </div>
                </div>
            </th>
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Quản lý màu sắc</h1>
            <div className="flex items-center justify-between gap-4 mb-4">
                <input
                    type="text"
                    className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Tìm kiếm màu sắc..."
                    value={search}
                    onChange={handleSearch}
                />
                <div className="flex gap-2">
                    <button
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
                        onClick={exportToExcel}
                    >
                        In excel
                    </button>
                    <button
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
                        onClick={() => setShowModal(true)}
                    >
                        Thêm màu sắc
                    </button>
                </div>
            </div>


            <table className="table-auto w-full px-4 py-2 bg-white rounded-lg shadow overflow-hidden text-center">
                <thead classname="bg-gray-100 text-center">
                    <tr>
                        {renderSortableHeader("STT", "id")}
                        {renderSortableHeader("Tên màu sắc", "tenMauSac")}
                        {renderSortableHeader("Mã màu", "maHex")}
                        {renderSortableHeader("Ngày tạo", "ngayTao")}
                        {renderSortableHeader("Trạng Thái", "trangThai")}
                        <th className="px-4 py-2">Thao tác</th>
                    </tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="entries" className="text-sm text-gray-700">Xem</label>
                    <select
                        id="entries"
                        className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>

                    <span className="text-sm text-gray-700">Sản phẩm</span>
                </div>

                <div className="flex items-center">
                    <button
                        className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
                        onClick={handlePrevPage}
                    >
                        {"<"}
                    </button>
                    <div className="mx-2 text-xs">{`Trang ${currentPage + 1} / ${totalPages}`}</div>
                    <button
                        className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-orange-500 hover:text-white"
                        onClick={handleNextPage}
                    >
                        {">"}
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-6 text-center">Thêm màu sắc</h2>

                        {/* Tên màu sắc */}
                        <div className="mb-4">
                            <label htmlFor="tenMauSac" className="block text-sm font-medium text-gray-700 mb-2">
                                Tên màu sắc
                            </label>
                            <input
                                type="text"
                                id="tenMauSac"
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên màu sắc"
                                value={newTenMauSac}
                                onChange={(e) => setNewTenMauSac(e.target.value)}
                            />
                        </div>

                        {/* Mã màu hex */}
                        <div className="mb-4">
                            <label htmlFor="maHex" className="block text-sm font-medium text-gray-700 mb-2">
                                Mã màu hex
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="color"
                                    id="maHex"
                                    className="w-10 h-10 border rounded-md mr-2"
                                    value={newMaHex}
                                    onChange={(e) => setNewMaHex(e.target.value)}
                                />
                                <span className="text-sm text-gray-600">{newMaHex || "Chưa chọn màu"}</span>
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                                onClick={() => setShowModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                                onClick={handleAddMauSac}
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>

            )}


            <Modal isVisible={showDeleteModal} onConfirm={confirmDelete} onCancel={cancelDelete} />

        </div>

    );
}
