import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Input } from 'antd';

const { Search } = Input;


const AllReviews = () => {
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
                        //  onChange={onSearch}
                        />
                    </div>
                </div>
            </Card>


            {/* Reviews Table */}
            <Card className="dark:bg-gray-900 mt-5">
                To be continued...
            </Card>
        </div>
    )
}

export default AllReviews;