import React from 'react';
import { Box, Card, CardContent, Typography, Grid, CardMedia, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart, updateItemQuantity } from '../../../../features/orders/orderSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.orders.cartItems);
  const totalPrice = useSelector((state) => state.orders.totalPrice);
console.log(cartItems);
  const handleAdd = (item) => {
    dispatch(addItemToCart({ item, quantity: 1 }));
  };

  const handleRemove = (MenuID) => {
    const existingItem = cartItems.find(cartItem => cartItem.MenuID === MenuID);
    if (existingItem.quantity === 1) {
      dispatch(removeItemFromCart(MenuID));
    } else {
      dispatch(updateItemQuantity({ MenuID, quantity: existingItem.quantity - 1 }));
    }
  };

  return (
    <section className="p-4 flex-grow overflow-y-auto">
   
      <Grid container spacing={2} className="mt-4">
        {cartItems.map((item) => (
          <Grid item xs={12} key={item.MenuID}>
            <Card className="flex" sx={{ boxShadow: "none" }}>
              <CardMedia
                component="img"
                sx={{ width: 100, objectFit: 'fill' }}
                image={item.Image}
                alt={item.ItemName}
              />
              <CardContent className="flex flex-col flex-grow">
                <Typography component="div" variant="h6" fontSize={16} sx={{ color: '#3E4462' }} fontWeight={600}>
                  {item.ItemName}
                </Typography>
                <Box className="flex space-x-4">
                  <Typography variant="body2" color="text.secondary" fontSize={12} fontWeight={400}>
                    AED {item.Price}
                  </Typography>
                  <Typography variant="body2" color="#CACACA" style={{ textDecoration: 'line-through' }} fontSize={12} fontWeight={400}>
                    AED {((item.Price * 1.2).toFixed(2))}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                  aria-label="remove"
                  sx={{
                    backgroundColor: '#e0e0e0',
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                      color: 'white'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#e0e0e0',
                      color: 'white',
                    },
                  }}
                  onClick={() => handleRemove(item.MenuID)}
                >
                  <RemoveIcon />
                </IconButton>
                <Box
                  sx={{
                    p: 1,
                    border: '1px solid white',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F8F5F2',
                    color: '#3E4462',
                    minWidth: '30px'
                  }}>
                  <Typography variant="body2" sx={{ mx: 1 }} >
                    {item.quantity}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="add"
                  sx={{
                    backgroundColor: '#FF7B02',
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#FF7B02',
                      color: 'white'
                    },
                  }}
                  onClick={() => handleAdd(item)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default Cart;
