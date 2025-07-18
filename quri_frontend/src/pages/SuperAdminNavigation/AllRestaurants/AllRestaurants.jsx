import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllRestaurants } from '../../../features/restaurants/restaurantSlice.jsx';
import { Card, Button, Input } from 'antd';
import TableComponent from './AllRestaurantsData/TableComponent';
import AddRestaurantData from './AllRestaurantsData/AddRestaurantData.jsx';


const { Search } = Input;


const AllRestaurants = () => {

    console.log("all rest from s.admin")

    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const { restaurants, loading,error } = useSelector(state => state.restaurants);
    // console.log("This is a restaurant: ",restaurants);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllRestaurants()); // Fetch all restaurants when component mounts
    }, [dispatch]);

    // Update filtered restaurants when original data changes
    useEffect(() => {
        setFilteredRestaurants(restaurants);
    }, [restaurants]);


    const showModal = () => {
        setIsModalVisible(true); // Open the modal
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Close the modal
    };

    const handleAddRestaurant = (restaurantData) => {
        setConfirmLoading(true);
        dispatch(createRestaurant(restaurantData))
            .unwrap()
            .then(() => {
                // After successfully adding, fetch the latest restaurants list
                dispatch(fetchAllRestaurants());
            })
            .catch((error) => {
                console.error('Failed to add restaurant:', error);
            })
            .finally(() => {
                setConfirmLoading(false);
                setIsModalVisible(false); // Close the modal
            });
    };


    const onSearch = (e) => {
        const searchValue = e.target.value.toLowerCase().trim();

        // Filter restaurants based on name or email (username) dynamically
        const filteredData = restaurants.filter(restaurant => {
            const name = restaurant.RestaurantName?.toLowerCase() || restaurant.restaurantName?.toLowerCase() || ''; // Handle both variations of RestaurantName
            const email = restaurant.Username?.toLowerCase();
            return name.includes(searchValue) || email.includes(searchValue);
        });

        setFilteredRestaurants(filteredData); // Update the state with filtered results
    };



    return (
        <div className='w-full min-h-screen mt-5'>
            <Card className="dark:bg-gray-900 ">
                <div className="flex items-center justify-between w-full">
                    <div className="w-full flex-grow">
                        <Search
                            placeholder="Search by name or email"
                            allowClear
                            enterButton="Search"
                            size="large"
                            onChange={onSearch}
                        />
                    </div>
                    <div className="flex justify-end w-full">
                        <Button
                            type="primary"
                            className="w-1/2"
                            shape="default"
                            onClick={showModal}
                        >
                            Add Restaurant
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Table Component */}
            <Card className="dark:bg-gray-900 mt-5">
                   <TableComponent dataSource={filteredRestaurants} loading={loading}/>
            </Card>

            {/* AddRestaurantData modal */}
            <AddRestaurantData
                title="Add Restaurant"
                open={isModalVisible}
                confirmLoading={loading}
                handleCancel={handleCancel}
                handleOk={handleAddRestaurant}
            />
        </div>
    );
}

export default AllRestaurants;
