import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Input } from 'antd';
import OrdersTable from './AllOrdersData/OrdersTable';
import { fetchAllRestaurantOrders } from '../../../features/SuperAdmin/superAdminSlice';


const { Search } = Input;

const AllOrders = () => {
    const dispatch = useDispatch();
    const [filteredOrders, setFilteredOrders] = useState([]);
    const { allOrders = [], loading, error } = useSelector((state) => state.superOrder);
    //console.log("All Orders: ", allOrders);

    useEffect(() => {
        dispatch(fetchAllRestaurantOrders());
    }, [dispatch]);

    // Update filtered menus when original data changes
    useEffect(() => {
        setFilteredOrders(allOrders);
    }, [allOrders]);


    const onSearch = (e) => {
        const searchValue = e.target.value.toLowerCase().trim();

        // Filter restaurants based on name dynamically
        const filteredData = allOrders?.filter(restaurant => {
            const name = restaurant?.RestaurantName?.toLowerCase() || '';
            return name.includes(searchValue);
        }) || []; // Fallback to an empty array if allOrders is undefined

        // Log the filtered data
        //  console.log("Filtered Data:", filteredData);

        setFilteredOrders(filteredData); // Update the state with filtered results
    };




    return (
        <div className='w-full min-h-screen mt-5'>
            <Card className="dark:bg-gray-900">
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
            <Card className="dark:bg-gray-900 mt-5">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : filteredOrders.length === 0 ? (
                    <p className='text-center text-lg'>No matching orders found</p>
                ) : (
                    <OrdersTable dataSource={filteredOrders} />
                )}
                
            </Card>
        </div>
    )
}

export default AllOrders;