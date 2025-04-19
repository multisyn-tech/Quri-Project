import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, NumberKeyboard } from 'antd-mobile';
import { IoMdClose } from 'react-icons/io';
import { QURI_SERVICE_FEE } from '../../../../config/constants';
import {loadStripe} from '@stripe/stripe-js';

import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CustomAmount = ({ onClose }) => {

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [value, setValue] = useState(''); // amount that user enters

    const orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);
    const calculateSubtotal = () => {
        return orderDetails.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
    };
    const subtotal = calculateSubtotal();
    const total = subtotal + QURI_SERVICE_FEE;

    // Handle input focus to show number keyboard
    const handleInputFocus = () => {
        setKeyboardVisible(true);
    };

    // Handle number keyboard input
    const onKeyboardInput = (key) => {
        if (key === 'delete') {
            // Handle delete key press, removing the last character
            setValue((prevValue) => prevValue.slice(0, -1));
        } else if (key === 'confirm') {
            // Handle confirm action
            console.log("Amount confirmed: ", value);
            setKeyboardVisible(false); // Close the keyboard on confirm
        } else {
            // Append the key to the current value
            setValue((prevValue) => prevValue + key);
        }
    };


    // Function to clear the input value
    const handleClear = () => {
        setValue((prevValue) => prevValue.slice(0, -1)); // Remove the last character
    };

    const user_amount = Math.round(parseFloat(value));

    const payCustomAmount = async () => {
        handleStripePayment()
    }

    localStorage.removeItem("billAmount");
    localStorage.setItem("billAmount", JSON.stringify(Number(user_amount).toFixed(2)));
  
  
    const handleStripePayment = async () => {

        try {
            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

            // data to send at backend
            const body = {
                amount: user_amount,
                orderDetails: orderDetails
            }

            // Call stripe api endpoint
            const stripe_response = await fetch(`${BASE_URL}/bill/custom-bill-amount-checkout`, {
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
        <div className="fixed inset-x-0 bottom-0 mx-auto rounded-t-2xl bg-white shadow-lg z-50 w-full h-3/5 max-h-screen overflow-hidden flex flex-col justify-between">

            <div className="w-full flex-1 py-3">
                <div className="flex justify-between items-center mb-2 p-2">
                    <h1 className="text-xl">Custom amount</h1>
                    <button onClick={onClose} className="mr-1">
                        <IoMdClose size={30} />
                    </button>
                </div>

                <div className="flex w-full">
                    <div className="flex flex-col p-2 justify-between items-center py-4 w-full">
                        <div className="mb-2 w-full">
                            <Input
                                placeholder="Enter an amount"
                                value={value} // Controlled value
                                onFocus={handleInputFocus} // Show keyboard on focus
                                className="w-full p-2 border rounded-md border-[#999999] h-14"
                            />
                        </div>

                        {/* Total Amount */}
                        <div className="mb-4">
                            <p className=" my-2 text-sm text-[#00000080] font-normal">Total amount to pay: {total} AED</p>
                        </div>


                        {/* Confirm Button */}
                        <button
                            className={`py-4 w-full rounded-full ${value ? 'bg-black text-white' : 'bg-[#A8A8A8] text-white'}`}
                            onClick={payCustomAmount} // Example action for Confirm button
                            disabled={!value} // Disable if value is empty
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>

            {/* Number Keyboard - always below the Confirm button */}
            {keyboardVisible && (
                <div className="w-full">
                    <NumberKeyboard
                        visible={keyboardVisible}
                        onInput={onKeyboardInput}
                        onClose={() => setKeyboardVisible(false)} // Hide keyboard when closed
                        showCloseButton={false}
                        safeArea
                        onDelete={handleClear}

                    />
                </div>
            )}
        </div>
    );
};

export default CustomAmount;
