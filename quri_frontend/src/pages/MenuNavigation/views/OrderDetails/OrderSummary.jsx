import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LeftOutline } from 'antd-mobile-icons';
import ItemsSection from './OrderSummaryData/ItemsSection';
import PopularDishes from './OrderSummaryData/PopularDishes';
import PlaceOrderButton from '../Menu/OrderButtons/PlaceOrderButton';

const OrderSummary = () => {
  const navigate = useNavigate();
  const tableID = useSelector((state) => state.qrcode.qrCodeDetails.data?.TableID);
 // console.log("Table ID: ",tableID);
  const restaurantID = useSelector((state) => state.qrcode.qrCodeDetails.data?.RestaurantID);
 // console.log("Restaurant ID is: ",restaurantID);
  const cartItems = useSelector((state) => state.orders.cartItems);
//  console.log("Cart Items",cartItems);

  const goBackToMenu = () => {
    navigate('/quri/menu/home');
  };

   // Calculate total price from the cart items
   const totalPrice = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.Price) * item.quantity);
  }, 0).toFixed(2);

 // console.log("Total Price: ",totalPrice)


  return (
    <div className='flex flex-col min-h-screen'> {/* Use min-h-screen to ensure it covers full height */}
      
      {/* Heading Part */}
      <section className="flex items-center p-4">
        {/* Back button with LeftOutline icon */}
        <button onClick={goBackToMenu} className="text-black">
          <LeftOutline fontSize={20} />
        </button>

        {/* Heading, centered */}
        <h2 className="text-xl text-center flex-1">Your order</h2>
      </section>

      {/* Food Items Selection */}
      <section className='flex-grow flex flex-col'> {/* flex-grow ensures this section takes available space */}
        <ItemsSection />
        <div className='bg-[#F5F5F5] py-1'></div> 
        <PopularDishes />
        <div className='mb-20'>
        {cartItems.length > 0 && (
        <PlaceOrderButton  restaurantID={restaurantID} tableID={tableID} totalPrice={totalPrice}   cartItems={cartItems}  />
      )}
        </div>
      </section>
    </div>
  );
};

export default OrderSummary;
