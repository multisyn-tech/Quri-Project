import React, { useState } from "react";
import { GoChevronDown } from "react-icons/go";

const PhoneNumberInput = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="relative flex items-center py-1 px-2 rounded-[5px] border-[#999999] bg-white border-1 w-full my-3">
      {/* Left Side: Flag & Dropdown Icon */}
      <div className="flex items-center space-x-1">
        <img
          src="https://flagcdn.com/w40/ae.png"
          alt="UAE Flag"
          className="w-6 h-6 rounded-full"
        />
        <GoChevronDown color="#000000" size={18} />
      </div>

      {/* Vertical Line Separator */}
      <div className="h-6 w-[1.2px] bg-[#999999] mx-2"></div>

      {/* Right Side: Phone Number Text & Input */}
      <div className="flex flex-col gap-0">
        <span className="text-[10px] font-normal text-[#454545] self-start -mb-1">Phone number</span>

        {/* Country Code & Input in the Same Row */}
        <div className="flex items-center space-x-2">
          <span className="text-[#ABABAB] text-[13px] font-normal">+971</span>

          {/* Input Field */}
          <input
            type="tel"
            value={phoneNumber}
            inputMode="numeric"
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full outline-none text-lg text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </div>

    </div>
  );
};

export default PhoneNumberInput;
