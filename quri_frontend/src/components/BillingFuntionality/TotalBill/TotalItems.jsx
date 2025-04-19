import React from 'react';
import questionMark from '../../../assets/Billing/Vector.png';
import Card from '../Billing/Card';

const TotalItems = ({ orderDetails, subtotal, VAT, QURI_SERVICE_FEE, onShowQuriFee }) => {
  return (
    <div className="relative">
      <Card>
        <ul className="space-y-2">
          {orderDetails && orderDetails.map((item, index) => (
            <li key={index} className='flex justify-between items-center border-t p-2 border-dashed'>
              <div className='space-x-5'>
                <span className="text-black-500">{`${item.Quantity}`}x</span>
                <span>{item.ItemName}</span><br />
              </div>
              <div className="flex flex-row justify-between">
                <span>{`AED ${(parseFloat(item.Price) * item.Quantity).toFixed(2)}`}</span>
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col space-y-2 mt-4 p-4">
          <li className="flex justify-between"><span className='text-black-500'>Amount</span><span>{`AED ${subtotal.toFixed(2)}`}</span></li>
          <li className="flex justify-between"><span className='text-black-500'>VAT</span><span>{`AED ${VAT.toFixed(2)}`}</span></li>
          <li className="flex justify-between items-center">
            <span className='text-black-500 flex items-center'>
              QuriFee
              <button onClick={onShowQuriFee} className='ml-2'>
                <img src={questionMark} alt="question Mark" className='w-3 h-3' />
              </button>
            </span>
            <span>{`AED ${QURI_SERVICE_FEE.toFixed(2)}`}</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default TotalItems;
