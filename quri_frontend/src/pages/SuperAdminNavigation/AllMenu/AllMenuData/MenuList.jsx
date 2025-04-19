import React, { useState } from 'react';
import { Button, Card, List, Modal } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import SuperEditMenu from './SuperEditMenu';
import 'antd/dist/reset.css';

const MenuList = ({ menuItems, onUpdateMenu,refetchMenus }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleEdit = (record) => {
        setSelectedItem(record);
        console.log(record)
        setIsModalVisible(true);
    };

    const handleDelete = (record) => {
        console.log('Deleting:', record);
        // Add your delete functionality here
    };

    const handleUpdate = (updatedItem) => {
        onUpdateMenu(updatedItem); // Pass updated menu item to parent component
        setIsModalVisible(false); // Close modal
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    if (!menuItems || menuItems.length === 0) {
        return <p>No menu items available for this restaurant.</p>;
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Menu List</h1>
            <div className="max-h-96 overflow-y-auto overflow-x-hidden">
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={menuItems}
                    renderItem={(item) => (
                        <List.Item>
                            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900 mb-1">Menu ID: <span className="text-gray-700">{item.MenuID}</span></p>
                                        <p className="text-xl font-bold text-gray-900">Item Name: <span className="text-gray-800">{item.ItemName}</span></p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <Button
                                            icon={<EditTwoTone />}
                                            type="text"
                                            size="large"
                                            onClick={() => handleEdit(item)}
                                        />
                                        {/* <Button
                                            icon={<DeleteTwoTone twoToneColor="red" />}
                                            type="text"
                                            size="large"
                                            onClick={() => handleDelete(item)}
                                        /> */}
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
            <Modal
                title="Edit Menu Item"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered={true}
            >
                {selectedItem && (
                    <SuperEditMenu selectedItem={selectedItem} onUpdate={handleUpdate} refetchMenus={refetchMenus} />
                )}
            </Modal>
        </div>
    );
};

export default MenuList;