import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TotalItems from './TotalItems';
import AddingTip from './AddingTip';
import Fee from './Fee';
import BillProceeding from './BillProceeding';
import { viewOrder } from '../../../features/orders/orderSlice';

const TotalAmount = () => {

  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.order);
  const tableId = useSelector((state) => state.qrcode.qrCodeDetails.data.TableID);
  useEffect(() => {
    dispatch(viewOrder(tableId)); // Dispatching the viewOrder action on component mount
  }, [dispatch]);




  const QURI_SERVICE_FEE = 0.99;
  const VAT = 14.3;

  const [isQuriFeeVisible, setIsQuriFeeVisible] = useState(false);
  const [isBillVisible, setIsBillVisible] = useState(false);

  const calculateSubtotal = () => {
    if (!order.orderDetails) {
      return 0;
    }
    return order.orderDetails.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + QURI_SERVICE_FEE + VAT;

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

    </>
  );
}

export default TotalAmount;
