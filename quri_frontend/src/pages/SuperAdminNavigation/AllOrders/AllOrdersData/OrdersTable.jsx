import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ConfigProvider, Table, Button, Modal, Carousel } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';
import ModalOrders from './ModalOrders';


const OrdersTable = ({ dataSource }) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleOpenModal = (orders) => {
        setSelectedOrders(orders);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

   // Get restaurant orders from Redux store
   const restaurantOrders = useSelector((state) => state.superOrder?.allOrders || []);
   //console.log("Restaurant Order: ",restaurantOrders)


    const columns = [
        {
            title: 'Restaurant ID',
            dataIndex: 'RestaurantID',
            key: 'RestaurantID',
        },
        {
            title: 'Restaurant Name',
            dataIndex: 'RestaurantName',
            key: 'RestaurantName',
        },
        {
            title: 'View Orders',
            key: 'action',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        icon={<EyeTwoTone />}
                        style={{ border: 'none', background: 'transparent' }}
                        size={'large'}
                        onClick={() => handleOpenModal(record.orders)}
                    />
                </div>
            ),
        },
    ];

    const headerStyle = {
        backgroundColor: '#374151', // Tailwind bg-gray-800
        color: '#f9fafb', // Tailwind text-white
    };


    // Add the `key` property to each item in `dataSource`
    const dataWithKeys = restaurantOrders.map((restaurant) => ({
        key: restaurant.RestaurantID,
        RestaurantID: restaurant.RestaurantID,
        RestaurantName: restaurant.RestaurantName,
        orders: restaurant.orders, // Extract the orders array
    }));

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

            {/* Modal for viewing orders */}
            <Modal
                title="All Orders"
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={1000}
            >
             <ModalOrders orders={selectedOrders}/>
            </Modal>

        </div>
    )
}

export default OrdersTable;