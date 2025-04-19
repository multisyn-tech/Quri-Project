import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaApplePay } from "react-icons/fa";
import Visa from '../../../assets/Cards/Visa.png'
import MasterCard from '../../../assets/Cards/mastercard.png'
import American from '../../../assets/Cards/American.png'
import Discover from '../../../assets/Cards/Discover.png'
import Maestro from '../../../assets/Cards/Maestro.png'
import Union from '../../../assets/Cards/UnionPay.png'
import { useNavigate } from 'react-router-dom';
import Button from '../Buttons/Button';
const CardPayment = ({ onClose }) => {
    const navigation = useNavigate();
    const [isPayVisible, setIsPayVisible] = useState(false);
    const [isAppleVisible, setisAppleVisible] = useState(false);

    const Payment = () => {
        setIsPayVisible(true);
        setTimeout(() => {
            setIsPayVisible(false);
            navigation('/quri/bill/success')
        }, 300);
    }

    const ApplyPay = () => {
        setisAppleVisible(true);
        setTimeout(() => {
            setisAppleVisible(false);
        }, 300);
    }

    return (
        <div className="fixed inset-x-0 bottom-0 rounded-lg bg-white p-4 shadow-lg z-50">
            <div className='w-full'>
                <div className="flex justify-end mb-4">
                    <button onClick={onClose} className="text-gray-500">
                        <IoMdClose size={24} />
                    </button>
                </div>
                <div className="flex items-center justify-center mb-4">
                    <div className='flex flex-col w-full mb-2'>
                        <button className={`w-full py-2  bg-black text-white rounded-lg mt-2 font-bold transition-transform ease-out duration-300 ${isAppleVisible ? 'transform scale-105 opacity-90' : ''
                            }`}
                            onClick={ApplyPay}>
                            <FaApplePay size={45} className="mx-auto" />
                        </button>
                    </div>

                </div>
                <div className='mb-4 p-2'>
                    <input
                        type='email'
                        placeholder='Email'
                        className='w-full p-2 border border-gray-300 rounded mb-2 '
                    />
                    <label className='block p-1 text-sm mb-1 font-medium'>Enter the card details</label>
                    <input
                        type='text'
                        placeholder='1234 1234 1234 1234'
                        className='w-full p-2 border border-gray-300 rounded mb-2'
                    />
                    <div className='flex space-x-2'>
                        <input
                            type='text'
                            placeholder='MM/YY'
                            className='w-1/2 p-2 border border-gray-300 rounded'
                        />
                        <input
                            type='text'
                            placeholder='CVC'
                            className='w-1/2 p-2 border border-gray-300 rounded'
                        />
                    </div>
                </div>
                <div className='flex items-center justify-center mb-4'>
                    <img src={Visa} alt='Visa' className='h-4 mx-2' />
                    <img src={MasterCard} alt='MasterCard' className='h-4 mx-2' />
                    <img src={American} alt='American' className='h-4 mx-2' />
                    <img src={Discover} alt='Discover' className='h-4 mx-2' />
                    <img src={Maestro} alt='Maestro' className='h-4 mx-2' />
                    <img src={Union} alt='Union Pay' className='h-4 mx-2' />
                </div>
                <div className='flex flex-col w-full mb-2 font-bold'>
                    <Button
                        gradientFrom="#FF5AA7"
                        gradientMid="#FFD855"
                        gradientTo="#FF7B02"
                        onClick={Payment}>Pay</Button>
                </div>
            </div>
        </div>
    )
}

export default CardPayment;
