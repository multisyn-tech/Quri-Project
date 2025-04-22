import React, { useState } from 'react';
import Profile from '../Modal/Profile';
import { useDrawer } from '../../../../state/drawerContext';
import { RiHeartsFill } from "react-icons/ri";
import { PiStarFourFill } from "react-icons/pi";

const SignedInProfile = () => {
  const { isRewardsModalOpen, toggleRewardsModal } = useDrawer();
  const [selectedRating, setSelectedRating] = useState(0);

  const handleStarClick = (index) => {
    // setSelectedRating(index + 1);
  };


  return (
    <Profile  isOpen={isRewardsModalOpen} toggle={toggleRewardsModal} title="">
      <div className="text-center w-full max-w-sm mx-auto">
      <div className="mt-4 flex flex-col items-center justify-center  max-w-sm p-6 bg-gradient-to-b from-[#40008C] to-[#6D00CB] rounded-lg shadow-lg">
    

  

      {/* Loyalty Points Section */}
      <div className="flex items-center justify-center ">
        <div className="p-2 rounded-full">
          < RiHeartsFill size={24} color="#FFF" />
        </div>
        <span className="text-white font-medium text-sm">Follow your loyalty points</span>
      </div>


      {/* Rating Stars */}
          <div className="flex justify-center mt-4 space-x-1">
            {[...Array(5)].map((_, index) => (
              <PiStarFourFill
                key={index}
                size={30}
                className={`cursor-pointer ${
                  selectedRating > index ? "text-yellow-400" : "text-white"
                }`}
                onClick={() => handleStarClick(index)}
              />
            ))}
          </div>

      {/* Points Text */}
      <div className="mt-4 text-center text-white text-sm">
        Get 5 points to unlock 15% off!
      </div>
    </div>

      </div>
    </Profile >
  );
};

export default SignedInProfile;



