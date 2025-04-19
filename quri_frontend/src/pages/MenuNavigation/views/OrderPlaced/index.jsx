import React from 'react';
import List from './OrderPlacingData/List';
import Loader from './OrderPlacingData/Loader';

const OrderPlaced = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Loader should take full screen height when loading */}
      <Loader />

      {/* Space between loader and list content */}
      <div className='bg-gray-100 flex-grow'>
        <br />
      </div>

      {/* List component will fill the remaining space */}
      <List />
    </div>
  );
}

export default OrderPlaced;
