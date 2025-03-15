import React, { useState, useRef, useEffect } from 'react';
import EmployeeService from '../services/EmployeeService';
import UploadFileService from '../services/UploadFileService';
import { toast } from 'react-toastify';

const CreateModal = ({ isOpen, onConfirm, onCancel, fetchEmployees }) => {
    const [newEmployee, setNewEmployee] = useState({
        maNhanVien: '',
        tenNhanVien: '',
        tenDangNhap: '',
        email: '',
        soDienThoai: '',
        diaChi: '',
        gioiTinh: 0,
        vaiTro: 2,
        avatarUrl: ''
    });
    const [avatar, setAvatar] = useState(null);
    const fileInputRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            const randomString = Math.random().toString(36).substring(2, 10);  
            const randomLogin = `${randomString}`; 
            const randomEmployeeId = `${Date.now().toString(36)}_${randomString}`;
    
            setNewEmployee({
                maNhanVien: randomEmployeeId, 
                tenNhanVien: '',
                tenDangNhap: randomLogin,  
                email: '',
                soDienThoai: '',
                diaChi: '',
                gioiTinh: 0,
                vaiTro: 2,
                avatarUrl: ''
            });
            setAvatar(null); 
        }
    }, [isOpen]);
    

    const handleAvatarUpload = async (file) => {
        if (!file) return;

        try {
            const fileURL = URL.createObjectURL(file);
            setAvatar(fileURL);

            const uploadedImageUrl = await UploadFileService.uploadProductImage(file);
            setNewEmployee(prev => ({ ...prev, avatarUrl: uploadedImageUrl }));
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
            toast.error("Không thể tải ảnh lên!");
        }
    };

    const handleDoubleClick = () => fileInputRef.current.click();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = async () => {
        try {
            await EmployeeService.add(newEmployee);
            toast.success("Thêm mới nhân viên thành công!");
            fetchEmployees();
            onConfirm();
        } catch (error) {
            console.error("Error creating employee:", error);
            toast.error("Thêm mới nhân viên thất bại. Vui lòng thử lại!");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box relative">
                <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onCancel}>✖</button>
                <h3 className="font-bold text-lg text-orange-600 text-center">Thêm mới nhân viên</h3>
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
                        <label className="text-sm font-medium text-gray-600">Mã nhân viên</label>
                        <input type="text" name="maNhanVien" value={newEmployee.maNhanVien} onChange={handleChange} className="input input-bordered w-full" placeholder="Mã nhân viên" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Tên nhân viên</label>
                        <input type="text" name="tenNhanVien" value={newEmployee.tenNhanVien} onChange={handleChange} className="input input-bordered w-full" placeholder="Tên nhân viên" />
                    </div>
                </div>

                <div className="py-3 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
                        <input type="text" name="tenDangNhap" value={newEmployee.tenDangNhap} onChange={handleChange} className="input input-bordered w-full" placeholder="Tên đăng nhập" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                        <input type="text" name="soDienThoai" value={newEmployee.soDienThoai} onChange={handleChange} className="input input-bordered w-full" placeholder="Số điện thoại" />
                    </div>
                </div>

                <div className="py-3 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <input type="email" name="email" value={newEmployee.email} onChange={handleChange} className="input input-bordered w-full" placeholder="Email" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                        <input type="text" name="diaChi" value={newEmployee.diaChi} onChange={handleChange} className="input input-bordered w-full" placeholder="Địa chỉ" />
                    </div>
                </div>

                <div className="py-2 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Vai trò</label>
                        <select name="vaiTro" value={newEmployee.vaiTro} onChange={handleChange} className="select select-bordered w-full">
                            <option value={2}>Nhân viên</option>
                            <option value={1}>Quản trị</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Giới tính</label>
                        <select name="gioiTinh" value={newEmployee.gioiTinh} onChange={handleChange} className="select select-bordered w-full">
                            <option value={0}>Nam</option>
                            <option value={1}>Nữ</option>
                        </select>
                    </div>
                </div>

                <div className="modal-action flex justify-end gap-2">
                    <button className="btn bg-orange-500 hover:bg-orange-600 text-white" onClick={handleCreate}>Xác nhận</button>
                    <button className="btn bg-gray-500 hover:bg-gray-600 text-white" onClick={onCancel}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;
