import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button ,Modal, message} from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { fetchRestaurantById,resetDeleteSuccess,deleteRestaurantById,fetchAllRestaurants } from '../../../../features/restaurants/restaurantSlice';
import EditRestaurantsData from './EditRestaurantsData';

const TableComponent = ({ dataSource }) => {
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
    const [confirmLoading, setConfirmLoading] = useState(false); // Loading state for modal
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });


    const dispatch = useDispatch();
    const { restaurant,deleteSuccess, loading } = useSelector(state => state.restaurants);



    useEffect(() => {
        if (deleteSuccess) {
            message.success('Restaurant deleted successfully!');
            dispatch(resetDeleteSuccess());
            dispatch(fetchAllRestaurants()); // Optionally, fetch updated restaurant list
        }
    }, [deleteSuccess, dispatch]);


   
    const showModal = (restaurantId) => {
        if (restaurantId) {
            dispatch(fetchRestaurantById(restaurantId.toString())); // Convert restaurantId to a string if needed
            setIsModalVisible(true); // Open the modal
        } else {
            console.error('Invalid restaurantId:', restaurantId);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Close the modal
    };
 
    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

     // Add the `key` property to each item in `dataSource`
     const dataWithKeys = dataSource.map((item) => ({
        key: item.RestaurantID,
        RestaurantID: item.RestaurantID,
        restaurantName: item.RestaurantName || item.restaurantName, // Normalize field names
        Username: item.Username,
        status: item.status.toLowerCase(), // Standardize status values
    }));

    const handleDelete = (restaurantId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this restaurant?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            centered:true,
            onOk() {
                return dispatch(deleteRestaurantById(restaurantId))
                    .unwrap()
                    .then(() => {
                        console.log(`Restaurant with ID ${restaurantId} deleted successfully.`);
                    })
                    .catch((error) => {
                        console.error('Failed to delete the restaurant:', error);
                    });
            },
            onCancel() {
                console.log('Delete action cancelled.');
            },
        });
    };


    const columns = [
        {
            title: 'Restaurant ID',
            dataIndex: 'RestaurantID',
            key: 'RestaurantID',
        },
        {
            title: 'Restaurant Name',
            dataIndex: 'restaurantName',
            key: 'restaurantName',
        },
        {
            title: 'Email',
            dataIndex: 'Username',
            key: 'Username',
        },
        {
            title: 'Restaurant Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span style={{ color: text === 'active' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        icon={<EditTwoTone />}
                        style={{ border: 'none', background: 'transparent' }}
                        size={'large'}
                        onClick={() => showModal(record.RestaurantID)}
                    />
                    <span style={{ margin: '0 8px', color: '#6b7280' }}> / </span>
                    <Button
                        icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
                        onClick={() => handleDelete(record.RestaurantID)}
                        style={{ border: 'none', background: 'transparent' }}
                        size={'large'}
                    />
                </div>
            ),
        },
    ];


    const headerStyle = {
        backgroundColor: '#374151', // Tailwind bg-gray-800
        color: '#f9fafb', // Tailwind text-white
    };

    return (
        <div className="dark:bg-gray-900 dark:text-white">
            <Table
                dataSource={dataWithKeys}
                columns={columns}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    onChange: handleTableChange,
                }}
                className="dark:bg-gray-900 dark:text-white"
                rowClassName={() => 'dark:bg-gray-900 dark:text-white'}
                tableLayout="fixed"
                onHeaderRow={() => ({ style: headerStyle })} // Apply dark mode header styles
                bordered={true}
                rowHoverable={false}
            />

            {/* Edit Restaurant Modal */}
            <EditRestaurantsData
                title="Edit Restaurant"
                open={isModalVisible}
                handleOk={() => {}}
                confirmLoading={confirmLoading}
                handleCancel={handleCancel}
                restaurant={restaurant}
            />
        </div>
    );
};

export default TableComponent;
