import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProductModal (){
    return <div className="mt-4">
        <div className="relative">
            <Dialog>
                <DialogTrigger asChild>
                    <button
                    className="absolute right-3 bg-orange-500 text-white rounded-lg px-2 py-2 active:scale-95 duration-200"
                    >Thêm sản phẩm</button>
                </DialogTrigger>
                <DialogContent 
                className="fixed left-1/2 -translate-x-1/2 w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg overflow-auto-y">
                    <DialogHeader>
                        <DialogTitle>Thêm sản phẩm</DialogTitle>
                    </DialogHeader>
                    <div>
                        <table className="table table-auto w-full bg-white rounded-lg shadow text-center text-xs mt-2">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">STT</th>
                                    <th className="border p-2">Ảnh</th>
                                    <th className="border p-2">Tên</th>
                                    <th className="border p-2">Màu sắc</th>
                                    <th className="border p-2">Kích thước</th>
                                    <th className="border p-2">Chất liệu</th>
                                    <th className="border p-2">Số lượng</th>
                                    <th className="border p-2">Giá</th>
                                    <th className="border p-2">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
}