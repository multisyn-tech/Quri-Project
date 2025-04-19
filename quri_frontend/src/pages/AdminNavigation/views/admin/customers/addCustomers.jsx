import React from 'react';
import { useDispatch } from 'react-redux';
import { addCustomer, fetchCustomers } from '../../../../../features/customers/customerSlice';
import Form from './Form';

const AddCustomers = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleSave = async (formData) => {
    try {
      const customerData = {
        Name: formData.CustomerName,
        PhoneNumber: formData.PhoneNumber,
        Email: formData.Email,
      };
      await dispatch(addCustomer(customerData)).unwrap();
      await dispatch(fetchCustomers()); // Fetch updated customer list after adding
      onClose();
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const fields = [
    { name: 'CustomerName', label: 'Name', type: 'text', required: true },
    { name: 'Email', label: 'Email', type: 'email', required: true },
    { name: 'PhoneNumber', label: 'Phone Number', type: 'text', required: true },
  ];

  return (
    <Form
      onClose={onClose}
      onSave={handleSave}
      fields={fields}
      title="Add Customer"
    />
  );
};

export default AddCustomers;
