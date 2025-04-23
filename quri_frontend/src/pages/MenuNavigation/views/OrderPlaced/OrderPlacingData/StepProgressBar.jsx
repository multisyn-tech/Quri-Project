import React,{useState} from 'react';

// const StepProgressBar = ({ currentStep, steps }) => {
//   return (
//     <div className="w-full max-w-3xl mx-auto mt-4">
//       <div className="flex items-center justify-between">
//         {steps.map((step, index) => (
//           <div key={index} className="flex items-center w-full">
//             {/* Line between steps */}
//             <div
//               className={`flex-auto h-1 mx-2  transition duration-500 ease-in-out ${
//                 index <= currentStep
//                   ? 'bg-gradient-to-r from-[#40008C] from-0% via-[#FF366D] via-30%  to-[#F8E152] to-47%'
//                   : 'bg-gray-300'
//               }`}
//             ></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };



const StepProgressBar = ({ currentStep, steps, delay }) => {
  const animationDuration = delay || 300000; // 5 minutes

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          let width = '0%';
          let animation = 'none';

          if (isCompleted) {
            width = '100%';
          } else if (isActive) {
            animation = `fillStep ${animationDuration / 1000}s linear forwards`;
          }

          const flexGrow = index === 0 ? 4 : 2; // First line longer

          return (
            <div key={index} className="flex-grow" style={{ flex: flexGrow }}>
              <div className="relative h-1 bg-gray-300 rounded overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#40008C] via-[#FF366D] to-[#F8E152]"
                  style={{
                    width,
                    animation,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <style>
        {`
          @keyframes fillStep {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};





export default StepProgressBar;
