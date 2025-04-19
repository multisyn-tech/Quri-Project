import React from 'react';
import { useDispatch } from 'react-redux';
import { editCustomer, fetchCustomers } from '../../../../../features/customers/customerSlice';
import Form from './Form';

const EditCustomer = ({ onClose, initialData }) => {
  const dispatch = useDispatch();

  const handleSave = async (formData) => {
    try {
      const customerData = {
        name: formData.CustomerName,
        phoneNumber: formData.PhoneNumber,
        email: formData.Email,
      };
      await dispatch(editCustomer({ customerId: initialData.CustomerID, customerData })).unwrap();
      await dispatch(fetchCustomers()); // Fetch updated customer list after editing
      onClose();
    } catch (error) {
      console.error('Error editing customer:', error);
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
      title="Edit Customer"
      initialData={initialData}
    />
  );
};

export default EditCustomer;
