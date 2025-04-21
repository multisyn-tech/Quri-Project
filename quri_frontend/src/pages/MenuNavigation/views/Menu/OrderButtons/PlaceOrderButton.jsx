import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from 'antd-mobile';
import { BiBookmarkAltPlus } from "react-icons/bi";
import { addOrder } from '../../../../../features/orders/orderSlice';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

//Order Date
const orderDate = dayjs().format('MM-DD-YYYY');


const PlaceOrderButton = ({ restaurantID, tableID, totalPrice, cartItems }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const finalOrderPlace = () => {



        // Map cartItems to OrderDetails
        const orderDetails = cartItems.map(item => ({
            MenuID: item.MenuID,
            quantity: item.quantity,
            Price: item.Price,
        }));


        // Dispatch addOrder action with the correctly structured payload
        dispatch(addOrder({
            RestaurantID: restaurantID,
            TableID: tableID,
            TotalAmount: totalPrice,
            OrderDetails: orderDetails,
            OrderDate: orderDate
        }));

        // Show SweetAlert2 success message
        Swal.fire({
            icon: 'success',
            title: 'Order placed successfully!',
            text: `Your order total is ${totalPrice} AED.`,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });

    // Navigate after 5 seconds
    setTimeout(() => {
        // navigate('/quri/menu/orderPlaced');  
        navigate('/quri/home/bill');  // temperory navigation
    }, 3000);  

    }

    return (
        // <div className="fixed bottom-4 left-0 right-0 mx-auto ">
            <Button
                className="flex flex-row items-center justify-center w-full bg-black text-white py-3 px-6 rounded-full my-2"
                onClick={finalOrderPlace}
            >
                <div className="flex flex-row items-center w-full justify-between space-x-10">
                    {/* Shopping bag icon */}
                    <BiBookmarkAltPlus size={30} className=" text-lg" />
                    {/* Button text */}
                    <h4 className="font-normal text-base text-center md:text-xl lg:text-xl">Order now</h4>
                    {/* Price */}
                    <p className="font-extrabold"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #FF5AA7, #FFD855, #FF7B02)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}>
                        {totalPrice}
                    </p>

                </div>

            </Button>
        // </div>
    )
}

export default PlaceOrderButton;