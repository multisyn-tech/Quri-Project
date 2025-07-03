import React, { useState, useEffect } from 'react';
import List from './OrderPlacingData/List';
import Loader from './OrderPlacingData/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { resetCartItems } from '../../../../features/orders/orderSlice';

const BASE_URl = import.meta.env.VITE_API_BASE_URL;


const OrderPlaced = () => {

  const [orderID, setOrderID] = useState(null);

  const dispatch = useDispatch();

  const handleResetCart = () => {
    dispatch(resetCartItems()); // Dispatch to reset the cart
  };


  let orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);
  let orderDetailIds = orderDetails.map(item => item?.OrderDetailID);



  if (orderDetails.length == 0) {
    orderDetails = useSelector((state) => state.orders?.orders || []);
    orderDetailIds = orderDetails[orderDetails.length - 1].OrderID;
  }


  // console.log("order detail:-: ",orderDetailIds);

  const getOrderID = async () => {
    try {
      const response = await fetch(`${BASE_URl}/customers/order/getID`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderDetailIds }),
      });

      const data = await response.json();
      // console.log("get order id ", data.orderID);

      if (data.orderID != null) {
        setOrderID(data.orderID)
      }
    } catch (error) {
      console.error("Error fetching order IDs:", error);
    }
  };

  const changeOrderStatus = async () => {

    // first check payment , if payment is done then order statuus is completed

    if (orderID === null) return;

    // console.log("order is  ", orderID)

    try {
      const response = await fetch(`${BASE_URl}/customers/order/changeStatus/${orderID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newStatus: 'Completed' })
      });

      const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  }


  useEffect(() => {
    getOrderID();
    handleResetCart()

  }, [orderDetailIds]);


  useEffect(() => {
    if (orderID !== null) {
      changeOrderStatus();
    }
  }, [orderID])


  return (
    <div className="flex flex-col min-h-screen">
      {/* Loader should take full screen height when loading */}
      <Loader />

      {/* Space between loader and list content */}
      <div className='bg-gray-100 flex-grow'>
        <br />
      </div>

      {/* List component will fill the remaining space */}
      <List />
    </div>
  );
}

export default OrderPlaced;
