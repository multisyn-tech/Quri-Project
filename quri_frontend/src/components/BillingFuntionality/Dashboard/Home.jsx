import React, { useState, useEffect } from 'react';
import { useDrawer } from '../../../state/drawerContext.jsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../Buttons/Button.jsx';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Button2 } from '../Buttons/Button.jsx';
import DashboardImg from '../../../assets/Billing/Dashboard.svg';
import HeaderImage from '../../../assets/Billing/Modal_Pic.png';
import FooterImage from '../../../assets/Billing/Quri-Heading.png';
import { IoPersonOutline } from "react-icons/io5";
import { PiDotsThreeOutline } from "react-icons/pi";
import SideBarMenu from './SideBarMenu.jsx';
import FAQ from './SideBarContent/FAQ.jsx';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
    const navigate = useNavigate();
    const settings = useSelector((state) => state.qrcode.qrCodeDetails.data?.settings);

    const restaurantID = useSelector((state) => state.qrcode.qrCodeDetails.data?.RestaurantID);


    useEffect(() => {
        if (restaurantID && !localStorage.getItem('RestaurantID')) {
            localStorage.setItem('RestaurantID', restaurantID);
        }
    }, [restaurantID]);

    // Find the setting with KeyID 'RestaurantName'
    const restaurantName = settings?.find(setting => setting.KeyID === 'RestaurantName')?.Value || '';

    // Find the setting with KeyID 'image' for the header image
    const headerImageUrl = settings?.find(setting => setting.KeyID === 'image')?.Value || HeaderImage;
    const bgImageUrl = settings?.find(setting => setting.KeyID === 'bg')?.Value || HeaderImage;

    const { isDrawerOpen, toggleDrawer, toggleRewardsModal } = useDrawer();

    const menu = () => {
        navigate('/quri/menu/home');
    };

    const bill = () => {
        navigate('/quri/home/bill');
    };

    const customerRegisteration = () => {
        toggleRewardsModal();
    };





    return (
        <>
            {/* SideBar Menu */}
            <SideBarMenu isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            {/* FAQ */}

            {/* <FAQ /> */}
            {/* Header Content */}
            <div
                className='flex items-center flex-col w-full'
                style={{
                    backgroundImage: `url(${DashboardImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh'
                }}
            >
                <div className='w-full'>
                    <Card sx={{ width: '100%', boxShadow: 3, position: 'relative', borderRadius: '19px' }}>
                        {/* Buttons Container - Positioned Absolutely on the CardMedia */}
                        {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex justify-between items-center w-5/6">
                            <button
                                className="bg-white text-black px-2 py-2 rounded-full shadow-md hover:bg-gray-200 active:bg-gray-400 active:shadow-inner active:scale-95 transition-transform duration-150 ease-in-out"
                                onClick={toggleDrawer}
                            >
                                <PiDotsThreeOutline size={20} />
                            </button>
                            <button
                                className="bg-white text-black px-2 py-2 rounded-full shadow-md hover:bg-gray-200 active:bg-gray-400 active:shadow-inner active:scale-95 transition-transform duration-150 ease-in-out"
                                onClick={customerRegisteration}
                            >
                                <IoPersonOutline size={20} />
                            </button>
                        </div> */}

                        <CardMedia
                            component="img"
                            image={`${BASE_URL}/${bgImageUrl}`}
                            alt="Random Image"
                            sx={{ width: '100%', height: 'auto', borderBottomRightRadius: '19px', borderBottomLeftRadius: '19px' }}
                        />
                        {/* <div className='absolute inset-0 flex justify-center items-center'>
                            <img src={HeaderImage} alt="Header Image" className="w-auto max-w-full h-auto border-2 rounded-3xl border-orange-400" />
                        </div> */}
                    </Card>
                </div>
                <header>
                    <section className="flex flex-col items-center">
                        <div className='flex relative -mt-24 items-center justify-center' >
                            <div className="relative p-[1px] rounded-[19px] bg-gradient-to-r from-[#FF5AA7] via-[#FFD855] to-[#FF7B02]">
                                <img
                                    src={headerImageUrl.startsWith('uploads/') ? `${BASE_URL}/${headerImageUrl}` : headerImageUrl}
                                    alt="Header Image"
                                    className="w-[136px] h-[136px] rounded-[19px] border-2 border-orange-400"
                                />
                            </div>

                        </div>
                        <div className="flex justify-center items-center">
                            <h1 className='text-xl font-normal py-2'>{restaurantName}</h1>
                        </div>
                    </section>

                    <section className="flex flex-col items-center space-y-4">
                        <div className="flex justify-center items-center mt-10">
                            <h1 className='text-3xl text-center font-normal leading-tight'>Your gateway to seamless dining and rewards</h1>
                        </div>

                        {/* <Button2
                            onClick={menu}
                            gradientFrom="#FFF"
                            gradientMid="#FFF"
                            gradientTo="#FFF"
                        >
                            <div className='flex'>
                                <span>View Menu</span>
                            </div>
                        </Button2>

                        <Button
                            onClick={bill}
                            gradientFrom="#FF5AA7"
                            gradientMid="#FFD855"
                            gradientTo="#FF7B02"
                        >
                            <div className='flex items-center'>
                                <span>Pay your bill</span>
                            </div>
                        </Button> */}


                        <Button
                            onClick={menu}
                            gradientFrom="#FF5AA7"
                            gradientMid="#FFD855"
                            gradientTo="#FF7B02"
                        >
                            <div className='flex items-center'>
                                <span>Order Now</span>
                            </div>
                        </Button>



                        <div
                            style={{
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                borderRadius: "60px",
                                padding: "clamp(0.75rem, 2vw, 1.25rem)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#fff",
                                maxWidth: "100%",
                                width: "clamp(250px, 40vw, 500px)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.5rem, 1vw, 1rem)" }}>
                                <span
                                    style={{
                                        fontSize: "clamp(1rem, 2vw, 1.5rem)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        style={{ fill: "url(#gradient1)" }}
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="12" x2="12" y2="7" stroke="#fff" strokeWidth="2" />
                                        <line x1="12" y1="12" x2="15" y2="12" stroke="#fff" strokeWidth="2" />
                                    </svg>
                                </span>
                                <span style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)" }}>Estimated wait time:</span>
                            </div>
                            <b style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>5 Min</b>

                            {/* SVG Gradient Definition */}
                            <svg width="0" height="0">
                                <defs>
                                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: "#fe6a9c", stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: "#fff", stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        &nbsp;
                        &nbsp;
                        &nbsp;

                        <div className='flex items-center text-xs mt-4'>
                            <p>by using Quri you agree to your terms and privacy policy</p>
                        </div>
                        <div>
                            <p className='flex flex-row items-center justify-center mb-5'>served by <span className='ml-2'><img src={FooterImage} alt="Quri Image" width="35" /></span></p>
                        </div>
                    </section>
                </header>
            </div>

            {/* Footer Content */}

        </>
    );
}

export default Home;
