import { FaCartPlus } from "react-icons/fa";
function CartOfBill () {
    return <>
        <div className="bg-white rounded-lg shadow p-2 mb-4">
            <h1 className="text-lg font-bold mb-2">Giỏ hàng</h1>
            <div className="bg-gray-200 h-64 flex justify-center items-center rounded-lg ">
                <FaCartPlus className="text-9xl" />
            </div>
        </div>
    </>
}
export default CartOfBill;