import React from 'react';
import FoodLoader from '../../../assets/Food/loader.gif';


const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <img src={FoodLoader} alt="Loader" className="w-full" />
    </div>
  );
}

export default Loader;
