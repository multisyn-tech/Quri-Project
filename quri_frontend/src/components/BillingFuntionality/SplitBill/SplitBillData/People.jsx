import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IoMdClose } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { AiOutlinePieChart } from "react-icons/ai";
import AmountLoader from './AmountLoader';

import {loadStripe} from '@stripe/stripe-js';

import ShareLinksModal from './ShareLinksModal';
import Swal from 'sweetalert2';

import { QURI_SERVICE_FEE } from '../../../../config/constants';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const People = ({ onClose }) => {

    const [showModal, setShowModal] = useState(false);
    const [sessions, setSessions] = useState([]);

    const [tablemates, setTablemates] = useState(4); 
    const [partsToPay, setPartsToPay] = useState(3); 

    const orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);
        
    const calculateSubtotal = () => {
        return orderDetails.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
    };
    
    const subtotal = calculateSubtotal();
    const total = subtotal + QURI_SERVICE_FEE;



    // Calculate how much the person is paying based on the parts they are paying for
    const amountPerPerson = total / tablemates;
    const currentAmount = amountPerPerson * partsToPay;

    // console.log(currentAmount);

    // Increment/Decrement handlers
    const handleTablematesIncrement = () => setTablemates(tablemates + 1);
    const handleTablematesDecrement = () => {
        if (tablemates > 1) setTablemates(tablemates - 1);
    };

    const handlePartsIncrement = () => setPartsToPay(partsToPay + 1);

    const handlePartsDecrement = () => {
        if (partsToPay > 1) setPartsToPay(partsToPay - 1);
    };

    // store orderdetails to local storage for use in success page
    localStorage.removeItem("billAmount");
    localStorage.setItem("billAmount", JSON.stringify(Number(currentAmount).toFixed(2)));


    const splitBillCheckout = async () =>{
        handleStripePayment()
    }

    const handleStripePayment = async () => {
    
        try {
          const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    
          // data to send at backend in case of aplit bill
          const body={
            amount:parseFloat(currentAmount.toFixed(2)),
            noOfPerson:tablemates,
            orderDetails:orderDetails,
          }
      
          // Call stripe api endpoint at backend
          const stripe_response = await fetch(`${BASE_URL}/bill/split-bill-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
    
          const data  = await stripe_response.json();

          if (data.sessions) {
            setSessions(data.sessions);
            setShowModal(true); 
          }
   
      }
      catch(error)
      {
          console.error("Stripe Payment Error:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Payment process failed',
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
      }
    
    };



    return (
        <div className="fixed inset-x-0 bottom-0 max-h-screen overflow-hidden rounded-xl bg-white p-4 shadow-lg z-50">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-normal">Equal amount</h1>
                <button onClick={onClose}>
                    <IoMdClose size={24} className='' />
                </button>
            </div>
            <div className='mb-4'>
                <AmountLoader
                    totalAmount={total} // The total bill remains constant
                    currentAmount={currentAmount} // The current amount the user is paying
                    tablemates={tablemates}
                    partsToPay={partsToPay}
                />
            </div>


            {/* Total Divide Section */}
            <div>
                {/* Tablemates */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <GoPeople className="text-2xl mr-2" />
                        <span className="text-lg">Tablemates</span>
                    </div>
                    <div className="flex items-center">
                        <button onClick={handleTablematesDecrement} className="bg-gray-800 text-white p-2 rounded-full">
                            <FaMinus />
                        </button>
                        <span className="mx-4 text-lg">{tablemates}</span>
                        <button onClick={handleTablematesIncrement} className="bg-gray-800 text-white p-2 rounded-full">
                            <FaPlus />
                        </button>
                    </div>
                </div>
                {/* Parts to Pay */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center ">
                        <AiOutlinePieChart className="text-2xl mr-2" />
                        <span className="text-lg">Parts to pay</span>
                    </div>
                    <div className="flex items-center">
                        <button onClick={handlePartsDecrement} className="bg-gray-800 text-white  p-2 rounded-full">
                            <FaMinus />
                        </button>
                        <span className="mx-4 text-lg">{partsToPay}</span>
                        <button onClick={handlePartsIncrement} className="bg-gray-800 text-white  p-2 rounded-full">
                            <FaPlus />
                        </button>
                    </div>
                </div>
            </div>
            <div className='mb-2 border-dashed border-t-2 bg-gray-50 border-whitew-full'></div>
            {/* Final Payment */}
            <div>

                <div className='flex items-center justify-between mb-4 text-xl'>
                    <h4>You're paying</h4>
                    <p className='font-bold'>{currentAmount.toFixed(2)} <span className='text-xs'>AED</span></p>
                </div>

                <div className='flex items-center justify-center'>
                    {/* Confirm Button */}
                    <button onClick={splitBillCheckout} className={`py-4 w-full rounded-full bg-black text-white`} >
                        Confirm
                    </button>


                    <ShareLinksModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        sessions={sessions}
                    />

                </div>

            </div>

        </div>
    );
};

export default People;
