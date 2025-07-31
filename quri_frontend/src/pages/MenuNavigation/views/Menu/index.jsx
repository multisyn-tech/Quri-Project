import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenuItems from './MenuItems';
import { fetchMenuByTableID } from '../../../../features/menu/menuSlice';
import { addItemToCart, removeItemFromCart, updateItemQuantity, resetCartItems, resetRejectedOrderItems } from '../../../../features/orders/orderSlice';


const Menu = () => {
  const dispatch = useDispatch();
  // const tableID = useSelector((state) => state.qrcode.qrCodeDetails.data?.TableID); // Optional chaining for safety
  // const menu = useSelector((state) => state.menus.menu); // Get the entire menu object
  // const menuItems = menu ? menu.menuItems : []; // Safely access menuItems
  // const restaurantDetails = menu ? menu.restaurantDetails : {}; // Safely access restaurantDetails
  // const menuStatus = useSelector((state) => state.menus.loading);
  // const menuError = useSelector((state) => state.menus.error);
  // const cartItems = useSelector((state) => state.orders.cartItems);
  // const orderStatus = useSelector((state) => state.orders.status);
  // const orderError = useSelector((state) => state.orders.error);

  // useEffect(() => {
  //   if (tableID) {
  //     dispatch(fetchMenuByTableID(tableID));
  //   }
  // }, [dispatch, tableID]);

  // const handleAdd = (item) => {
  //   dispatch(addItemToCart({ item, quantity: 1 }));
  // };

  // const handleRemove = (MenuID) => {
  //   const existingItem = cartItems.find(cartItem => cartItem.MenuID === MenuID);
  //   if (existingItem.quantity === 1) {
  //     dispatch(removeItemFromCart(MenuID));
  //   } else {
  //     dispatch(updateItemQuantity({ MenuID, quantity: existingItem.quantity - 1 }));
  //   }
  // };

  // const handleUpdateQuantity = (MenuID, quantity) => {
  //   dispatch(updateItemQuantity({ MenuID, quantity }));
  // };

  // if (menuStatus === 'loading' || orderStatus === 'loading') {
  //   return <div>Loading...</div>;
  // }

  // if (menuStatus === 'failed') {
  //   return <div>Error: {menuError}</div>;
  // }

  // if (orderStatus === 'failed' && orderError) {
  //   return <div>Error: {orderError}</div>;
  // }



  return (
    <div className="flex">

      <MenuItems />


    </div>
  );
};

export default Menu;
