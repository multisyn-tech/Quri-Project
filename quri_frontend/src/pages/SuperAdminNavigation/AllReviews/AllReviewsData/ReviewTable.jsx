import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ConfigProvider, Table, Button, Modal, Carousel } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';


const ReviewTable = () => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });


    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

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
    <div></div>
  )
}

export default ReviewTable;