import React, { useEffect, useState } from "react";
import { TbChevronsDownLeft, TbCreditCard } from "react-icons/tb";
import { IoLogoApple } from "react-icons/io5";
import { useSelector } from 'react-redux';

import { loadStripe } from '@stripe/stripe-js';

import Swal from 'sweetalert2';

import { QURI_SERVICE_FEE } from '../../../config/constants';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NewCardPay = () => {

  const [tip, setTip] = useState(0);

  const orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);

  const calculateSubtotal = () => {
    return orderDetails.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
  };


  
  useEffect(() => {
    const updateTip = () => {
      const updatedTip = JSON.parse(localStorage.getItem('tipAmount')) || 0;
      setTip(updatedTip);
    };

    // Listen to custom event
    window.addEventListener('tipUpdated', updateTip);

    return () => {
      window.removeEventListener('tipUpdated', updateTip);
    };
  }, []);



  const subtotal = calculateSubtotal();
  let total = (parseFloat(subtotal) || 0) + (parseFloat(QURI_SERVICE_FEE) || 0) + (parseFloat(tip) || 0);
  let formattedTotal = total.toFixed(2); 
  

  // store orderdetails to local storage for use in success page
  localStorage.removeItem("billAmount");
  localStorage.setItem("billAmount", JSON.stringify(Number(total).toFixed(2)));




  const handleStripePayment = async () => {

    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

      // data to send at backend
      const body = {
        amount: parseFloat(total.toFixed(2)),
        orderDetails: orderDetails
      }

      // Call stripe api endpoint
      const stripe_response = await fetch(`${BASE_URL}/bill/full-bill-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const session = await stripe_response.json()

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: `Something went wrong`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }

    }
    catch (error) {
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
    <div className="p-4 flex flex-col justify-center w-full pb-5">
      {/* Payment Information */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h1 className="text-xl">You pay</h1>
          <p className="text-xs text-gray-400">Inclusive of all taxes & charges</p>
        </div>
        <div className="flex space-x-1 font-bold space-y-3">
          <p className="text-xl font-medium">AED {total != null ? formattedTotal : '00.0'}</p>
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="flex gap-4">
        {/* Card Button */}

        {/* Stripe payment */}
        <button onClick={handleStripePayment} className="flex items-center justify-center gap-2 border border-gray-300 text-black py-2 px-4 rounded-full w-1/2 hover:bg-gray-100 active:bg-gray-200 active:scale-95 active:shadow-inner transition transform duration-150 ease-in-out">
          <TbCreditCard className="text-2xl" />
          <span className="text-lg ">Card</span>
        </button>

        {/* Apple Pay Button */}
        <button className="flex items-center justify-center space-y-1 gap-2 bg-black text-white py-2 px-4 rounded-full w-1/2 hover:bg-gray-800 active:bg-gray-900 active:scale-95 active:shadow-inner transition transform duration-150 ease-in-out">
          <IoLogoApple className="text-2xl" />
          <span className="text-lg font-bold"> Pay</span>
        </button>


      </div>


    </div>
  );
};

export default NewCardPay;
