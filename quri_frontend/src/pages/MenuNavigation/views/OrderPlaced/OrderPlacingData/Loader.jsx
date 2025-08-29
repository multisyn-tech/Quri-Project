import React, { useState, useEffect } from 'react'
import HeaderImage from '../../../../../assets/Billing/Modal_Pic.png';
import timer from '../../../../../assets/Billing/timer.svg';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { IoPersonOutline } from "react-icons/io5";
import { PiDotsThreeOutline } from "react-icons/pi";
import { LeftOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import StepProgressBar from './StepProgressBar';
import { useSelector } from 'react-redux';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const Loader = () => {

    const settings = useSelector((state) => state.qrcode.qrCodeDetails.data?.settings);

    const headerImageUrl = settings?.find(setting => setting.KeyID === 'image')?.Value || HeaderImage;

    const bgImageUrl = settings?.find(setting => setting.KeyID === 'bg')?.Value || HeaderImage;


    const animationDurationInMinutes = 5; // 5 minutes
    const animationDuration = animationDurationInMinutes * 60 * 1000; // Convert to milliseconds (5 minutes = 300000 ms)

    const order_id = useSelector((state) => state.orders?.order?.order || []);
    // console.log(order_id.OrderID)

    const [currentStep, setCurrentStep] = useState(0); // Change this to move between steps

    // const steps = ['Order Received', 'In the Kitchen', 'Out for Delivery', 'Delivered']; // Example steps
    const steps = ['In the Kitchen']; // Example steps

    const navigate = useNavigate();

    useEffect(() => {
        // Automatically update the current step every 5 seconds
        const interval = setInterval(() => {
            setCurrentStep((prevStep) => {
                // If the current step is the last one, reset to 0
                if (prevStep === steps.length - 1) {
                    return 0;
                }
                // Otherwise, increment the step
                return prevStep + 1;
            });
        }, animationDuration); // Adjust time as needed 

        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, [steps.length, animationDuration]); // Adding steps.length as a dependency


    const contactUs = () => {
        console.log("Contact Pressed");
    };

    const goBack = () => {
        navigate('/quri/menu/orderSummary')
    }

    return (
        <>
            {/* Header Content */}
            <div className='flex flex-col w-full' >
                <div className='w-full'>
                    <Card sx={{ width: '100%', boxShadow: 3, position: 'relative' }}>
                        {/* Buttons Container - Positioned Absolutely on the CardMedia */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex justify-between items-center w-5/6">
                            <button
                                className="bg-white text-black px-2 py-2 rounded-full shadow-md hover:bg-gray-200 active:bg-gray-400 active:shadow-inner active:scale-95 transition-transform duration-150 ease-in-out"
                                onClick={goBack}
                            >
                                <LeftOutline fontSize={20} />
                            </button>
                            <button
                                className="bg-white text-black px-2 py-2 rounded-full shadow-md hover:bg-gray-200 active:bg-gray-400 active:shadow-inner active:scale-95 transition-transform duration-150 ease-in-out"
                                onClick={contactUs}
                            >
                                <IoPersonOutline size={20} />
                            </button>
                        </div>

                        <CardMedia
                            component="img"
                            image={`${BASE_URL}/${bgImageUrl}`}
                            alt="Random Image"
                            sx={{ width: '100%', height: 'auto' }}
                        />

                    </Card>
                </div>
                <section className="flex flex-col items-center">
                    <div className='flex relative -mt-24 items-center justify-center rounded-2xl'
                        style={{
                            border: '4px solid transparent', // Transparent border to make room for the gradient
                            backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #FF5AA7 0%, #FFD855 50%, #FF7B02 100%)', // Create the gradient
                            backgroundOrigin: 'border-box', // Ensure the gradient applies to the border
                            backgroundClip: 'padding-box, border-box', // Clip the background to create the gradient effect on the border
                        }} >
                        {/* Centering the image inside the card */}
                        <img
                            className="w-[136px] h-[136px] rounded-[19px] border-2 border-orange-400"
                            src={headerImageUrl.startsWith('uploads/') ? `${BASE_URL}/${headerImageUrl}` : headerImageUrl}
                            alt="Header Image" width={120} />
                    </div>
                </section>

                <div className='flex flex-col items-start mt-2 p-2'>
                    <h1 className='text-xl'>Your order is in the kitchen</h1>
                    {order_id?.OrderID != null ?
                        <p className='text-gray-500'>Order# {order_id.OrderID}</p>
                        : ""
                    }
                </div>

                {/* Loader Progress Bar */}

                <div className='mb-4 mx-2'>
                    <StepProgressBar currentStep={currentStep} steps={steps} delay={animationDuration} />
                </div>


                {/* Card container */}
                <div className=" flex items-center justify-center mb-4 p-2">
                    <div className="bg-purple-100 text-purple-700 rounded-lg p-3 flex items-center space-x-4 w-full max-w-lg">
                        <div className='flex items-center justify-center space-x-4'>
                            <img src={timer} alt="Timer" className='-mt-4' />
                            <p className='text-base '>Your order has been sent to the kitchen. Sit back, relax, and we'll have it prepared for you shortly. 🍽️</p>
                        </div>
                    </div>
                </div>


            </div>
        </>

    )
}

export default Loader