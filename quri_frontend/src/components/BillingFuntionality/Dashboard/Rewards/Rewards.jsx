import React, { useState } from 'react';
import ReusableModal from '../Modal/ReusableModal';
import { useDrawer } from '../../../../state/drawerContext';
import PhoneNumberInput from '../Modal/PhoneNumberInput';
import OTPScreen from './OTPScreen';
import { FaCheck } from "react-icons/fa6";

const Rewards = () => {
  const { isRewardsModalOpen, toggleRewardsModal } = useDrawer();
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [showOTPScreen, setShowOTPScreen] = useState(false);

  const handleNext = () => {
    setShowOTPScreen(true); // Switch to OTP screen inside same modal
  };

  return (

    <ReusableModal isOpen={isRewardsModalOpen} toggle={toggleRewardsModal} title="">
      <div className="text-center">
        {!showOTPScreen ? (
          <form className="w-full max-w-full mx-auto ">
            <div className="mt-5 ">
              <PhoneNumberInput />
            </div>

            {/* First Checkbox */}
            <div className="flex items-center space-x-3 mb-3 cursor-pointer" onClick={() => setIsChecked1(!isChecked1)}>
              <div
                className={`w-4 h-4 flex items-center justify-center rounded-[4px] border-1 ${isChecked1 ? "bg-[#000000] border-[#000000]" : "border-[#000000]"
                  }`}
              >
                {isChecked1 && <FaCheck size={12} color="white" strokeWidth={3} />}
              </div>
              <label className="text-[#000000] text-[12px] font-normal">
                I agree to the terms and privacy policy.
              </label>
            </div>

            {/* Second Checkbox */}
            <div className="flex items-center space-x-3 mb-4 cursor-pointer" onClick={() => setIsChecked2(!isChecked2)}>
              <div
                className={`w-4 h-4 flex items-center justify-center rounded-[4px] border-1 ${isChecked2 ? "bg-black border-black" : "border-[#000000]"
                  }`}
              >
                {isChecked2 && <FaCheck size={12} color="white" strokeWidth={3} />}
              </div>
              <label className="text-[#000000] text-[12px] font-normal">
                I agree to receive discounts & offers.
              </label>
            </div>

            <button
              type="button"
              className="w-64 bg-black text-white py-3 px-4 rounded-full font-semibold hover:bg-gray-800 transition duration-300"
              onClick={handleNext}
            >
              Next
            </button>
          </form>
        ) : (
          <OTPScreen /> // Show OTP screen if state is true
        )}
      </div>
    </ReusableModal>

  );
};

export default Rewards;
