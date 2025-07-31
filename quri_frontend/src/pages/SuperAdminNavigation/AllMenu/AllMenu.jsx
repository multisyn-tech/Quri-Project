import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Input } from 'antd';
import MenuTable from './AllMenuData/MenuTable';
import { fetchAllRestaurantsMenus,fetchMenuByRestaurantID } from '../../../features/SuperAdmin/superAdminSlice';

const { Search } = Input;

const AllMenu = () => {
  const dispatch = useDispatch();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const { superMenus, loading, error } = useSelector((state) => state.superMenus);

  // Check if superMenus exists and is an array before accessing RestaurantID
  
    const restaurantIDs = superMenus.map(restaurant => restaurant.RestaurantID);
  //  console.log(restaurantIDs)
 

  useEffect(() => {
    dispatch(fetchAllRestaurantsMenus());
  }, [dispatch]);

  // Update filtered menus when original data changes
  useEffect(() => {
    setFilteredRestaurants(superMenus);
  }, [superMenus]);


 // Function to refetch the restaurant menus
 const refetchMenus = () => {
  dispatch(fetchAllRestaurantsMenus());
};


  const onSearch = (e) => {
    const searchValue = e.target.value.toLowerCase().trim();

    // Log the current search value
    // console.log("Search value:", searchValue);

    // Filter restaurants based on name dynamically
    const filteredData = superMenus.filter(restaurant => {
      const name = restaurant.RestaurantName?.toLowerCase() || restaurant.restaurantName?.toLowerCase() || ''; // Handle both variations of RestaurantName

      // Log the restaurant names and what they're being compared to
      // console.log("Restaurant name:", name);
      // console.log("Does it match?", name.includes(searchValue));

      return name.includes(searchValue);
    });

    // Log the filtered data
    // console.log("Filtered Data:", filteredData);

    setFilteredRestaurants(filteredData); // Update the state with filtered results
  };


  return (
    <div className='w-full min-h-screen mt-5'>
      <Card className="dark:bg-gray-900 ">

        <div className="flex items-center justify-between w-full">
          <div className="w-1/2 ">
            <Search
              placeholder="Search by name"
              allowClear
              enterButton="Search"
              size="large"
              onChange={onSearch}
            />
          </div>
        </div>
      </Card>
      {/*All Restaurants Menu  */}

      <Card className="dark:bg-gray-900 mt-5">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : filteredRestaurants.length === 0 ? (
          <p className='text-center text-lg'>No matching restaurants found</p>
        ) : (
          <MenuTable dataSource={filteredRestaurants} refetchMenus={refetchMenus} />
        )}
      </Card>
    </div>
  )
}

export default AllMenu;