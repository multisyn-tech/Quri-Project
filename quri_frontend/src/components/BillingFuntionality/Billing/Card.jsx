import React from 'react';
import Groups from '../../../assets/Billing/path2.svg';

const Card = ({ children }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 w-full max-w-md">
      {children}
    </div>
  );


}

export const Card2 = ({ children }) => {
  return (
    <div className="bg-white   relative p-4 max-w-md w-full top-0 left-0 right-0 "
      style={{

      }}>
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img src={Groups} alt="hehe" className="w-full h-full transform scale-125" />
      </div>



      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}




export default Card;
