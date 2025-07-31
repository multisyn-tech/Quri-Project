import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import SignUp from '../SignUp/SignUp';
import CardPayment from '../CardPay/CardPayment';


const BillProceeding = ({ onClose, total }) => {
    const [isCheckout, setIsCheckout] = useState(false);
    const [isCheckoutDelay, setIsCheckoutDelay] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isSignUpDelay, setIsSignUpDelay ] = useState(false);

    const checkOut = () => {
        setIsCheckoutDelay(true);
        setTimeout(() => {
            setIsCheckoutDelay(false);
            setIsCheckout(true);
        }, 300);
    }

    const signUp = () => {
        setIsSignUpDelay(true);
        setTimeout(() => {
            setIsSignUpDelay(false);
            setIsSignUp(true);
        }, 300);

    }

    const closeSignUp = () => {
        setIsSignUp(false);
    }

    const closeCheckout=()=>{
        setIsCheckout(false);
    }
    return (
        <div>
            {!isSignUp && !isCheckout ? (
                <div className="fixed inset-x-0 bottom-0 rounded-lg bg-white p-4 shadow-lg z-50">
                    <div className='w-full'>
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-xl font-bold">Pay Bill of <span>{`AED ${total.toFixed(2)}`}</span></h1>
                            <button onClick={onClose} className="text-gray-500">
                                <IoMdClose size={24} />
                            </button>
                        </div>
                        <div className='flex flex-col w-full mb-2'>
                            <button className={`w-full py-2 bg-white text-black rounded mt-2 font-bold border border-gray-300 transition-transform ease-out duration-300 ${isCheckoutDelay ? 'transform scale-105 opacity-90' : ''
                                }`}
                                onClick={checkOut}>Guest Checkout</button>
                            <button className={`w-full py-2 bg-orange-500 text-white rounded mt-2 font-bold transition-transform ease-out duration-300 ${isSignUpDelay ? 'transform scale-105 opacity-90' : ''}`}
                                onClick={signUp}>Sign Up</button>
                        </div>
                        <div>
                            <p className='text-xs text-center'>If you sign up you will be able to get discount on your future transactions</p>
                        </div>
                    </div>
                </div>
            ) : isSignUp ? (
                <div className="fixed inset-0 flex items-center justify-center">
                    <SignUp onClose={closeSignUp} />
                </div>
            ) : (
                <div className="fixed inset-0 flex items-center justify-center">
                    <CardPayment onClose={closeCheckout} />
                </div>
            )}
        </div>
        
    );
}

export default BillProceeding;
