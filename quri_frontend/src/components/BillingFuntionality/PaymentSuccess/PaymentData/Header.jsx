import React from 'react';
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import HeartImage from '../../../../assets/Billing/heart-tick.svg';

import { useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate('/quri/bill/checkout');
    }

    return (
        <div className="flex flex-col items-center  p-4  mb-3" >
            <section className="flex flex-row items-center justify-between w-full">
                <button className="flex-shrink-0 p-2 rounded-full transition-transform transform hover:scale-110 active:scale-90 focus:outline-none  "
                    onClick={goBack}>
                    <MdOutlineKeyboardArrowLeft size={35} />
                </button>

                <p className="text-center flex-grow text-xl">Payment Successful</p>

                <button className="flex-shrink-0 p-2 rounded-full transition-transform transform hover:scale-110 active:scale-90 focus:outline-none ">
                    <IoPersonOutline size={24} />
                </button>
            </section>

            <section className='flex flex-col items-center justify-center'>
                <div><img src={HeartImage} alt="Heart Image" /></div>
                <h1 className='text-2xl font-bold text-center leading-tight mt-4 '>Thanks! your table is fully paid. You’re good to go!</h1>
            </section>



        </div>
    );
}

export default Header;
