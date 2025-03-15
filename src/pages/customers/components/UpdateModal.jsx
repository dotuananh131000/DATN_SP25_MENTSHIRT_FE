import React, { useState, useRef, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import CustomerService from '../services/CustomerService';
import CustomerAddressService from '../services/CustomerAddressService';
import GHNService from '../services/GHNService';
import UploadFileService from '../services/UploadFileService';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

const UpdateModal = ({ isOpen, setUpdateModal, customer, fetchCustomers }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [updatedCustomer, setUpdatedCustomer] = useState(customer || {});
    const [avatar, setAvatar] = useState(customer?.avatarUrl || null);
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [newAddress, setNewAddress] = useState({
        tinhThanhId: '',
        tinhThanh: '',
        quanHuyenId: '',
        quanHuyen: '',
        phuongXaId: '',
        phuongXa: '',
        diaChiChiTiet: ''
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        setUpdatedCustomer(customer || {});
        setAvatar(customer?.avatarUrl || null);
        if (customer) {
            fetchCustomerAddresses(customer.id);
        }
        fetchProvinces();
    }, [customer]);

    const fetchCustomerAddresses = async (customerId) => {
        try {
            const response = await CustomerAddressService.getByCustomerId(customerId);
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching customer addresses:", error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await GHNService.getProvinces();
            setProvinces(response.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await GHNService.getDistrictsByProvince(provinceId);
            setDistricts(response.data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await GHNService.getWardsByDistrict(districtId);
            setWards(response.data);
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    const handleAvatarUpload = async (file) => {
        if (!file) return;

        try {
            const fileURL = URL.createObjectURL(file);
            setAvatar(fileURL);

            const uploadedImageUrl = await UploadFileService.uploadProductImage(file);
            setUpdatedCustomer(prev => ({ ...prev, avatarUrl: uploadedImageUrl }));
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
            toast.error("Không thể tải ảnh lên!");
        }
    };

    const handleDoubleClick = () => fileInputRef.current.click();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await CustomerService.update(customer.id, updatedCustomer);
            toast.success("Cập nhật khách hàng thành công!");
            fetchCustomers();
            setUpdateModal(false);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleResetPassword = async () => {
        try {
            await CustomerService.resetPassword(customer.id);
            toast.success("Đặt lại mật khẩu thành công!");
            setIsConfirmOpen(false);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));

        if (name === 'tinhThanhId') {
            const selectedProvince = provinces.find(p => p.ProvinceID == value);
            setNewAddress(prev => ({ ...prev, tinhThanh: selectedProvince?.ProvinceName || '' }));
            fetchDistricts(value);
        }

        if (name === 'quanHuyenId') {
            const selectedDistrict = districts.find(d => d.DistrictID == value);
            setNewAddress(prev => ({ ...prev, quanHuyen: selectedDistrict?.DistrictName || '' }));
            fetchWards(value);
        }

        if (name === 'phuongXaId') {
            const selectedWard = wards.find(w => w.WardCode === value);
            setNewAddress(prev => ({ ...prev, phuongXa: selectedWard?.WardName || '' }));
        }

    };

    const handleAddAddress = async () => {
        console.log("Du lieu gui", newAddress);
        if (!newAddress.tinhThanhId || !newAddress.tinhThanh || !newAddress.quanHuyenId || !newAddress.quanHuyen || !newAddress.phuongXaId || !newAddress.phuongXa || !newAddress.diaChiChiTiet) {
            toast.error("Vui lòng điền đầy đủ thông tin địa chỉ!");
            return;
        }

        try {
            const response = await CustomerAddressService.create({
                khachHangId: customer.id,
                tinhThanhId: newAddress.tinhThanhId,
                tinhThanh: newAddress.tinhThanh,
                quanHuyenId: newAddress.quanHuyenId,
                quanHuyen: newAddress.quanHuyen,
                phuongXaId: newAddress.phuongXaId,
                phuongXa: newAddress.phuongXa,
                diaChiChiTiet: newAddress.diaChiChiTiet
            });
            setAddresses([...addresses, response.data]);
            toast.success("Thêm địa chỉ mới thành công!");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleRemoveAddress = async (addressId) => {
        try {
            await CustomerAddressService.delete(addressId);
            setAddresses(addresses.filter(address => address.id !== addressId));
            toast.success("Xóa địa chỉ thành công!");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box relative max-w-5xl w-full"> {/* Tăng chiều rộng modal */}
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={() => setUpdateModal(false)}>✖</button>
                    <h3 className="font-bold text-lg text-orange-600 text-center">Cập nhật khách hàng</h3>
                    <div className="flex">
                        {/* Bên trái - Thông tin khách hàng */}
                        <div className="w-1/2 pr-4 border-r">
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full border border-gray-300 overflow-hidden cursor-pointer" onDoubleClick={handleDoubleClick}>
                                    {avatar ? (
                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Chưa có ảnh</div>
                                    )}
                                </div>
                                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleAvatarUpload(e.target.files[0])} />
                            </div>

                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Mã khách hàng</label>
                                    <input type="text" name="maKhachHang" value={updatedCustomer.maKhachHang || ''} readOnly className="input input-bordered w-full" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Tên khách hàng</label>
                                    <input type="text" name="tenKhachHang" value={updatedCustomer.tenKhachHang || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
                                    <input type="text" name="tenDangNhap" value={updatedCustomer.tenDangNhap || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                                    <input type="text" name="soDienThoai" value={updatedCustomer.soDienThoai || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <input type="email" name="email" value={updatedCustomer.email || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                                    <input type="date" name="ngaySinh" value={updatedCustomer.ngaySinh || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="py-2 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Giới tính</label>
                                    <select name="gioiTinh" value={updatedCustomer.gioiTinh || 0} onChange={handleChange} className="select select-bordered w-full">
                                        <option value={0}>Nam</option>
                                        <option value={1}>Nữ</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Bên phải - Địa chỉ */}
                        <div className="w-1/2 pl-4">

                            <div className="flex gap-2 mt-4">
                                <div className="w-1/3">
                                    <label htmlFor="tinhThanhId" className="text-sm font-medium text-gray-600">Tỉnh/Thành</label>
                                    <select name="tinhThanhId" id="tinhThanhId" value={newAddress.tinhThanhId} onChange={(e) => { handleAddressChange(e); fetchDistricts(e.target.value); }} className="select select-bordered w-full mt-2">
                                        <option value="">Chọn tỉnh/thành</option>
                                        {provinces.map(province => (
                                            <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-1/3">
                                    <label htmlFor="quanHuyenId" className="text-sm font-medium text-gray-600">Quận/Huyện</label>
                                    <select name="quanHuyenId" id="quanHuyenId" value={newAddress.quanHuyenId} onChange={(e) => { handleAddressChange(e); fetchWards(e.target.value); }} className="select select-bordered w-full mt-2">
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.map(district => (
                                            <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-1/3">
                                    <label htmlFor="phuongXaId" className="text-sm font-medium text-gray-600">Phường/Xã</label>
                                    <select name="phuongXaId" id="phuongXaId" value={newAddress.phuongXaId} onChange={handleAddressChange} className="select select-bordered w-full mt-2">
                                        <option value="">Chọn phường/xã</option>
                                        {wards.map(ward => (
                                            <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>


                            <input type="text" name="diaChiChiTiet" value={newAddress.diaChiChiTiet} onChange={handleAddressChange} className="input input-bordered w-full mt-2" placeholder="Địa chỉ chi tiết" />

                            <button className="btn bg-orange-500 hover:bg-orange-600 text-white w-full mt-2" onClick={handleAddAddress}>Thêm địa chỉ mới</button>
                            <div className="mt-6 space-y-4">
                                {addresses.map((address) => (
                                    <div key={address.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm">
                                        <div className="text-sm text-gray-700">
                                            {address.diaChiChiTiet ? address.diaChiChiTiet : 'Thông tin chi tiết địa chỉ không có'}
                                            {address.quanHuyen ? `, ${address.quanHuyen}` : ''}
                                            {address.tinhThanh ? `, ${address.tinhThanh}` : ''}
                                            {address.phuongXa ? `, ${address.phuongXa}` : ''}
                                        </div>
                                        <button className="text-red-500 hover:text-red-600 flex items-center" onClick={() => handleRemoveAddress(address.id)}>
                                            <FaTrashAlt className="mr-2" /> Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="modal-action flex justify-end gap-2">
                        <button className="btn bg-orange-500 hover:bg-orange-600 text-white" onClick={handleUpdate}>Xác nhận</button>
                        <button className="btn bg-gray-500 hover:bg-gray-600 text-white" onClick={() => setIsConfirmOpen(true)}>Đặt lại mật khẩu</button>
                    </div>
                </div>
            </div>
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleResetPassword} message="Bạn có chắc muốn đặt lại mật khẩu không?" />
        </>
    );

};

export default UpdateModal;