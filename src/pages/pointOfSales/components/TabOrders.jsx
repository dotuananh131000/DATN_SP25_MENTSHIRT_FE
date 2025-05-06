import { useEffect, useState } from "react";

function TabOrder({ waitOrder, fetchOrder }){


    // Hóa đơn được chọn
    const [selectedBill, setSelectedBill] = useState(0);

    const onClickBill = (bill, i) => {
        setSelectedBill(i);
        fetchOrder(bill.id);
    }
    
    const addNewBill = () => {
        const newId = bills.length > 0 ? bills[bills.length - 1].id + 1 : 1;
        setBills([...bills, { id: newId }]);
    };
    return <>
        <div className="bg-white shadow rounded-lg p-2 mb-4 ">
            <div className="flex space-x-3">
                {waitOrder.map((item, i) => (
                    <div key={item.id} className="relative">
                        <button
                        onClick={() => onClickBill(item, i)}
                        className={`${selectedBill === i?"bg-orange-500 scale-105": "bg-gray-400"} 
                        px-3 py-2 text-white rounded-lg hover:bg-orange-500 hover:scale-105 duration-300`}>
                            Hóa Đơn {i + 1}
                        </button>
                        <span 
                        className="absolute -right-1 -top-1 flex justify-center items-center 
                        bg-red-500 text-xs text-white w-5 h-5 rounded-full">
                            {item.soLuong || 0}
                        </span>
                    </div>
                ))}
                <button 
                className="bg-gray-500 text-white px-3 rounded-lg active:scale-95 duration-200"
                onClick={addNewBill}
                >+</button>
            </div>
            
        </div>
    </>
}
export default TabOrder;