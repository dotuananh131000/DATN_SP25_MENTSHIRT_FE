import React, { useState, useRef, useEffect } from 'react';
import EmployeeService from '../services/EmployeeService';
import UploadFileService from '../services/UploadFileService';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

const UpdateModal = ({ isOpen, setUpdateModal, employee, fetchEmployees }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [updatedEmployee, setUpdatedEmployee] = useState(employee || {});
    const [avatar, setAvatar] = useState(employee?.avatarUrl || null);
    const fileInputRef = useRef(null);

    console.log(employee);

    useEffect(() => {
        if (employee) {
            setUpdatedEmployee({
                ...employee,
                vaiTro: employee.vaiTro?.id || 2,
                avatarUrl: employee.avatarUrl || null,  
            });
            setAvatar(employee.avatarUrl || null); 
        }
    }, [employee]);

    const handleAvatarUpload = async (file) => {
        if (!file) return;

        try {
            const fileURL = URL.createObjectURL(file);
            setAvatar(fileURL);

            const uploadedImageUrl = await UploadFileService.uploadProductImage(file);
            setUpdatedEmployee(prev => ({ ...prev, avatarUrl: uploadedImageUrl }));
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
            toast.error("Không thể tải ảnh lên!");
        }
    };

    const handleDoubleClick = () => fileInputRef.current.click();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setUpdatedEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            console.log(updatedEmployee);
            await EmployeeService.update(employee.id, updatedEmployee);
            toast.success("Cập nhật nhân viên thành công!");
            fetchEmployees();
            setUpdateModal(false);
        } catch (error) {
            toast.error("Cập nhật thất bại!");
        }
    };

    const handleResetPassword = async () => {
        try {
            await EmployeeService.resetPassword(employee.id);
            toast.success("Đặt lại mật khẩu thành công!");
            setIsConfirmOpen(false);
        } catch (error) {
            toast.error("Không thể đặt lại mật khẩu!");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box relative">
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={() => setUpdateModal(false)}>✖</button>
                    <h3 className="font-bold text-lg text-orange-600 text-center">Cập nhật nhân viên</h3>
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
                            <input type="text" name="maNhanVien" value={updatedEmployee.maNhanVien || ''} readOnly className="input input-bordered w-full" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Tên nhân viên</label>
                            <input type="text" name="tenNhanVien" value={updatedEmployee.tenNhanVien || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                            <input type="text" name="soDienThoai" value={updatedEmployee.soDienThoai || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <input type="email" name="email" value={updatedEmployee.email || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                    </div>

                    <div className="py-2 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Vai trò</label>
                            <select name="vaiTro"
                                value={updatedEmployee.vaiTro || 2}
                                onChange={(e) => setUpdatedEmployee(prev => ({
                                    ...prev,
                                    vaiTro: parseInt(e.target.value)
                                }))}
                                className="select select-bordered w-full">
                                <option value={2}>Nhân viên</option>
                                <option value={1}>Quản trị</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Giới tính</label>
                            <select name="gioiTinh" value={updatedEmployee.gioiTinh || 0} onChange={handleChange} className="select select-bordered w-full">
                                <option value={0}>Nam</option>
                                <option value={1}>Nữ</option>
                            </select>
                        </div>
                    </div>

                    <div className="py-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                            <input type="text" name="diaChi" value={updatedEmployee.diaChi || ''} onChange={handleChange} className="input input-bordered w-full" />
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
