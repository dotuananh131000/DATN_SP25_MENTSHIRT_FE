export default function ConfirmModal({ hideConfirm, idHDCT, fetchDelete }) {
  const handleDeleteHDCT = () => {
    fetchDelete(idHDCT);
    hideConfirm(false);
  };
  return (
    <div className="modal modal-open flex items-center justify-center">
      <div className="modal-box max-w-sm p-4">
        <h3 className="font-bold text-lg text-center">Xác nhận</h3>
        <p className="py-3 text-center">
          Bạn có chắc loại bỏ sản phẩm {idHDCT}
        </p>
        <div className="modal-action flex justify-center gap-3">
          <button
            onClick={() => handleDeleteHDCT()}
            className="btn btn-primary px-4"
          >
            Xác nhận
          </button>
          <button onClick={() => hideConfirm(false)} className="btn px-4">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
