import React, { useState } from 'react';
import ReusableModal from '../Modal/ReusableModal';
import { useDrawer } from '../../../../state/drawerContext';
import Rewards from './Rewards';
import AddName from './AddName';

const OTPScreen = () => {
    const { isRewardsModalOpen, toggleRewardsModal } = useDrawer();
    const [otp, setOtp] = useState(['', '', '', '']); // State for the OTP inputs
    const [currentScreen, setCurrentScreen] = useState('otp'); // Control which screen to display

    // Function to handle input change
    const handleChange = (e, index) => {
        const value = e.target.value;

        // Allow only numeric input
        if (!isNaN(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Focus next input field
            if (value !== '' && index < 3) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };

    // Function to handle key down events for backspace functionality
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '') {
            // If backspace is pressed and current input is empty, move focus to the previous input
            if (index > 0) {
                document.getElementById(`otp-input-${index - 1}`).focus();
            }
        }
    };

    const handleNext = () => {
        setCurrentScreen('addName'); // Navigate to AddName screen
    };

    const handleBack = () => {
        setCurrentScreen('rewards'); // Navigate back to Rewards screen
    };

    return (
        <ReusableModal isOpen={isRewardsModalOpen} toggle={toggleRewardsModal} title="">
            <div className="text-center w-full max-w-sm mx-auto">
                {/* Conditionally render based on current screen */}
                {currentScreen === 'otp' ? (
                    <>
                        <h2 className='mt-5 font-bold text-lg mb-3'>Enter your OTP code</h2>

                        {/* OTP Input Fields */}
                        <div className="flex justify-center space-x-2 mb-4 ">
                            {otp.map((digit, index) => (
                                <div className='rounded-lg' style={{ border: '1px solid black' }} key={index}>
                                    <input
                                        id={`otp-input-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)} // Add key down event handler
                                        className="w-12 h-12 border border-gray-300 rounded-lg text-center text-2xl focus:outline-none focus:border-black"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className='flex flex-col items-center justify-center space-y-5'>
                            {/* Submit Button */}
                            <button
                                type="button"
                                className="w-64 bg-black  text-white py-3 px-4 rounded-full font-semibold hover:bg-gray-900 transition duration-300"
                                onClick={handleNext} // Move to AddName
                            >
                                Next
                            </button>

                            {/* Back Button to Rewards Screen */}
                            <button
                                type="button"
                                className="w-64 bg-red-300 text-black py-3 px-4 rounded-full font-semibold hover:bg-red-400 transition duration-300"
                                onClick={handleBack} // Move back to Rewards
                            >
                                Back
                            </button>
                        </div>
                    </>
                ) : currentScreen === 'rewards' ? (
                    <Rewards /> // Show Rewards screen if 'Back' is clicked
                ) : (
                    <AddName /> // Show AddName screen if 'Next' is clicked
                )}
            </div>
        </ReusableModal>
    );
};

export default OTPScreen;
