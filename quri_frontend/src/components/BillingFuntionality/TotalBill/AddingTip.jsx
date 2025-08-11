import React, { useEffect, useState } from 'react';
import { BiSolidEdit } from "react-icons/bi";
import HeartImage from '../../../assets/Billing/heart-tick.svg';
import { useSelector, useDispatch } from 'react-redux';
import { Image } from 'antd-mobile'
import { RiHeartsFill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import Switch from "react-switch";
import { calculateTip } from './utility/tipCalculator';
import { LocalLaundryService } from '@mui/icons-material';

import { addPlateNumber } from '../../../features/orders/orderSlice';

const AddingTip = ({ total, onShowBill }) => {
  const [selectedTip, setSelectedTip] = useState(null);
  const dispatch = useDispatch();
  const [selectCustomTip, setSelectCustomTip] = useState(false);
  const [customTipAmount, setCustomTipAmount] = useState(0);
  const [plateNumber, setPlateNumber] = useState('');
  const [debouncedPlate, setDebouncedPlate] = useState('');

  const [tipsAvailable, setTipsAvailable] = useState(true);

  const [isClicked, setIsClicked] = useState(false);
  const [isToggled, setIsToggled] = useState(false); // Toggle state
  const [selectedRating, setSelectedRating] = useState(0);

  const orderInfo = useSelector((state) => state.orders?.order?.order?.order || []);


  const handleStarClick = (index) => {
    if (selectedRating === index + 1) {
      setSelectedRating(index); // Decrease the rating by one when the same star is clicked
    } else {
      setSelectedRating(index + 1); // Set the rating to the clicked star
    }
  };

  // Toggle button click handler
  const handleToggle = (checked) => {
    setIsToggled(checked => !checked);
  };

  // Handle tip click and unclick
  const handleTipClick = (tip) => {
    if (selectedTip === tip) {
      // Unselect if the same tip is clicked again
      setSelectedTip(null);
    } else {
      setSelectedTip(tip);
    }
  };

  const openBill = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      onShowBill(); // Show the bill after animation
    }, 300); // Duration of the animation
  };

  // Calculate the tip based on the selectedTip
  let tipAmount = selectedTip !== null ? calculateTip(total, selectedTip) : 0;
  tipAmount = Number(tipAmount.toFixed(2))


  useEffect(() => {
    const finalTip = customTipAmount || tipAmount || 0;
    localStorage.removeItem('tipAmount')
    localStorage.setItem('tipAmount', JSON.stringify(finalTip));
    window.dispatchEvent(new Event('tipUpdated'));
  }, [tipAmount, customTipAmount]);



  // Load plate number from localStorage on mount
  useEffect(() => {
    const storedPlateNumber = localStorage.getItem('plateNumber');
    if (storedPlateNumber) setPlateNumber(storedPlateNumber);
  }, []);

  // Save plate number to localStorage whenever it changes
  useEffect(() => {
    if (plateNumber) {
      localStorage.setItem('plateNumber', plateNumber);
    }
  }, [plateNumber]);



  const handleAddPlate = () => {
    const updatedOrder = {
      ...orderInfo,
      PlateNumber: plateNumber || '',
    };

    dispatch(addPlateNumber(updatedOrder));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPlate(plateNumber);
      // console.log('Debounced:', plateNumber);
      handleAddPlate()
    }, 900);
    return () => clearTimeout(timer);
  }, [plateNumber]);

  const handlePlateChange = (e) => setPlateNumber(e.target.value);

  return (
    <>
      <div className="relative">
        <div className='p-6'>
          <div className='mb-3'>
            <h1 className='font-medium text-xl'>Leave a tip?</h1>
            {tipsAvailable ? (
              <p className='flex items-center space-y-1'>
                <span className='mr-2'>
                  <Image lazy src={HeartImage} width={24} height={24} />
                </span>
                <span className='font-light text-gray-600'> Your tip amount:</span>
                {/* Display calculated tip */}
                <span className='ml-2'>{tipAmount.toFixed(2)} AED</span>
              </p>
            ) : (<></>)}
          </div>

          {tipsAvailable ? (
            <>
              <div className="flex space-x-2">
                {[5, 10, 15].map((tip) => (
                  <button
                    key={tip}
                    className={`flex items-center justify-center w-[66px] h-[66px] border-2 rounded-[8px] cursor-pointer transition-all ${selectedTip === tip ? 'border-transparent' : 'border-gray-300'
                      }`}
                    onClick={() => handleTipClick(tip)}
                    style={
                      selectedTip === tip
                        ? {
                          border: '2px solid transparent',
                          backgroundImage:
                            'linear-gradient(black, black), linear-gradient(to right, #F8E152 0%, #FF366D 43%, #FF7B02 100%)',
                          backgroundOrigin: 'border-box',
                          backgroundClip: 'padding-box, border-box',
                          color: 'white',
                        }
                        : { backgroundColor: 'white', color: 'black' }
                    }
                  >
                    <span className="font-normal text-lg">{tip}%</span>
                  </button>
                ))}
              </div>
            </>
          ) :
            (<></>)
          }



          {tipsAvailable ? (
            <span className='relative text-center bottom-2 left-0 bg-black px-2 text-white rounded-xl '>
              Common
            </span>
          ) : (<></>)}

          {/* Custom Tip */}
          <div className='flex items-center ml-2 space-y-1 space-x-1'>
            <span>< BiSolidEdit size={20} /></span>
            {selectedTip !== null ? (
              <span className='text-gray-400 underline'>{selectedTip} AED</span>
            ) : (
              <>
                <span onClick={() => setSelectCustomTip(prev => !prev, setTipsAvailable(false))} className='text-gray-400'>Pay custom tip</span>

                {selectCustomTip ? (
                  <input
                    className="ml-4 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ border: '1px solid #FFC48E' }}
                    value={customTipAmount}
                    onChange={(e) => {
                      setCustomTipAmount(e.target.value)
                      console.log('Current input value:', e.target.value);
                    }}
                    type="number" placeholder='Enter tip amount' />
                ) : null}

              </>




            )}
          </div>

          {/* Loyalty points card */}
          {/* <div className="flex  items-center justify-center mt-4">
            <div className="flex-col bg-gradient-to-r from-[#40008C] via-[#6D00CB] to-[#6D00CB] text-white rounded-xl p-2 flex items-center space-x-4 w-full max-w-3xl">
              <div className="flex justify-between items-center w-full space-x-2 ">
                <span ><RiHeartsFill size={25} /></span>
                <span className="flex-grow text-lg">Use your loyalty points</span>

                <button onClick={handleToggle}>
                  <Switch
                    onChange={handleToggle}
                    checked={isToggled}
                    offColor="#fff"
                    onColor="#fff"
                    offHandleColor="#000000"  
                    onHandleColor="#000000" 
                    handleDiameter={28}
                    height={28}
                    width={50}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0 0 2px 3px #3bf"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    transitionTime={200}
                    className='mt-2 '
                  />
                </button>
              </div>
           
           
              {isToggled && (
                <div className="text-center w-full max-w-sm mx-auto">
                  <div className="flex flex-col items-center justify-center max-w-sm ">
               
                    <div className="flex justify-center mt-4 space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          size={30}
                          className={`cursor-pointer ${selectedRating > index ? "text-[#FF7B02]" : "text-white"
                            }`}
                          onClick={() => handleStarClick(index)}
                        />
                      ))}
                    </div>


                    <div className="mt-4 text-center text-white text-sm">
                      Horray! Enjoy the discount
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div> */}


          {/* plate number */}
          <div className='my-5'>
            <h1 className='font-medium text-xl '>Enter your plate number</h1>
            <input
              className='my-1 py-3 px-2 w-full border-2'
              type="text"
              value={plateNumber || ''}
              // onChange={(e) => setPlateNumber(e.target.value)}
              onChange={handlePlateChange}
              required
              placeholder='Enter your car plate number i.e. AXD-144'
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default AddingTip;
