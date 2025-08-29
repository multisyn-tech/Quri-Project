import React, { useState } from 'react';
import ReusableModal from '../Modal/ReusableModal';
import { useDrawer } from '../../../../state/drawerContext';
import OTPScreen from './OTPScreen';
import SignedInProfile from './SignedInProfile';

const AddName = () => {
    const { isRewardsModalOpen, toggleRewardsModal } = useDrawer();
    const [currentScreen, setCurrentScreen] = useState('addName'); // Control which screen to display

    // Handle back navigation to OTPScreen
    const handleBack = () => {
        setCurrentScreen('otp'); // Navigate to OTPScreen
    };

    // Handle next navigation to SignedInProfile
    const handleNext = () => {
        setCurrentScreen('signedInProfile'); // Navigate to SignedInProfile
    };

    return (
        <ReusableModal isOpen={isRewardsModalOpen} toggle={toggleRewardsModal} title="">
            <div className="text-center w-full max-w-sm mx-auto">
                {/* Conditionally render based on current screen */}
                {currentScreen === 'addName' ? (
                    <>
                        <h2 className='mt-4 font-bold text-lg mb-3'>What should we call you?</h2>

                        <form className="flex flex-col items-center">

                            <div className=" w-full max-w-xs mb-12 rounded-lg"
                                style={{ border: '1px solid black' }} >
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full border border-black rounded-lg py-2 px-2  text-gray-900 focus:outline-none focus:border-black"
                                />
                            </div>

                            <div className='flex flex-col items-center justify-center space-y-5'>
                                {/* Submit Button to move to SignedInProfile */}
                                <button
                                    type="button"
                                    className="w-64 bg-black  text-white py-3 px-4 rounded-full font-semibold hover:bg-gray-900 transition duration-300"
                                    onClick={handleNext} // Move to SignedInProfile
                                >
                                    Next
                                </button>

                                {/* Back Button to OTPScreen */}
                                <button
                                    type="button"
                                    className="w-64 bg-red-300 text-black py-3 px-4 rounded-full font-semibold hover:bg-red-400 transition duration-300"
                                    onClick={handleBack} // Move back to OTPScreen
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    </>
                ) : currentScreen === 'otp' ? (
                    <OTPScreen /> // Show OTPScreen if 'Back' is clicked
                ) : (
                    <SignedInProfile /> // Show SignedInProfile if 'Next' is clicked
                )}
            </div>
        </ReusableModal>
    );
};

export default AddName;
