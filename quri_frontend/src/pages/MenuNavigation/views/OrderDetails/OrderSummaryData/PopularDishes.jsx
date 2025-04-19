import React, { useState, useEffect } from 'react';
import { Badge, Button, Image, InfiniteScroll } from 'antd-mobile';
import { FaPlus } from "react-icons/fa6";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const PopularDishes = () => {
  const [quantity, setQuantity] = useState(1);
  const [popularDishes, setPopularDishes] = useState([]);
  const incrementQuantity = () => setQuantity(quantity + 1);


  const getPopularDishes = async (req, res) => {
    try {
      const response = await fetch(`${BASE_URL}/restaurant/popular-dishes`);
      if (!response.ok) {
        throw new Error('Failed to fetch popular dishes');
      }

      const dishes = await response.json();
      console.log('Popular Dishes:', popularDishes);

      setPopularDishes(dishes)

    } catch (error) {
      console.error('Error fetching popular dishes:', error);
      return [];
    }
  };


  useEffect(() => {
    getPopularDishes();
  }, []);

  return (
    <>
      <div className='p-2'>
        {/* Header Section */}
        <div className='flex flex-col'>
          <h1 className='text-xl'>Popular dishes at Accents</h1>
          <p className='text-gray-500'>Other customers also tried these dishes</p>
        </div>

        {/* Menu items with horizontal scroll */}
        <div className="overflow-x-auto whitespace-nowrap bg-white shadow-md">
          <div className="flex">
            {popularDishes.length === 0 ? (
              <p className="text-center text-black-500 my-3">No popular dishes found.</p>
            ) : (popularDishes.map((item, index) => (
              <div key={index} className="inline-block w-full p-2">
                <div className="relative flex flex-col">
                  {/* Item Image */}
                  <Image
                    lazy
                    src={item.image}
                    width={200}
                    height={200}
                    fit="cover"
                    className="rounded-xl object-cover"
                  />
                  {/* Button in the bottom-right corner */}
                  <Button
                    onClick={incrementQuantity}
                    className="absolute bottom-14 left-44 p-2.5 rounded-full bg-black text-white"
                  >
                    <FaPlus size={14} />
                  </Button>
                  {/* Item details */}
                  <div className="mt-2 ml-1">
                    <h3 className="text-xl text-black font-normal">{item.name}</h3>
                    <span className="text-sm font-light text-[#444444]">{item.price} AED</span>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </>
  );
}

export default PopularDishes;
