import React from 'react';

const StepProgressBar = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center w-full">
            {/* Line between steps */}
            <div
              className={`flex-auto h-1 mx-2  transition duration-500 ease-in-out ${
                index <= currentStep
                  ? 'bg-gradient-to-r from-[#40008C] from-0% via-[#FF366D] via-30%  to-[#F8E152] to-47%'
                  : 'bg-gray-300'
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgressBar;
