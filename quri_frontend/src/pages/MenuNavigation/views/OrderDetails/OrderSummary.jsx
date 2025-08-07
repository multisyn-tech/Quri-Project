import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LeftOutline } from 'antd-mobile-icons';
import ItemsSection from './OrderSummaryData/ItemsSection';
import PopularDishes from './OrderSummaryData/PopularDishes';
import PlaceOrderButton from '../Menu/OrderButtons/PlaceOrderButton';
import Swal from 'sweetalert2';
import { resetRejectedOrderItems, resetCartItems } from '../../../../features/orders/orderSlice';
import { useLocation } from 'react-router-dom';


const OrderSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSwalOpen, setIsSwalOpen] = useState(false);

  const tableID = useSelector((state) => state.qrcode.qrCodeDetails.data?.TableID);
  // console.log("Table ID: ",tableID);
  const restaurantID = useSelector((state) => state.qrcode.qrCodeDetails.data?.RestaurantID);
  // console.log("Restaurant ID is: ",restaurantID);
  const cartItems = useSelector((state) => state.orders.cartItems);
  //  console.log("Cart Items",cartItems);


  const [hasShownSwal, setHasShownSwal] = useState(false);

  const location = useLocation();
  const rejectedItems = location.state?.rejectedItems || [];


  const goBackToMenu = () => {
    navigate('/quri/menu/home');
  };

  // Calculate total price from the cart items
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.Price) * item.quantity);
  }, 0).toFixed(2);

  // console.log("Total Price: ",totalPrice)


  // modal if order got rejected



  useEffect(() => {
    if (rejectedItems.length > 0 && !hasShownSwal) {
      const unavailableNames = rejectedItems
        .map(item => `• ${item.ItemName} is not available`)
        .join('<br>');



      Swal.fire({
        icon: 'warning',
        title: 'Some items are unavailable',
        html: unavailableNames,
        toast: false,
        showConfirmButton: true,
        backdrop: `rgba(0, 0, 0, 0.3) blur(5px)`,

        willOpen: () => {
          setIsSwalOpen(true); // Enable background blur
        },
        willClose: () => {
          setIsSwalOpen(false); // Disable background blur
        },

        didOpen: () => {
          const popup = document.querySelector('.swal2-popup');
          if (popup) {
            popup.style.background = '#fff';
            popup.style.borderRadius = '15px';
            popup.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            popup.style.padding = '25px';
          }

          const title = document.querySelector('.swal2-title');
          if (title) {
            title.style.color = '#e3342f';
            title.style.fontSize = '20px';
          }

          const content = document.querySelector('.swal2-html-container');
          if (content) {
            content.style.color = '#333';
            content.style.fontSize = '14px';
            content.style.marginTop = '10px';
          }

          const icon = document.querySelector('.swal2-icon');
          if (icon) {
            icon.style.borderColor = '#e3342f';
            icon.style.color = '#e3342f';
          }

          const iconInner = document.querySelector('.swal2-icon-content');
          if (iconInner) {
            iconInner.style.color = '#e3342f';
          }

          const confirmBtn = document.querySelector('.swal2-confirm');
          if (confirmBtn) {
            confirmBtn.style.backgroundColor = '#e3342f';
            confirmBtn.style.color = '#fff';
            confirmBtn.style.padding = '8px 16px';
            confirmBtn.style.borderRadius = '8px';
          }
        }
      });





      setHasShownSwal(true); // Prevent re-show on same render

      setTimeout(() => {
        dispatch(resetRejectedOrderItems());
        window.history.replaceState({}, '', window.location.pathname);
      }, 2000);
    }
  }, [rejectedItems, hasShownSwal]);



  return (
    <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSwalOpen ? 'blur-sm' : ''}`}>
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
            <PlaceOrderButton restaurantID={restaurantID} tableID={tableID} totalPrice={totalPrice} cartItems={cartItems} />
          )}
        </div>
      </section>
    </div>
  );
};

export default OrderSummary;
