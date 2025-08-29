import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Otp from './Otp';
const SignUp = ({ onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isSignUpDelay, setIsSignUpDelay] = useState(false);

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

    return (
        <div>
            {!isSignUp ? (
                <div className="fixed inset-x-0 bottom-0 rounded-lg bg-white p-4 shadow-lg z-50">
                    <div className='w-full'>
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-xl font-bold">Sign Up</h1>
                            <button onClick={onClose} className="text-gray-500">
                                <IoMdClose size={24} />
                            </button>
                        </div>
                        <div className='mb-4'>
                            <input
                                type='number'
                                placeholder='Enter your Phone Number'
                                className='w-full p-2 border border-gray-300 rounded'
                            />
                        </div>
                        <div className='flex flex-col w-full mb-2'>
                            <button className={`w-full py-2 bg-orange-500 text-white rounded mt-2 font-bold transition-transform ease-out duration-300 ${isSignUpDelay ? 'transform scale-105 opacity-90' : ''
                                }`}
                                onClick={signUp}>Confirm</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="fixed inset-0 flex items-center justify-center">
                    <Otp onClose={closeSignUp} />
                </div>
            )}
        </div>
    );
}

export default SignUp;
