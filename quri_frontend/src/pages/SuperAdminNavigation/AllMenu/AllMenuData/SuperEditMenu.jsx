import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editMenuItem } from '../../../../features/SuperAdmin/superAdminSlice';
import { Form, Input, InputNumber, Select, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const SuperEditMenu = ({ selectedItem,onUpdate,refetchMenus }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [imageSource, setImageSource] = useState('url'); // State to toggle between URL and file upload
    const [fileList, setFileList] = useState([]); // State to manage uploaded files

    useEffect(() => {
        if (selectedItem) {
            if (selectedItem.Image && selectedItem.Image.startsWith('http')) {
                setImageSource('url');
                form.setFieldsValue({
                    itemName: selectedItem.ItemName,
                    itemDescription: selectedItem.ItemDescription,
                    price: selectedItem.Price,
                    categoryName: selectedItem.CategoryName,
                    menuStatus: selectedItem.MenuStatus,
                    imageUrl: selectedItem.Image,
                });
            } else {
                setImageSource('upload');
                setFileList([{
                    uid: '-1',
                    name: 'Uploaded Image',
                    status: 'done',
                    url: selectedItem.Image,
                }]);
                form.setFieldsValue({
                    itemName: selectedItem.ItemName,
                    itemDescription: selectedItem.ItemDescription,
                    price: selectedItem.Price,
                    categoryName: selectedItem.CategoryName,
                    menuStatus: selectedItem.MenuStatus,
                });
            }
        }
    }, [selectedItem, form]);

    const handleFormSubmit = (values) => {
        let imageUrl = values.imageUrl;
        if (imageSource === 'upload' && fileList.length > 0) {
            imageUrl = null;
        }
        const data = {
            ItemName: values.itemName,
            ItemDescription: values.itemDescription,
            Price: values.price,
            MenuStatus: values.menuStatus,
            Image: imageUrl,
        };
        const file = fileList.length > 0 ? fileList[0].originFileObj : null;
        
        dispatch(editMenuItem({
            menuId: selectedItem.MenuID,
            data,
            file,
        })).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                message.success('Menu item updated successfully');
                onUpdate({ ...selectedItem, ...data });
                
                // Trigger a refetch of the restaurant data
                refetchMenus();
            } else {
                message.error(result.error.message || 'Failed to update menu item');
            }
        });
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    return (
        <div className="p-2 max-h-96 overflow-y-auto">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
            >
                {/* Item Name */}
                <Form.Item
                    label="Item Name"
                    name="itemName"
                    rules={[{ required: true, message: 'Please enter the item name!' }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>

                {/* Item Description */}
                <Form.Item
                    label="Item Description"
                    name="itemDescription"
                    rules={[{ required: true, message: 'Please enter the item description!' }]}
                >
                    <TextArea rows={4} placeholder="Enter item description" />
                </Form.Item>

                {/* Price (AED) */}
                <Form.Item
                    label="Price (AED)"
                    name="price"
                    rules={[{ required: true, message: 'Please enter the price!' }]}
                >
                    <InputNumber
                        min={0}
                        max={10000}
                        placeholder="Enter price"
                        className="w-full"
                        type="number"
                    />
                </Form.Item>

                {/* Category Name Dropdown */}
                <Form.Item
                    label="Category Name"
                    name="categoryName"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select placeholder="Select category" disabled>
                        <Option value="starter">Starter</Option>
                        <Option value="mainCourse">Main Course</Option>
                        <Option value="dessert">Dessert</Option>
                        <Option value="beverage">Beverage</Option>
                    </Select>
                </Form.Item>

                {/* Menu Status Dropdown */}
                <Form.Item
                    label="Menu Status"
                    name="menuStatus"
                    rules={[{ required: true, message: 'Please select the status!' }]}
                >
                    <Select placeholder="Select menu status">
                        <Option value="active">Available</Option>
                        <Option value="inactive">Unavailable</Option>
                    </Select>
                </Form.Item>

                {/* Image Upload Options */}
                <Form.Item label="Image Upload Option" name="imageOption">
                    <Select
                        value={imageSource}
                        onChange={(value) => setImageSource(value)}
                    >
                        <Option value="url">Upload via URL</Option>
                        <Option value="upload">Upload from Computer</Option>
                    </Select>
                </Form.Item>

                {/* Image URL Input */}
                {imageSource === 'url' && (
                    <Form.Item
                        label="Image URL"
                        name="imageUrl"
                        rules={[{ required: true, message: 'Please enter the image URL!' }]}
                    >
                        <Input placeholder="Enter image URL" />
                    </Form.Item>
                )}

                {/* Image Upload */}
                {imageSource === 'upload' && (
                    <Form.Item
                        label="Upload Image"
                        name="imageUpload"
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                    >
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false} // Prevent automatic upload
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                )}

                {/* Submit Button */}
                <Form.Item className='flex items-end justify-end mt-5'>
                    <Button type="primary" htmlType="submit">
                        Update Menu Item
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SuperEditMenu;