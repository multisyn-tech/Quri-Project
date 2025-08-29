import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../components/BillingFuntionality/Buttons/Button';
import { Button2 } from '../../../../../components/BillingFuntionality/Buttons/Button';
import FooterImage from '../../../../../assets/Billing/Quri-Heading.png';
import { viewOrder } from '../../../../../features/orders/orderSlice';

const List = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.orders.cartItems);
    const qrCode = useSelector((state) => state.qrcode.qrCodeDetails?.data?.QRCode || null);
    const tableID = useSelector((state) => state.qrcode.qrCodeDetails?.data?.TableID || null);
    const orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);
    
    // console.log("Cart Items", cartItems);

    useEffect(() => {
        if (tableID) {
            dispatch(viewOrder(tableID));
        }
    }, [tableID, dispatch]);


    const orderMore = () => {
        navigate('/quri/menu/home')
    }

    const payBill = () => {
        navigate('/quri/home/bill')
    }


    // Handle empty cart case
    if (!orderDetails || orderDetails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 ">
                <div className="border-2 rounded-xl shadow p-6 w-full"
                    style={{
                        border: '4px solid transparent',
                        backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #FFD855 50%, #FF7B02 80%)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                    }}
                >
                    <h2 className="text-xl font-semibold text-center mb-6">Order details</h2>
                    <p className="text-center text-gray-500">Your cart is empty. Please add items to proceed.</p>
                </div>

                <div className='flex flex-col items-center justify-center mt-4 space-y-3'>
                    <Button2 gradientFrom="#FFF" gradientMid="#FFF" gradientTo="#FFF"
                        onClick={orderMore}
                    >
                        <div className='flex'>
                            <span>Order more</span>
                        </div>
                    </Button2>

                    <div className='flex items-center'>
                        <p className='font-normal text-[10px] text-[#3A3A3A]'>By using Quri you agree to your terms and privacy policy</p>
                    </div>

                    <div>
                        <p className='flex flex-row items-center justify-center'>served by <span className='ml-2'><img src={FooterImage} alt="Quri Image" width="35" /></span></p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className='flex flex-col items-center justify-center p-8'>
            <div className="border-2 rounded-xl shadow p-6 w-full"
                style={{
                    borderWidth: '1px', // Transparent border to make room for the gradient
                    borderStyle:'solid',
                    borderColor:'transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #FFD855 50%, #FF7B02 80%)', // Create the gradient
                    backgroundOrigin: 'border-box', // Ensure the gradient applies to the border
                    backgroundClip: 'padding-box, border-box', // Clip the background to create the gradient effect on the border
                }}
            >

                <h2 className="text-xl font-normal text-center mb-6">Order details</h2>
                <ul className="space-y-4">
                    {orderDetails.map((item, index) => (
                        <li key={index} className='border-b border-gray-200 pb-2'>
                            <div className="flex justify-between">
                                <span className="font-normal  text-[#19191D] text-[13px]">{item.ItemName}</span>
                            </div>
                            <div className="flex justify-between text-sm font-light">
                                <div className="text-[#ADB0B9] text-[12px]">
                                    <span>{`AED ${parseFloat(item.Price).toFixed(2)}`}</span>
                                    <span className="ml-2">{`${item.Quantity}x`}</span>
                                </div>
                                <span className="font-normal text-[#19191D] text-[13px]">{`AED ${(item.Price * item.Quantity).toFixed(2)}`}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex flex-col items-center justify-center mt-4 space-y-3'>
                {/* <Button2
                    gradientFrom="#FFF"
                    gradientMid="#FFF"
                    gradientTo="#FFF"
                    onClick={orderMore}
                >
                    <div className='flex'>
                        <span>Order more</span>
                    </div>
                </Button2> */}

                {/* <Button
                    gradientFrom="#FF5AA7"
                    gradientMid="#FFD855"
                    gradientTo="#FF7B02"
                    onClick={payBill}
                >
                    <div className='flex items-center'>
                        <span>Pay your bill</span>
                    </div>
                </Button> */}

                <div className='flex items-center text-xs mt-4 text-center px-6'>
                    <p className='font-normal text-[10px] text-[#3A3A3A]'>By using Quri you agree to your terms and privacy policy</p>
                </div>

                {/* Footer Content */}
                <div>
                    <p className='flex flex-row items-center justify-center'>
                        served by <span className='ml-2'><img src={FooterImage} alt="Quri Image" width="35" /></span>
                    </p>
                </div>
            </div>


        </div>
    );
};

export default List;
