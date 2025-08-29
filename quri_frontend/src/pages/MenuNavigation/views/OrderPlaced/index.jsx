import React, { useState, useEffect } from 'react';
import List from './OrderPlacingData/List';
import Loader from './OrderPlacingData/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { resetCartItems } from '../../../../features/orders/orderSlice';
import { reset } from '../../../../features/orders/orderSlice';
import { resetActivity } from '../../../../features/activity/activitySlice';
import { getDetailsOfOrders, getDetailsOfRejectedOrders } from '../../../../features/orders/orderSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const BASE_URl = import.meta.env.VITE_API_BASE_URL;
import storeHelpers from '../../../../components/utility/storeStage';

const OrderPlaced = () => {

  const [orderID, setOrderID] = useState(null);
  const [showOrderList, setShowOrderList] = useState(true);
  const [orderDetailIds, setOrderDetailIds] = useState([]);
  const [lastOrderStatus, setLastOrderStatus] = useState('');


  const dispatch = useDispatch();
  const navigate = useNavigate();



  const handleResetCart = () => {
    dispatch(resetCartItems()); // Dispatch to reset the cart
  };


  // let orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);
  // let orderDetailIds = orderDetails.map(item => item?.OrderDetailID);

  // if (orderDetails.length == 0) {
  //   orderDetails = useSelector((state) => state.orders?.orders || []);
  //   orderDetailIds = orderDetails[orderDetails.length - 1]?.OrderID;
  // }


  const { storeStage } = storeHelpers;
  const orderDetailsFromSingleOrder = useSelector((state) => state.orders?.order?.order?.orderDetails || []);

  const order_id = useSelector((state) => state.orders?.order?.order?.OrderID || []);

  const allOrders = useSelector((state) => state.orders?.orders || []);
  const logs = useSelector((state) => state.activity);
  const { getOrderStatus } = storeHelpers;

  // console.log("latest order id ->", order_id)

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
  }, [orderDetailsFromSingleOrder, allOrders]);


  useEffect(() => {
    storeStage('paid')
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getDetailsOfOrders(order_id)).then((res) => {
        const orderStatus = res.payload;
        // console.log(orderStatus)
        setLastOrderStatus(orderStatus.orderDetails.Status);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [order_id, dispatch]);


  useEffect(() => {
    const interval = setInterval(() => {
      console.log("lastOrderStatus:", lastOrderStatus)
      if (lastOrderStatus == "Delivered" || lastOrderStatus == "delivered"
        || lastOrderStatus == "Completed" || lastOrderStatus == "completed") {
        storeStage('completed')
        dispatch(resetActivity());
        localStorage.removeItem('user_id');
        localStorage.removeItem('tableId');
        handleResetCart();
        navigate('/quri/menu/home');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lastOrderStatus, navigate]);




  useEffect(() => {
    getOrderID();
    // handleResetCart()
    removePlatNumberFromScreen()

  }, [orderDetailIds]);




  // useEffect(() => {
  //   if (
  //     logs.stages.includes("completed") &&
  //     logs.userId &&
  //     logs.tableId
  //   ) {
  //     dispatch(resetActivity());
  //     localStorage.removeItem('user_id')
  //   }
  // }, [logs.stages, logs.userId, logs.tableId]);


  const removePlatNumberFromScreen = () => {
    const storedPlateNumber = localStorage.getItem('plateNumber');
    const userNote = localStorage.getItem('userNote');
    if (storedPlateNumber) {
      localStorage.removeItem('plateNumber');
    }
    if (userNote) {
      localStorage.removeItem('userNote');
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
        body: JSON.stringify({ newStatus: 'Paid' })
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
