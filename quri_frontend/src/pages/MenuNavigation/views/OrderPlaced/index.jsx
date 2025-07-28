import React, { useState, useEffect } from 'react';
import List from './OrderPlacingData/List';
import Loader from './OrderPlacingData/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { resetCartItems } from '../../../../features/orders/orderSlice';

const BASE_URl = import.meta.env.VITE_API_BASE_URL;


const OrderPlaced = () => {

  const [orderID, setOrderID] = useState(null);
  const [showOrderList, setShowOrderList] = useState(true);
  const [orderDetailIds, setOrderDetailIds] = useState([]);


  const dispatch = useDispatch();

  const handleResetCart = () => {
    dispatch(resetCartItems()); // Dispatch to reset the cart
  };


  // let orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);
  // let orderDetailIds = orderDetails.map(item => item?.OrderDetailID);

  // if (orderDetails.length == 0) {
  //   orderDetails = useSelector((state) => state.orders?.orders || []);
  //   orderDetailIds = orderDetails[orderDetails.length - 1]?.OrderID;
  // }



  const orderDetailsFromSingleOrder = useSelector((state) => state.orders?.order?.order?.orderDetails || []);
  const allOrders = useSelector((state) => state.orders?.orders || []);


  useEffect(() => {
    if (orderDetailsFromSingleOrder.length > 0) {
      setOrderDetailIds(orderDetailsFromSingleOrder.map(item => item?.OrderDetailID));
      setShowOrderList(true);
    } else if (allOrders.length > 0) {
      setOrderDetailIds([allOrders[allOrders.length - 1]?.OrderID]);
      setShowOrderList(true);
    } else {
      setShowOrderList(false);
    }
  }, [orderDetailsFromSingleOrder, allOrders]); // Dependency array


  // airpay response handle
  useEffect(() => {
    const handleAirpayResponse = async () => {
      if (window.location.search || document.forms.length > 0) {
        const formData = new FormData(document.forms[0] || {});
        const responseData = {};
        formData.forEach((value, key) => {
          responseData[key] = value;
        });

        try {
          const res = await fetch(`${BASE_URL}/bill/airpay-response`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responseData),
          });

          const result = await res.json();
          console.log('Airpay response processed:', result);

          if (result.TRANSACTIONSTATUS === 'SUCCESS') {
            alert('Payment successful!');
          } else {
            alert(`Payment failed: ${result.MESSAGE}`);
          }
        } catch (error) {
          console.error('Error processing Airpay response:', error);
          alert('Error processing payment response');
        }
      }
    };

    handleAirpayResponse();
  }, []);



  useEffect(() => {
    getOrderID();
    handleResetCart()

    removePlatNumberFromScreen()

  }, [orderDetailIds]);


  const removePlatNumberFromScreen = () => {
    const storedPlateNumber = localStorage.getItem('plateNumber');
    if (storedPlateNumber) {
      localStorage.removeItem('plateNumber');  
    }
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

      if (data?.orderID != null) {
        setOrderID(data?.orderID)
      }
    } catch (error) {
      console.error("Error fetching order IDs:", error);
    }
  };

  const changeOrderStatus = async () => {

    // first check payment , if payment is done then order statuus is completed

    if (orderID == null || orderID == undefined) {
      showOrderList(false)
      return
    };

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
      {/* <List /> */}
      {showOrderList ? <List /> : <></>}
    </div>
  );
}

export default OrderPlaced;
