import React from 'react';
import { Button } from 'antd-mobile';
import { TbShoppingBag } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

const ViewOrderButton = ({ totalPrice }) => {
    const navigate = useNavigate();

    // Navigate to cart page
    const cartPage = () => {
        navigate('/quri/menu/orderSummary');
    };


    return (
        // <div className="fixed bottom-4 left-0 right-0 px-4">
            <Button
                className="flex flex-row items-center justify-center w-full bg-black text-white py-3 px-6 rounded-full my-2"
                onClick={cartPage}
            >
                <div className="flex flex-row items-center w-full justify-between space-x-10">
                    {/* Shopping bag icon */}
                    <TbShoppingBag size={24} className="text-white" />

                    {/* Button text */}
                    <h4 className="font-normal text-lg text-white">View your order</h4>

                    {/* Price */}
                    <p
                        className="font-extrabold text-lg"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #FF5AA7, #FFD855, #FF7B02)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        {totalPrice}
                    </p>
                </div>
            </Button>
        // </div>
    );
};

export default ViewOrderButton;
