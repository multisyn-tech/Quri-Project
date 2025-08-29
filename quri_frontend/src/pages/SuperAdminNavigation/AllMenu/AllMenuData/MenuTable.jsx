import React, { useState } from 'react';
import { ConfigProvider, Table, Button, Modal, Carousel } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';
import MenuList from './MenuList';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MenuTable = ({ dataSource,refetchMenus }) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    // Handle table pagination
    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    // Handle viewing the restaurant's menu (for the carousel)
    const handleViewMenu = (record) => {
        setSelectedRestaurant(record); // Select the restaurant for viewing its menu
        setIsModalVisible(true);
    };

    // Handle editing the restaurant's menu
    const handleEditMenu = (record) => {
        setSelectedRestaurant(record); // Select the restaurant for editing its menu
        setIsEditModalVisible(true);
    };

    // Handle updating the menu after editing
    const handleUpdateMenu = (updatedMenu) => {
        setSelectedRestaurant((prevRestaurant) => ({
            ...prevRestaurant,
            menus: prevRestaurant.menus.map((menu) =>
                menu.MenuID === updatedMenu.MenuID ? updatedMenu : menu
            ),
        }));
        setIsEditModalVisible(false); // Close modal after update
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsModalVisible(false);
    };

    // Define the table columns
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
            title: 'View Menu',
            key: 'action',
            render: (text, record) => (
                <Button
                    icon={<EyeTwoTone />}
                    style={{ border: 'none', background: 'transparent' }}
                    size={'large'}
                    onClick={() => handleViewMenu(record)}
                />
            ),
        },
        {
            title: 'Edit Menu',
            key: 'action',
            render: (text, record) => (
                <Button
                    type='primary'
                    size={'large'}
                    onClick={() => handleEditMenu(record)}
                >
                    Click to edit menu
                </Button>
            ),
        },
    ];

    // Add keys to each restaurant item in dataSource for proper rendering
    const dataWithKeys = dataSource.map((item) => ({
        key: item.RestaurantID,
        ...item,
    }));

    return (
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Carousel: {
                            arrowOffset: 10,
                            arrowSize: 18,
                            dotGap: 10,
                        },
                    },
                }}
            >
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
                        onHeaderRow={() => ({ style: { backgroundColor: '#374151', color: '#f9fafb' } })}
                        bordered={true}
                        rowHoverable={false}
                    />

                    {/* Modal to display menu items (for the View Menu feature) */}
                    <Modal
                        title="Restaurant Menu"
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={800}
                    >
                        <Carousel arrows dotPosition="bottom" infinite={false} autoplay={false}>
                            {selectedRestaurant?.menus?.map((menu) => (
                                <div key={menu.MenuID}>
                                    <img
                                        src={menu.Image.startsWith('food-uploads/') ? `${BASE_URL}/${menu.Image}` : menu.Image}
                                        alt={menu.ItemName}
                                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                    />
                                    <div className="text-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">Item Name: {menu.ItemName}</h2>
                                        <p className="text-lg text-gray-600">Description: {menu.ItemDescription}</p>
                                        <p className="text-xl font-semibold text-gray-900">Price: ${menu.Price}</p>
                                        <p
                                            className={`font-bold text-lg ${menu.MenuStatus === 'active' ? 'text-green-500' : 'text-red-500'}`}
                                        >
                                            Status: {menu.MenuStatus === 'active' ? 'Available' : 'Unavailable'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </Modal>

                    {/* Modal for editing the restaurant's menu */}
                    <Modal
                        title="Edit Menu"
                        open={isEditModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={600}
                    >
                        {/* Pass the selected restaurant's menu items to MenuList */}
                        {selectedRestaurant && (
                            <MenuList
                                menuItems={selectedRestaurant.menus}
                                onUpdateMenu={() => console.log('Menu updated')} 
                                refetchMenus={refetchMenus}
                            />
                        )}
                    </Modal>
                </div>
            </ConfigProvider>
        </>
    );
};

export default MenuTable;
