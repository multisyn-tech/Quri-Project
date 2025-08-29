import React from 'react';
import Button from '../Buttons/Button.jsx';
import { IoMdClose } from "react-icons/io";
import payment from '../../../assets/Billing/payment.png';
import { useNavigate } from 'react-router-dom';

const Fee = ({ onClose }) => {
  const navigate = useNavigate();

  const quriFee = () => {
    navigate('/quri/split/qurifee');
  }

  return (
    <div className="fixed inset-x-0 bottom-0 rounded-lg bg-white p-4 shadow-lg z-50">
      <div className='w-full'>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Quri Fee?</h1>
          <button onClick={onClose} className="text-gray-500">
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="flex items-center mb-4">
          <img src={payment} alt="payment" className="w-12 h-12 mr-4" />
          <p>We charge AED 0.99 per transaction</p>
        </div>
        {/* <div className='w-full'>
          <Button
            onClick={quriFee}
            gradientFrom="#0F84F6"
            gradientTo="#88F2FF"
            className="w-full"
          >
            <span>Why?</span>
          </Button>
        </div> */}
      </div>
    </div>
  );
}

export default Fee;
