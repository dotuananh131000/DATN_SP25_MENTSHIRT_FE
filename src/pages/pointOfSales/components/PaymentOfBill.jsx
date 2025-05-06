import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import UseFormatMoney from "@/lib/useFormatMoney";
import { AiFillCreditCard } from "react-icons/ai";
import { BiPurchaseTagAlt } from "react-icons/bi";
import ContactAddress from "./ContactAddress";
import { useState } from "react";
function PayMentOfBill () {
    const [isShipping, setShipping] = useState(false);

    return <>
        <div className="bg-white shadow rounded-lg p-2 mb-4">
            <h1 className="text-lg font-bold mb-2">Thông tin thanh toán</h1>
            <div className="grid grid-cols-5">
                {/* thẻ div chứa thông tin địa chỉ */}
                <div className="col-span-3">
                    {isShipping && (
                        <ContactAddress />
                    )}
                </div>

                {/* thẻ div chứa thông tin thanh toán */}
                <div className="col-span-2">

                    {/* Thẻ chứa phiếu giảm giá */}
                    <div className="relative bg-white flex justify-between items-center p-2 border-2 border-gray-400 rounded-lg mb-2">
                        <Dialog>
                            <DialogTrigger>
                                <button className="bg-orange-500 px-3 py-2 text-white rounded-lg active:scale-95 duration-200">
                                    Khác
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-lg">
                                        Phiếu giảm giá
                                    </DialogTitle>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <div className="flex absolute -top-3 left-10 transform -translate-x-1/2 bg-white px-2 text-sm font-bold">
                            <span className="text-sm text-orange-500 ">
                                <BiPurchaseTagAlt />
                            </span>
                            <h1 className="text-xs">Mã giảm giá :</h1>
                        </div>    
                        <p className="px-4 py-2 rounded-lg bg-gray-600 text-center text-white w-2/4 "></p>
                        <p className="text-sm text-red-500">Phiếu giảm tốt nhất</p>
                    </div>

                    {/* Thẻ chứa số tiền thanh toán */}
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-2">
                            <h2>Tiền hàng:</h2>
                            <h2 className="text-orange-500">{UseFormatMoney(0)}</h2>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                            <h2>Giảm giá:</h2>
                            <h2 className="text-orange-500">{UseFormatMoney(0)}</h2>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <h2>Giao hàng:</h2>
                            <Switch 
                            checked={isShipping}
                            onCheckedChange={() => setShipping(!isShipping)}
                            className="data-[state=checked]:bg-orange-500" />
                        </div>

                        <div className="flex justify-between items-center mb-2">
                           <div className="flex space-x-4 items-center">
                            <h2>Phí ship:</h2>
                                <img 
                                className="object-cover w-6 h-6 rounded-lg"
                                src="/public/imagesGHN.jpg" alt="" />
                           </div>
                            <input type="text"
                            className="px-2 w-1/3 text-right text-orange-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                            value={UseFormatMoney(0)}
                            />
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <h2>Khách phải thanh toán:</h2>
                            <h2 className="text-orange-500">{UseFormatMoney(0)}</h2>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-4">
                                <h2>Đã thanh toán:</h2>
                                <Dialog>
                                    <DialogTrigger>
                                        <button className="text-orange-500"><AiFillCreditCard /></button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle className="text-md">
                                            Thanh toán
                                        </DialogTitle>
                                        <div>

                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <h2 className="text-orange-500">{UseFormatMoney(0)}</h2>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <h2>Tiền thiếu:</h2>
                            <h2 className="text-orange-500">{UseFormatMoney(0)}</h2>
                        </div>
                        
                        <div className="flex justify-between">
                            <button className="px-3 py-2 bg-orange-500 text-white rounded-lg active:scale-95 duration-200">
                                Hoàn tất hóa đơn
                            </button>
                            <div className="flex items-center space-x-2">
                                <label htmlFor="print">In hóa đơn</label>
                                <Switch id="print"
                                 className="data-[state=checked]:bg-orange-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default PayMentOfBill;