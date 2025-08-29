import React, { useState, useEffect } from 'react';
import { RiHeartsFill } from 'react-icons/ri';
import { PiStarFourFill } from 'react-icons/pi';
import backgroundImage from '../../../../assets/Billing/dabba gang.png';
import contactHeart from '../../../../assets/Billing/lovely.svg'
import { Button } from 'antd-mobile'
import PaymentStatusCard from './PaymentStatusCard';
import dayjs from 'dayjs';

import { QURI_SERVICE_FEE } from "../../../../config/constants";

const Content = () => {
    const [selectedRating, setSelectedRating] = useState(0);
   
    const totalAmount = JSON.parse(localStorage.getItem("billAmount")) || [];

    const dateTime = dayjs().format('D/M/YY - h:mm A');

    const handleStarClick = (index) => {
        if (selectedRating === index + 1) {
            setSelectedRating(index); // Decrease the rating by one when the same star is clicked
        } else {
            setSelectedRating(index + 1); // Set the rating to the clicked star
        }
    };

    return (
        <>
            {/* With loyalty */}
            <div className="flex flex-col items-center justify-center space-y-6">
                <section className="w-full max-w-sm"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',

                    }}>
                    <div className="text-center w-full max-w-sm mx-auto">
                        <div className="flex flex-col items-center justify-center  max-w-sm p-2  rounded-lg shadow-lg">


                            <div className="flex flex-col items-center justify-center ">
                                <div className="p-2 rounded-full">
                                    < RiHeartsFill size={24} color="#FFF" />
                                </div>
                                <span className="text-white font-medium text-lg">You've earned a point!</span>
                            </div>



                            <div className="flex justify-center mt-4 space-x-1">
                                {[...Array(5)].map((_, index) => (
                                    <PiStarFourFill
                                        key={index}
                                        size={30}
                                        className={`cursor-pointer ${selectedRating > index ? "text-yellow-400" : "text-white"
                                            }`}
                                        onClick={() => handleStarClick(index)}
                                    />
                                ))}
                            </div>


                            <div className="mt-4 text-center text-gray-500 text-sm">
                                Get 5 points to unlock 15% off!
                            </div>
                        </div>

                    </div>
                </section>
            </div>


            {/* Without loyalty */}
            <div className="flex flex-col items-center justify-center space-y-6">
                {/* <section className="w-full max-w-sm" 
             style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
               
            }}>
                    <div className="text-center w-full max-w-sm mx-auto">
                        <div className="flex flex-col items-center justify-center  max-w-sm p-2  rounded-lg shadow-lg">


                            <div className="flex flex-col items-center justify-center mb-2">
                                <div className="p-2 rounded-full">
                                    <img src={contactHeart} alt="Contact Heart" />
                                </div>
                                <span className="text-white font-medium text-lg">You could've gotten 15% off!</span>
                            </div>


                            <Button color="warning" size='small' shape="rounded">Join now</Button>
                        </div>
                    </div>
                </section> */}

                {/* Total Bill Section */}

                <section className="w-full ">
                    <PaymentStatusCard
                        tableNumber={6}
                        dateTime={dateTime}
                        amountPaid={Number(totalAmount).toFixed(2)}
                        status="fullyPaid" // Change to "partiallyPaid" or "unpaid" for other states or fullyPaid
                    />

                </section>
            </div>
        </>
    );
};

export default Content;
