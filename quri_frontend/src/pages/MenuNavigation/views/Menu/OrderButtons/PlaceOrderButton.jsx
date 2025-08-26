import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd-mobile';
import { BiBookmarkAltPlus } from "react-icons/bi";
import { addOrder, resetCartItems, resetRejectedOrderItems, resetDetailsOfOrder, reset } from '../../../../../features/orders/orderSlice';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import storeHelpers from "../../../../../components/utility/storeStage";


//Order Date
const orderDate = dayjs().format('MM-DD-YYYY');


const PlaceOrderButton = ({ restaurantID, tableID, totalPrice, cartItems }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orders.detailsOfOrders)
    // console.log("Order Details: ", orderDetails)

    const { storeStage } = storeHelpers;
    const finalOrderPlace = () => {

        // Map cartItems to OrderDetails
        let orderDetails = null;

        orderDetails = cartItems.map(item => ({
            MenuID: item.MenuID,
            quantity: item.quantity,
            Price: item.Price,
            ItemName: item.ItemName,
            Image: item.Image,
        }));


        // Dispatch addOrder action with the correctly structured payload
        dispatch(addOrder({
            RestaurantID: restaurantID,
            TableID: tableID,
            TotalAmount: totalPrice,
            OrderDetails: orderDetails,
            OrderDate: orderDate
        }));

        storeStage("confirmed");

        // Show  success message
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


     

        // Navigate after some time
        setTimeout(() => {
            // navigate('/quri/menu/orderPlaced');  
            navigate('/quri/home/bill');  // temperory navigation
        }, 3000);


        //  waiting screen
        // setTimeout(() => {
        //     navigate(`/quri/home/waiting`);  // temperory navigation
        // }, 3000);

    }

    return (
        <div className="fixed bottom-4 left-0 right-0 mx-4 mt-2 ">
            <Button
                className="flex flex-row items-center justify-center w-full bg-black text-white py-3 px-6 rounded-full my-1"
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
        </div>
    )
}

export default PlaceOrderButton;