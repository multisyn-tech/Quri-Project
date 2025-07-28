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
import leftDesign from '../../../../../assets/waiting/left-design.png';
import rightDesign from '../../../../../assets/waiting/right-design.png';
// import logo from '../../../../../assets/waiting/logo.png';
import logo from '../../../../../assets/waiting/Quri-Heading.png';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const Waiting = () => {

  const settings = useSelector((state) => state.qrcode.qrCodeDetails.data?.settings);

  const headerImageUrl = settings?.find(setting => setting.KeyID === 'image')?.Value || HeaderImage;

  const animationDurationInMinutes = 5; // 5 minutes
  const animationDuration = animationDurationInMinutes * 60 * 1000; // Convert to milliseconds (5 minutes = 300000 ms)

  const [currentStep, setCurrentStep] = useState(0); // Change this to move between steps

  // const steps = ['Order Received', 'In the Kitchen', 'Out for Delivery', 'Delivered']; // Example steps
  const steps = ['Order Received']; // Example steps

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



      <div className="relative w-screen h-screen bg-[#4A249D] overflow-hidden">

        <img
          src={rightDesign}
          alt="Top right decorative element"
          className="absolute top-0 right-0 z-0 w-1/2 md:w-1/3"
        />


        <img
          src={leftDesign}
          alt="Bottom left decorative element"
          className="absolute bottom-0 left-0 z-0 w-1/2 md:w-1/2"
        />


        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {/* The Logo */}
          <img
            src={logo}
            alt="Company Logo"
            className="w-20 h-20 mb-6"
          />


          <p
            className="text-white text-center"
            style={{
              fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif',
              fontWeight: 500,
              fontSize: '25px',
              lineHeight: '30px',
              letterSpacing: '0',
            }}
          >
            We're confirming your order...
          </p>

        </div>
      </div>





    </>

  )
}

export default Waiting