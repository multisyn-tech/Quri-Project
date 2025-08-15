import React, { useState, useEffect } from 'react';
import { useDrawer } from '../../../state/drawerContext.jsx';
import FooterImage from '../../../assets/Billing/Quri-Heading.png';
import LockScreen from '../../../assets/Billing/Locks.png';
import Button from '../Buttons/Button.jsx';
import Card from './Card.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { Card2 } from './Card.jsx';
import questionMark from '../../../assets/Billing/Vector.png';
import QuriFee from './QuriFee.jsx';
import Loader from '../AnimationLoader/Loader.jsx';
import BillDivider from '../SplitBill/BillDivider.jsx';
import { useNavigate } from 'react-router-dom';
import { Button2 } from '../Buttons/Button.jsx';
import { BiUser } from "react-icons/bi";
import { MdArrowBackIosNew } from "react-icons/md";
import { viewOrder } from '../../../features/orders/orderSlice.jsx';
import { QURI_SERVICE_FEE } from "../../../config/constants.js";
import SideBarMenu from '../../BillingFuntionality/Dashboard/SideBarMenu.jsx';

import storeStage from '../../../components/utility/storeStage.js'

const Bill = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isQuriFeeVisible, setIsQuriFeeVisible] = useState(false);
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);
    const [isBillDividerVisible, setIsBillDividerVisible] = useState(false);

    const { isDrawerOpen, toggleDrawer, toggleRewardsModal } = useDrawer();


    const qrCode = useSelector((state) => state.qrcode.qrCodeDetails?.data?.QRCode || null);
    const tableID = useSelector((state) => state.qrcode.qrCodeDetails?.data?.TableID || null);
    const orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);

    // console.log("Table ID from Bill: ", tableID)

    useEffect(() => {
        if (tableID) {
            dispatch(viewOrder(tableID));
        }
    }, [tableID, dispatch]);


    const goBack = () => {
        navigate(`/quri/home/${qrCode}`);
    };


    const splitBill = () => {
        setIsLoaderVisible(true);
        setTimeout(() => {
            setIsLoaderVisible(false);
            setIsBillDividerVisible(true);
        }, 100);
    };

    const payFullBill = () => {
        storeStage('accepted')
        navigate('/quri/bill/checkout');
    };




    const customerRegisteration = () => {
        toggleRewardsModal();
    };



    const quriServiceFee = () => {
        setIsQuriFeeVisible(true);
    };

    const closeQuriFee = () => {
        setIsQuriFeeVisible(false);
    };

    const calculateSubtotal = () => {
        return orderDetails.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
    };

    const subtotal = calculateSubtotal();

    const total = subtotal + QURI_SERVICE_FEE;


    // Handle edge cases where data might not be available
    if (!qrCode || !tableID) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg text-center ">Error: Table ID or QR Code is unavailable. Please try again later.</p>
                <button onClick={goBack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Go Back</button>
            </div>
        );
    }

    if (orderDetails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg text-center">No order details available. Please place an order.</p>
                <button onClick={goBack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Go Back</button>
            </div>
        );
    }


    return (
        <div className={`relative   ${isQuriFeeVisible ? 'overflow-hidden' : ''}`}>
            {isLoaderVisible ? (
                <Loader />
            ) : (
                <>
                  <SideBarMenu isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

                    <div className={`relative p-4  ${isBillDividerVisible ? 'shadow-lg' : ''}`}>
                        <header className={`flex flex-col items-center   ${isQuriFeeVisible ? 'filter blur-sm' : ''}`}>
                            <section className="relative flex flex-row items-center justify-between mb-6 w-full">
                                {/* <button className="flex-shrink-0 p-2 rounded-full transition-transform transform hover:scale-110 active:scale-90 focus:outline-none" onClick={goBack}>
                                    <MdArrowBackIosNew size={24} />
                                </button> */}
                                <button className="flex-shrink-0 p-2 rounded-full transition-transform transform hover:scale-110 active:scale-90 focus:outline-none" >
                                    {/* <MdArrowBackIosNew size={24} /> */}
                                </button>

                                <p className="absolute left-1/2 transform -translate-x-1/2 text-xl">Pay now</p>

                                <button onClick={customerRegisteration} className="flex-shrink-0 p-2 rounded-full transition-transform transform hover:scale-110 active:scale-90 focus:outline-none">
                                    {/* <BiUser size={24} /> */}
                                </button>
                            </section>


                            <div className="flex flex-col items-center justify-center">
                                <div>
                                    <div className='border-2 rounded-xl shadow p-6 w-96' style={{
                                        border: '4px solid transparent',
                                        backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #FFD855 50%, #FF7B02 80%)',
                                        backgroundOrigin: 'border-box',
                                        backgroundClip: 'padding-box, border-box',
                                    }}>
                                        <h2 className="text-xl font-normal text-center mb-6">Order details</h2>
                                        <ul className="space-y-4">
                                            {orderDetails.map((item, index) => (
                                                <li key={index} className='border-b border-gray-200 pb-2'>
                                                    <div className="flex justify-between">
                                                        <span className="font-normal">{item.ItemName}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <div className="text-gray-500">
                                                            <span>{`AED ${parseFloat(item.Price).toFixed(2)}`}</span>
                                                            <span className="ml-2">{`${item.Quantity}x`}</span>
                                                        </div>
                                                        <span className="font-normal">{`AED ${(item.Price * item.Quantity).toFixed(2)}`}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className='mb-2 border-dashed border-t-8 bg-white border-white  w-full'></div>

                            <Card2>
                                <ul className="space-y-2">
                                    <li className="flex justify-between font-bold"><span className='text-gray-400'>Subtotal</span><span>{`AED ${subtotal.toFixed(2)}`}</span></li>
                                    <li className="flex justify-between font-bold">
                                        <span className='text-gray-400 flex items-center'>
                                            Quri Service Fee
                                            <button onClick={quriServiceFee} className='ml-2'>
                                                <img src={questionMark} alt="question Mark" className='w-3 h-3' />
                                            </button>
                                        </span>
                                        <span>{`AED ${QURI_SERVICE_FEE.toFixed(2)}`}</span>
                                    </li>
                                    <li className="flex justify-between font-bold"><span className='text-gray-400'>Total</span><span style={{ color: '#40008C' }}>{`AED ${total.toFixed(2)}`}</span></li>
                                </ul>
                            </Card2>

                            <section className="flex flex-col items-center my-10 space-y-4 w-full">
                                {/* <Button2 onClick={splitBill} gradientFrom="#FFF" gradientMid="#FFF" gradientTo="#FFF">
                                    <div className='flex'>
                                        <span>Split bill</span>
                                    </div>
                                </Button2> */}
                                <Button onClick={payFullBill} gradientFrom="#FF5AA7" gradientMid="#FFD855" gradientTo="#FF7B02">
                                    <span>Pay full bill</span>
                                </Button>
                                <div className='flex items-center text-xs'>
                                    <p className='mt-10'>by using Quri you agree to your terms and privacy policy</p>
                                </div>
                                <div>
                                    <p className='flex flex-row items-center justify-center'>
                                        <span className='mr-1'><img src={LockScreen} alt="Lock Screen" width="10px" /></span>
                                        secure payments by
                                        <span className='ml-2'><img src={FooterImage} alt="Quri Image" width="35px" /></span>
                                    </p>
                                </div>
                            </section>
                        </header>

                        {isQuriFeeVisible && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div>
                                    <QuriFee onClose={closeQuriFee} />
                                </div>
                            </div>
                        )}
                    </div>

                    {isBillDividerVisible && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="fixed inset-x-0 bottom-0 rounded-lg bg-white px-2 py-4 shadow-lg z-50 min-h-[50vh]">
                                <BillDivider onClose={() => { setIsBillDividerVisible(false); }} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Bill;
