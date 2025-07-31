import React, { useMemo, useState } from 'react';
import { Card, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../../../../features/orders/orderSlice';
import { format } from 'date-fns';

const OrderPlacing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.orders.cartItems);
  // const orDD = useSelector((state) => state.orders.orders);
  const menu = useSelector((state) => state.menus.menu);
  const TableID = menu && menu.length > 1 ? menu[1].TableID : null;
  const RestaurantID = menu && menu.length > 0 ? menu[0].RestaurantID : null;

const [tID, setTID] = useState(menu && menu.length > 1 ? menu[1].TableID : null)


  console.log('cartItems::', menu)
  const getTotalItems = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };
  // shi

  const getTotalPrice = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    const totalPrice = cartItems.reduce((acc, item) => acc + item.Price * item.quantity, 0);
    const totalItems = getTotalItems();
    const discount = totalItems >= 5 ? 5 : 0;
    return (totalPrice - discount).toFixed(2);
  };

  const totalItems = getTotalItems();
  const totalPrice = useMemo(() => getTotalPrice(), [cartItems]);

  const [loading, setLoading] = useState(false)

  const handlePlaceOrder = () => {
    const orderData = {
      RestaurantID: RestaurantID || 0,
      CustomerID: null,
      TotalAmount: totalPrice,
      OrderDate: format(new Date(), 'MM-dd-yyyy'),
      TableID: TableID,
      OrderDetails:cartItems
      
    };

    console.log('Placing order with data::', orderData); // Debugging statement

    dispatch(addOrder(orderData));
    
    // navigate('/quri/menu/orderPlaced');

   
  };

  // if (!cartItems || cartItems.length === 0 || RestaurantID === null || TableID === null) {
  //   return <div>Loading order details...</div>;
  // }

  return (
    <section className="flex flex-col w-full">
      <div className="">
        <Card className="p-4">
          <Typography variant="body1" marginLeft={1} sx={{ color: '#3E4462', fontWeight: 'bold' }}>
            {`Awesome! You saved AED ${totalItems >= 5 ? '5' : '0'}.`}
          </Typography>
          <Typography variant="body2" marginLeft={1} sx={{ color: '#FF7B02' }}>
            {`Now, Add ${totalItems < 5 ? 5 - totalItems : '0'} More to Save AED 5`}
          </Typography>
          <Button variant="contained" className="w-full mt-4"
            sx={{
              width: '100%',
              mt: 4,
              background: 'linear-gradient(90deg, #0F84F6 0.91%, #88F2FF 100.96%)',
              color: 'white',
              borderRadius: '0.5rem',
              textTransform: 'capitalize',
            }}
            onClick={handlePlaceOrder}
            disabled={totalItems === 0}
          >
            <div className='flex flex-row items-center justify-between w-full'>
              <span>{`${totalItems} items`}</span>
              <span>Place Order</span>
              <span>{`AED ${totalPrice}`}</span>
            </div>
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default OrderPlacing;
