import React, { useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import People from './SplitBillData/People';
import CustomAmount from './SplitBillData/CustomAmount';

const BillDivider = ({ onClose }) => {
    const [isCheck, setIsCheck] = useState(false);
    const [isPeople, setIsPeople] = useState(false);
    const [isCustomAmount, setIsCustomAmount] = useState(false);

    // Handler for "Pay custom amount" button
    const handleCustomAmountSelect = () => {
        setIsCheck(true);
        setTimeout(() => {
            setIsCheck(false);
            setIsCustomAmount(true); // Show CustomAmount modal
        }, 200);
    };

    // Handler for "Divide bill equally" button
    const handleDivideEquallySelect = () => {
        setIsCheck(true);
        setTimeout(() => {
            setIsCheck(false);
            setIsPeople(true); // Show People modal or other functionality
        }, 200);
    };

    // Handler for "Pay for your items" button
    const handlePayForItemsSelect = () => {
        setIsCheck(true);
        setTimeout(() => {
            setIsCheck(false);
            // Handle the action for paying for your items here
            alert("Paying for your items...");
        }, 200);
    };


    const closeCheck = () => {
        setIsPeople(false);
        setIsCustomAmount(false); // Close CustomAmount modal when clicked
    };


    return (
        <div>
            {!isPeople && !isCustomAmount ? (
                <div className="w-full">
                    <div className="flex justify-between items-center p-2 mt-2">
                        <h1 className="text-xl font-medium">Split the bill</h1>
                        <button onClick={onClose} className="mr-1">
                            <IoCloseOutline size={30} />
                        </button>
                    </div>
                    <div >
                        <p className="text-sm px-2 text-gray-500">Split the bill to pay just your portion</p>
                    </div>
                    <div className="w-full overflow-hidden"> {/* Removed space-y and added borders */}
                        <div className="flex p-2  justify-between items-center border-b-4 border-[#F5F5F5] py-4 w-full">
                            <p className="text-lg font-normal">Pay custom amount</p>
                            <button
                                className={`py-2 px-10 bg-black text-white rounded-full transition-transform ease-out duration-300 ${isCheck ? 'transform scale-105 opacity-90' : ''}`}
                                onClick={handleCustomAmountSelect}
                            >
                                Select
                            </button>
                        </div>

                        <div className="flex  p-2 justify-between items-center border-b-4 border-[#F5F5F5] py-4">
                            <p className="text-lg font-normal">Divide bill equally</p>
                            <button
                                className={`py-2 px-10 bg-black text-white rounded-full transition-transform ease-out duration-300 ${isCheck ? 'transform scale-105 opacity-90' : ''}`}
                                onClick={handleDivideEquallySelect}
                            >
                                Select
                            </button>
                        </div>

                        <div className="flex   p-2 justify-between items-center py-4">
                            <p className="text-lg font-normal">Pay for your items</p>
                            <button
                                className={`py-2 px-10 bg-black text-white rounded-full transition-transform ease-out duration-300 ${isCheck ? 'transform scale-105 opacity-90' : ''}`}
                                onClick={handlePayForItemsSelect}

                            >
                                Select
                            </button>
                        </div>
                    </div>



                </div>
            ) : isCustomAmount ? (
                <CustomAmount onClose={closeCheck} /> // Show CustomAmount modal
            ) : (
                <People onClose={closeCheck} /> // Show People modal
            )}
        </div>
    );
};

export default BillDivider;
