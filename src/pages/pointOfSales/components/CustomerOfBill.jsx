import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
function CustomerOfBill () {
    return <div className="bg-white rounded-lg shadow p-2 mb-4">
        <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-bold">Thông tin khách hàng</h1>
            <div>
                <Dialog>
                    <DialogTrigger>
                        <button className="px-3 py-2 bg-orange-500 text-white rounded-lg">
                            Chọn khách hàng
                        </button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-5xl max-h-[700px] overflow-y-auto">
                        <DialogTitle className="text-lg">
                            Danh sách khách hàng
                        </DialogTitle>
                        <div>
                            Đây là danh sách kg=hách hàng
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        <div className="bg-gray-200 p-2 rounded-lg">
            <h2>Tên khách hàng:</h2>
            <h2>Số điện thoai:</h2>
            <h2>Email:</h2>
        </div>
    </div>
}
export default CustomerOfBill;