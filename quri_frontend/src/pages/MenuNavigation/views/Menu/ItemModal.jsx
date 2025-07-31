import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Button, Image } from 'antd-mobile';
import { SlArrowDown } from "react-icons/sl";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { addItemToCart, removeItemFromCart, updateItemQuantity } from '../../../../features/orders/orderSlice';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ItemModal = ({ visible, item, onClose }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.orders.cartItems); // Get cart items from Redux
    const [quantity, setQuantity] = useState(1); // Default quantity is 1

    // Check if the item is already in the cart, and set the correct quantity
    useEffect(() => {
        const existingItem = cartItems.find(cartItem => cartItem.MenuID === item?.MenuID);
        if (existingItem) {
            setQuantity(existingItem.quantity); // Set the quantity to the existing cart item quantity
        } else {
            setQuantity(1); // Default to 1 when item is selected and not in the cart
        }
    }, [item, cartItems]);

    const incrementQuantity = () => setQuantity(quantity + 1); // Increment quantity

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1); // Decrease quantity but not below 1
        } else if (quantity === 1) {
            // If the quantity is 1 and decrement is pressed, remove the item from the cart
            dispatch(removeItemFromCart(item.MenuID));
            setQuantity(1); // Reset quantity to 1 after removing the item
        }
    };

    // Add item to the cart or update the quantity if it's already in the cart
    const handleAddOrUpdateItem = () => {

        const existingItem = cartItems.find(cartItem => cartItem.MenuID === item.MenuID);
            
        if (existingItem) {
            // If item exists in cart, update the quantity
            dispatch(updateItemQuantity({ MenuID: item.MenuID, quantity }));
        } else {
            // If item is not in cart, add it
            dispatch(addItemToCart({ item, quantity }));
        }

        onClose(); // Close the modal after adding/updating the cart
    };

    if (!visible || !item) return null; // Ensure the modal is rendered only when visible and item is provided


    return (
        <div className="fixed inset-x-0 bottom-0 rounded-xl bg-white shadow-2xl z-50">
            <div className="relative w-full">
                {/* Item Image */}
                <Image
                    lazy
                    src={item.Image.startsWith('food-uploads/')
                        ? `${BASE_URL}/${item.Image}`
                        : item.Image
                    }
                    fit="cover"
                    className="w-full h-60 rounded-xl rounded-b-none"
                />
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
                >
                    <SlArrowDown size={15} className="text-gray-800" />
                </button>
            </div>

            {/* Item Details */}
            <div className="p-2 ml-2">
                <div className="flex justify-start items-center">
                    <h3 className="font-normal text-2xl">{item.ItemName}</h3>
                    {item.discount && (
                        <Badge content={`${item.discount}% Off`} style={{ marginLeft: 8 }} />
                    )}
                </div>
                <p className="text-xs text-[#ACACAC] mb-2 font-light my-2">{item.ItemDescription}</p>
                <p className="text-xs text-[#ACACAC] font-light my-2">{item.Price} AED</p>

                {/* Quantity control */}
                <div className='flex flex-row justify-between'>
                    <div className="flex items-center justify-between p-2 bg-white shadow-lg rounded-full px-2">
                        {/* Decrement quantity */}
                        <Button
                            onClick={decrementQuantity}
                            className="flex items-center justify-center w-7 h-7 text-white bg-black rounded-full"
                            disabled={quantity <= 0} // Disable decrement when quantity is 0
                        >
                            <FaMinus size={10}/>
                        </Button>
                        <span className="px-4 text-lg">{quantity}</span>
                        {/* Increment quantity */}
                        <Button
                            onClick={incrementQuantity}
                            className="flex items-center justify-center w-7 h-7 text-white bg-black rounded-[30px]"
                        >
                            <FaPlus size={10}/>
                        </Button>
                    </div>

                    {/* Add to cart / Update item */}
                    <div className="flex items-center justify-center px-2">
                        <Button
                            shape="rounded"
                            size="large"
                            className="w-full px-6 py-3 bg-black text-white rounded-full text-sm"
                            onClick={handleAddOrUpdateItem} // Add or update item in cart
                            disabled={quantity === 0} // Disable button if quantity is 0
                        >
                            Add to your selection
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ItemModal;
