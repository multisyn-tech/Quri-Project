import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Image } from 'antd-mobile';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { removeItemFromCart, updateItemQuantity } from '../../../../../features/orders/orderSlice';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ItemsSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Access cart items from Redux store
    const cartItems = useSelector((state) => state.orders.cartItems);

    const orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);
    // console.log("orderDetails: ",orderDetails)

 
    // Function to increment quantity and update in Redux
    const incrementQuantity = (item) => {
        const newQuantity = item.quantity + 1;
        dispatch(updateItemQuantity({ MenuID: item.MenuID, quantity: newQuantity }));
    };

    // Function to decrement quantity and update in Redux or remove if zero
    const decrementQuantity = (item) => {
        if (item.quantity > 1) {
            const newQuantity = item.quantity - 1;
            dispatch(updateItemQuantity({ MenuID: item.MenuID, quantity: newQuantity }));
        } else {
            // Remove item from cart if quantity is 1 and decrement button is pressed
            dispatch(removeItemFromCart(item.MenuID));
        }
    };


    const gotoMenu = () => {
        navigate('/quri/menu/home');
    };


    return (
        <div>
            {/* Menu items */}
            <div className="mt-6 space-y-6 bg-white shadow-md">
                {cartItems.length > 0 ? (
                    <>
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex items-start p-2">
                                {/* Item Image */}
                                <Image
                                    lazy
                                    src={item.Image.startsWith('food-uploads/')
                                        ? `${BASE_URL}/${item.Image}`
                                        : item.Image
                                    }
                                    fit="cover"
                                    className="w-[80px] h-[70px] rounded-[12px] object-cover"
                                />
                                {/* Item details */}
                                <div className="flex w-full justify-between ml-2">
                                    <div className="justify-between items-start">
                                        <h3 className="text-lg text-black">{item.ItemName}</h3>
                                        <span className="text-lg font-normal text-gray-700">{item.Price} AED</span>
                                        {/* {item.discount && (
                                            <Badge content={`${item.discount}% Off`} className="ml-2" />
                                        )} */}
                                    </div>

                                    <div className="flex items-center justify-between mr-10">
                                        {/* <span className="text-lg font-normal text-gray-700">{item.Price} AED</span> */}
                                        <div className="flex items-center space-x-2">
                                            {/* Decrement Button */}
                                            <Button
                                                onClick={() => decrementQuantity(item)}
                                                className="p-2.5 rounded-full bg-black text-white hover:bg-gray-300"
                                            >
                                                <FaMinus size={14} />
                                            </Button>
                                            {/* Quantity */}
                                            <span className="text-lg font-normal text-gray-900">{item.quantity}</span>
                                            {/* Increment Button */}
                                            <Button
                                                onClick={() => incrementQuantity(item)}
                                                className="p-2.5 rounded-full bg-black text-white hover:bg-gray-300"
                                            >
                                                <FaPlus size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Adding more Items button - only shown if there are items in the cart */}
                        <div className="flex items-center justify-center w-full">
                            <Button onClick={gotoMenu} className="flex items-center justify-center bg-gray-200 text-gray-800 py-2.5 px-4 mb-4 rounded-full w-3/5">
                                {/* Wrapping the icon and text in a div ensures correct alignment */}
                                <div className="flex items-center justify-center space-x-2">
                                    <FaPlus size={14} className="inline-block" />
                                    <span>Add more items</span>
                                </div>
                            </Button>
                        </div>

                    </>
                ) : (
                    <div className="text-center text-lg text-gray-600 py-6">
                        <p>No items in the cart</p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default ItemsSection;
