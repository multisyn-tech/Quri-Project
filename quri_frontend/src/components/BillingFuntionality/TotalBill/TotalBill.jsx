import React, { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TotalAmount from './TotalAmount';
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Card2 } from '../Billing/Card';
import questionMark from '../../../assets/Billing/Vector.png';
import NewCardPay from './NewCardPay';
import { QURI_SERVICE_FEE } from '../../../config/constants';

import QuriFee from '../Billing/QuriFee';


const TotalBill = () => {

    const orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);


    // console.log("order details: ",orderDetails)

    const [isQuriFeeVisible, setIsQuriFeeVisible] = useState(false);

    const navigate = useNavigate();

    const goBack = () => {
        navigate('/quri/home/bill');
    }

    const calculateSubtotal = () => {
        return orderDetails.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
    };

    const subtotal = calculateSubtotal();

    const total = subtotal + QURI_SERVICE_FEE;

    const quriServiceFee = () => {
        setIsQuriFeeVisible(true);
    };

    const closeQuriFee = () => {
        setIsQuriFeeVisible(false);
    };
    return (
        <>
            <header className="p-4 mt-2 mb-3">
                <section className="flex flex-row items-center justify-between mb-4 w-full">
                    <button className="flex-shrink-0 p-2 rounded-full transition-transform transform hover:scale-110 active:scale-90 focus:outline-none  "
                        onClick={goBack}>
                        <MdOutlineKeyboardArrowLeft size={35} />
                    </button>

                    <p className="text-center flex-grow text-xl">Pay Now</p>

                    <button className="flex-shrink-0 p-2 rounded-full transition-transform transform hover:scale-110 active:scale-90 focus:outline-none ">
                        <IoPersonOutline size={24} />
                    </button>
                </section>
                <Card2>
                    <ul className="space-y-2">
                        <li className="flex justify-between font-bold">
                            <span className='text-gray-400'>Subtotal</span><span>AED {subtotal.toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between font-bold">
                            <span className='text-gray-400 flex items-center'>
                                Quri Service Fee
                                <button onClick={quriServiceFee} className='ml-2'>
                                    <img src={questionMark} alt="question Mark" className='w-3 h-3' />
                                </button>
                            </span>
                            <span>AED {QURI_SERVICE_FEE}</span>
                        </li>
                        <li className="flex justify-between font-medium">
                            <span className='text-[#000000] text-lg'>Total</span>
                            <span className='text-[#40008C] text-lg'>AED {total.toFixed(2)}</span>
                        </li>
                    </ul>
                </Card2>
            </header>
            <div className='bg-[#F5F5F5] py-1'></div>
            {/* This shows the total amount */}
            <header>
                <TotalAmount />
            </header>

            <div className='bg-[#F5F5F5] py-1'></div>
            {/* This shows the card payment */}
            <header className='mt-4 flex items-center justify-center'>
                <NewCardPay />
            </header>


            {isQuriFeeVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div>
                        <QuriFee onClose={closeQuriFee} />
                    </div>
                </div>
            )}


        </>
    )
}

export default TotalBill;