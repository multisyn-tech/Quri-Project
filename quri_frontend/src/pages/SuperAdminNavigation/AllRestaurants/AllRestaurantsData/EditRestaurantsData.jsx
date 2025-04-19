import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Upload, message, Button, Select } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UploadOutlined } from '@ant-design/icons';
import { editRestaurantById, resetEditSuccess, fetchAllRestaurants } from '../../../../features/restaurants/restaurantSlice';
import AsyncModal from './AsyncModal';

const EditRestaurantsData = ({ title, open, handleOk, confirmLoading, handleCancel, restaurant }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const dispatch = useDispatch();
    const { loading, editSuccess, error } = useSelector((state) => state.restaurants);


    useEffect(() => {
        if (open && restaurant) {
            form.resetFields(); // Reset fields to ensure they are empty before setting new values
            form.setFieldsValue({
                Email: restaurant.Username,
                restaurantName: restaurant.RestaurantName,
                restaurantAddress: restaurant.restaurantAddress,
                phoneNumber: restaurant.phoneNumber,
                description: restaurant.description,
                status: restaurant.status ? restaurant.status.toLowerCase() : undefined, // Assuming status values are "Active"/"Inactive"
            });
        }
    }, [restaurant, open, form]);

  

    useEffect(() => {
        if (editSuccess) {
            message.success('Restaurant updated successfully!');
            dispatch(resetEditSuccess());
            handleCancel(); // Close the modal
           dispatch(fetchAllRestaurants()); // Fetch updated restaurant list
        }

        if (error) {
            message.error(`Failed to update restaurant: ${error}`);
        }
    }, [editSuccess, error, dispatch, handleCancel]);



    // Mock upload change handler
    const handleUploadChange = ({ fileList }) => {
        // Check if the latest file has a status of 'done' (upload complete)
        if (fileList.length > 0 && fileList[0].status === 'done') {
            message.success('File uploaded successfully (mocked).');
        }
        setFileList(fileList); // Update the file list state
    };


    // Mock upload action
    const mockUpload = ({ onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok"); // Simulate success after a delay
        }, 1000);
    };


    // Before uploading, validate the file type and size
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG, JPEG, or PNG files!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5; // Limit to 5MB
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
        }
        return isJpgOrPng && isLt5M;
    };

    const onFinish = (values) => {
        const updatedData = new FormData();
        updatedData.append('Username', values.Email);
        updatedData.append('restaurantName', values.restaurantName);
        updatedData.append('restaurantAddress', values.restaurantAddress);
        updatedData.append('phoneNumber', values.phoneNumber);
        updatedData.append('description', values.description);
        updatedData.append('status', values.status);

        if (fileList.length > 0) {
            updatedData.append('image', fileList[0].originFileObj);
        }

        dispatch(editRestaurantById({ restaurantId: restaurant.RestaurantID, updatedData }));
    };

    const handleSubmit = () => {
        form.submit(); // Trigger the onFinish function
    };


    return (
        <AsyncModal
            title={title}
            open={open}
            handleOk={handleSubmit}
            confirmLoading={confirmLoading}
            handleCancel={handleCancel}
        >
            <Form
                form={form}
                name="add-restaurant"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ remember: true }}
            >
                {/* Restaurant Email */}
                <Form.Item
                    label="Email"
                    name="Email"
                    rules={[
                        { required: true, message: 'Please input email!' },
                        { type: 'email', message: 'Please enter a valid email address!' },
                    ]}

                >
                    <Input placeholder="admin123@example.com" />
                </Form.Item>

                {/*  Password */}
                {/* <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please input password!' },
                        { min: 8, message: 'Password must be at least 8 characters long' }
                    ]}
                >
                    <Input.Password placeholder="************" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                </Form.Item> */}


                {/* Restaurant Name */}
                <Form.Item
                    label="Restaurant Name"
                    name="restaurantName"
                    rules={[
                        { required: true, message: 'Please input the restaurant name!' },
                        { min: 3, message: 'Restaurant name must be at least 3 characters' }
                    ]}
                >
                    <Input placeholder="Asian Wok" />
                </Form.Item>

                {/* Restaurant Address */}
                <Form.Item
                    label="Restaurant Address"
                    name="restaurantAddress"
                    rules={[
                        { required: true, message: 'Please input the restaurant address!' },
                        { min: 10, message: 'Address should be at least 10 characters long' }
                    ]}
                >
                    <Input.TextArea placeholder="123 Main St, Springfield, IL 62704" />
                </Form.Item>

                {/* Phone Number */}
                <Form.Item
                    label="Restaurant Contact Number"
                    name="phoneNumber"
                    rules={[
                        { required: true, message: 'Please input the phone number!' },
                        { pattern: new RegExp(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/), message: 'Please enter a valid phone number' }
                    ]}
                >
                    <Input placeholder="+1 123 456 7890" />
                </Form.Item>


                {/* Description */}
                <Form.Item
                    label="Restaurant Description"
                    name="description"
                    rules={[
                        { required: true, message: 'Please input the description!' },
                        { min: 10, max: 300, message: 'Description should be between 10 and 300 characters' }
                    ]}
                >
                    <Input.TextArea placeholder="A cozy family restaurant serving Italian cuisine." />
                </Form.Item>

                {/* Restaurant Status */}
                <Form.Item
                    label="Restaurant Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select the restaurant status!' }]}
                >
                    <Select placeholder="Select status">
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="inactive">Inactive</Select.Option>
                    </Select>
                </Form.Item>

                {/* Image Upload */}
                <Form.Item
                    label="Upload Restaurant Image"
                    name="restaurantImage"
                    valuePropName="fileList"
                    getValueFromEvent={handleUploadChange}
                >
                    <Upload
                        name="logo"
                        listType="picture"
                        customRequest={mockUpload} // Use custom request for mock upload
                        beforeUpload={beforeUpload}
                        onChange={handleUploadChange}
                        fileList={fileList}
                        maxCount={1} // Limit to 1 image
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload (JPG/JPEG/PNG)</Button>
                    </Upload>
                </Form.Item>


            </Form>
        </AsyncModal>
    )
}

export default EditRestaurantsData