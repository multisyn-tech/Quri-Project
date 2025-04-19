import React from 'react';
import OrderPlacing from './OrderPlacing';
import Cart from './Cart';
import { useSelector } from 'react-redux';

const OrderDetails = () => {
  const cartItems = useSelector((state) => state.orders.cartItems);

  return (
    <div className="min-h-screen flex flex-col">
      <Cart cartItems={cartItems} />
      <OrderPlacing />
    </div>
  );
};

export default OrderDetails;
