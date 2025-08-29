import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';
import ModalOrderDetails from './ModalOrderDetails'; // Import ModalOrderDetails

const ModalOrders = ({ orders }) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false); // State to control details modal visibility
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null); // Store selected order details

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleOpenDetailsModal = (orderDetails) => {
        setSelectedOrderDetails(orderDetails); // Set selected order details
        setIsDetailsModalVisible(true); // Open modal
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalVisible(false); // Close modal
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'OrderID',
            key: 'OrderID',
        },
        {
            title: 'Order Date',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
        },
        {
            title: 'Total Amount',
            dataIndex: 'TotalAmount',
            key: 'TotalAmount',
            render: (text) => `AED ${text}`,
        },
        {
            title: 'View Order Details',
            key: 'action',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        icon={<EyeTwoTone />}
                        style={{ border: 'none', background: 'transparent' }}
                        size={'large'}
                        onClick={() => handleOpenDetailsModal(record.orderDetails)} // Open details modal
                    />
                </div>
            ),
        },
    ];

    const dataWithKeys = orders.map((order, index) => ({
        key: index,
        OrderID: order.OrderID,
        OrderDate: order.OrderDate,
        TotalAmount: order.TotalAmount,
        orderDetails: order.orderDetails, // Pass order details
    }));

    return (
        <div>
            <Table
                dataSource={dataWithKeys}
                columns={columns}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    onChange: handleTableChange,
                }}
                 tableLayout="fixed"
                 bordered={true}
            />

            {/* Modal for viewing order details */}
            <Modal
                title="Order Details"
                open={isDetailsModalVisible}
                onCancel={handleCloseDetailsModal}
                footer={null}
                width={800}
            >
                <ModalOrderDetails orderDetails={selectedOrderDetails} />
            </Modal>
        </div>
    );
};

export default ModalOrders;
