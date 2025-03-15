import React, { useState, useRef, useEffect } from 'react';
import CustomerService from '../services/CustomerService';
import CustomerAddressService from '../services/CustomerAddressService';
import GHNService from '../services/GHNService';
import UploadFileService from '../services/UploadFileService';
import { toast } from 'react-toastify';

const CreateModal = ({ isOpen, onCancel, setCreateModal, fetchCustomers }) => {
    const [newCustomer, setNewCustomer] = useState({
        maKhachHang: '',
        tenKhachHang: '',
        tenDangNhap: '',
        email: '',
        soDienThoai: '',
        gioiTinh: 0,
        ngaySinh: '',
        avatarUrl: ''
    });
    const [avatar, setAvatar] = useState(null);
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
        if (isOpen) {
            resetForm(); // Reset form khi modal mở
        }
        fetchProvinces();
    }, [isOpen]);

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
            setNewCustomer(prev => ({ ...prev, avatarUrl: uploadedImageUrl }));
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
            toast.error("Không thể tải ảnh lên!");
        }
    };

    const handleDoubleClick = () => fileInputRef.current.click();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
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

    const handleCreateCustomer = async () => {
        try {
            const response = await CustomerService.add(newCustomer);
            const createdCustomer = response.data;

            if (newAddress.tinhThanhId && newAddress.quanHuyenId && newAddress.phuongXaId && newAddress.diaChiChiTiet) {
                await CustomerAddressService.create({
                    khachHangId: createdCustomer.id,
                    tinhThanhId: newAddress.tinhThanhId,
                    tinhThanh: newAddress.tinhThanh,
                    quanHuyenId: newAddress.quanHuyenId,
                    quanHuyen: newAddress.quanHuyen,
                    phuongXaId: newAddress.phuongXaId,
                    phuongXa: newAddress.phuongXa,
                    diaChiChiTiet: newAddress.diaChiChiTiet
                });
            }

            toast.success("Tạo khách hàng thành công!");
            fetchCustomers();
            setCreateModal(false);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const generateRandomValue = async (type) => {
        let randomValue;
        do {
            if (type === 'maKhachHang') {
                randomValue = 'KH' + Math.floor(Math.random() * 1000000); 
            } else if (type === 'tenDangNhap') {
                randomValue = 'user' + Math.floor(Math.random() * 1000000); 
            }
        } while (await isValueExists(type, randomValue)); 
        return randomValue;
    };

    const isValueExists = async (type, value) => {
        try {
            const response = type === 'maKhachHang'
                ? await CustomerService.getByMaKhachHang(value)
                : await CustomerService.getByTenDangNhap(value);
            return response.data != null; 
        } catch (error) {
            return false; 
        }
    };

    const resetForm = async () => {
        setNewCustomer({
            maKhachHang: await generateRandomValue('maKhachHang'),
            tenKhachHang: '',
            tenDangNhap: await generateRandomValue('tenDangNhap'),
            email: '',
            soDienThoai: '',
            gioiTinh: 0,
            ngaySinh: '',
            avatarUrl: ''
        });
        setNewAddress({
            tinhThanhId: '',
            tinhThanh: '',
            quanHuyenId: '',
            quanHuyen: '',
            phuongXaId: '',
            phuongXa: '',
            diaChiChiTiet: ''
        });
        setAvatar(null);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box relative max-w-5xl w-full">
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onCancel}>✖</button>
                    <h3 className="font-bold text-lg text-orange-600 text-center">Tạo khách hàng mới</h3>
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
                                    <input type="text" name="maKhachHang" value={newCustomer.maKhachHang} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập mã khách hàng" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Tên khách hàng</label>
                                    <input type="text" name="tenKhachHang" value={newCustomer.tenKhachHang} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập tên khách hàng" />
                                </div>
                            </div>

                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
                                    <input type="text" name="tenDangNhap" value={newCustomer.tenDangNhap} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập tên đăng nhập" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                                    <input type="text" name="soDienThoai" value={newCustomer.soDienThoai} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập số điện thoại" />
                                </div>
                            </div>

                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <input type="email" name="email" value={newCustomer.email} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập email" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                                    <input type="date" name="ngaySinh" value={newCustomer.ngaySinh} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập ngày sinh" />
                                </div>
                            </div>

                            <div className="py-2 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Giới tính</label>
                                    <select name="gioiTinh" value={newCustomer.gioiTinh} onChange={handleChange} className="select select-bordered w-full">
                                        <option value={0}>Nam</option>
                                        <option value={1}>Nữ</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Bên phải - Địa chỉ */}
                        <div className="w-1/2 pl-4">
                            <h4 className="text-sm font-medium text-gray-600">Địa chỉ</h4>
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

                            <input type="text" name="diaChiChiTiet" value={newAddress.diaChiChiTiet} onChange={handleAddressChange} className="input input-bordered w-full mt-2" placeholder="Nhập địa chỉ chi tiết" />
                        </div>
                    </div>

                    <div className="modal-action flex justify-end gap-2">
                        <button className="btn bg-orange-500 hover:bg-orange-600 text-white" onClick={handleCreateCustomer}>Tạo khách hàng</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateModal;