import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TotalItems from './TotalItems';
import AddingTip from './AddingTip';
import AddingNote from './AddingNote';
import Fee from './Fee';
import BillProceeding from './BillProceeding';
import { viewOrder } from '../../../features/orders/orderSlice';
import { QURI_SERVICE_FEE } from "../../../config/constants";

const TotalAmount = () => {

  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orders?.order?.order?.orderDetails || []);


  const tableId = useSelector((state) => state.qrcode.qrCodeDetails.data.TableID);
  useEffect(() => {
    dispatch(viewOrder(tableId)); // Dispatching the viewOrder action on component mount
  }, [dispatch]);

  const VAT = 14.3;

  const [isQuriFeeVisible, setIsQuriFeeVisible] = useState(false);
  const [isBillVisible, setIsBillVisible] = useState(false);


  const calculateSubtotal = () => {
    return orderDetails.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + QURI_SERVICE_FEE;


  const quriServiceFee = () => {
    setIsQuriFeeVisible(true);
    setIsBillVisible(false);
  }

  const closeQuriFee = () => {
    setIsQuriFeeVisible(false);
  }

  const openBill = () => {
    setIsBillVisible(true);
    setIsQuriFeeVisible(false);
  };

  const closeBill = () => {
    setIsBillVisible(false);
  }

  return (
    <>

      <AddingTip
        total={total}
        onShowBill={openBill}
      />

      <AddingNote/>

    </>
  );
}

export default TotalAmount;
