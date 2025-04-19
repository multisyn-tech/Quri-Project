import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { RiEyeFill } from "react-icons/ri";
import AddCustomers from './addCustomers';
import EditCustomer from './editCustomers';
import ViewOrders from './viewOrders';
import { addCustomer, fetchCustomers, deleteCustomer, editCustomer, fetchCustomerById } from '../../../../../features/customers/customerSlice';

const columns = (handleEditCustomer, handleDeleteCustomer, handleViewOrders) => [
  { field: 'CustomerID', headerName: 'CustomerID', flex: 2 },
  {
    field: 'Name',
    headerName: 'Full Name',
    flex: 2,
    renderCell: (params) => (
      <HighlightText text={params.value} searchText={params.searchText} />
    ),
  },
  {
    field: 'Email',
    headerName: 'Email',
    flex: 3,
    renderCell: (params) => (
      <HighlightText text={params.value} searchText={params.searchText} />
    ),
  },
  { field: 'PhoneNumber', headerName: 'Phone Number', flex: 2 },
  {
    field: 'Edit',
    headerName: 'Edit',
    flex: 1,
    renderCell: (params) => (
      <div className="flex items-center w-full h-full">
        <FaEdit
          size={20}
          className="text-blue-500 dark:text-blue-500 cursor-pointer"
          onClick={() => handleEditCustomer(params.row.CustomerID)}
        />
      </div>
    ),
  },
  {
    field: 'Delete',
    headerName: 'Delete',
    flex: 1,
    renderCell: (params) => (
      <div className="flex items-center w-full h-full">
        <FaTrash
          size={20}
          className="text-red-500 dark:text-red-500 cursor-pointer"
          onClick={() => handleDeleteCustomer(params.row.CustomerID)}
        />
      </div>
    ),
  },
  {
    field: 'History',
    headerName: 'Order History',
    flex: 1.5,
    renderCell: (params) => (
      <div className="flex  items-center w-full h-full">
        <RiEyeFill
          size={22}
          className="text-brand-500 dark:text-blue-500 cursor-pointer"
          onClick={() => handleViewOrders(params.row.CustomerID)}
        />
      </div>
    ),
  },
];

const HighlightText = ({ text, searchText }) => {
  if (!searchText) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${searchText})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === searchText.toLowerCase() ? (
          <mark key={index} style={{ backgroundColor: 'yellow', color: 'black' }}>{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const Customers = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const customers = useSelector((state) => state.customers.customers);

  const [searchText, setSearchText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [viewingOrders, setViewingOrders] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
  };

  const handleAddCustomer = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveCustomer = async (customer) => {
    try {
      await dispatch(addCustomer(customer)).unwrap();
      await dispatch(fetchCustomers()); // Fetch updated customer list after adding
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEditCustomer = async (customerId) => {
    try {
      const customer = await dispatch(fetchCustomerById(customerId)).unwrap();
      setCurrentCustomer(customer);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  const handleUpdateCustomer = async (updatedCustomer) => {
    try {
      await dispatch(editCustomer({ customerId: currentCustomer.CustomerID, customerData: updatedCustomer })).unwrap();
      await dispatch(fetchCustomers()); // Fetch updated customer list after editing
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await dispatch(deleteCustomer(customerId)).unwrap();
      await dispatch(fetchCustomers()); // Fetch updated customer list after deleting
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleViewOrders = (customerId) => {
    setCurrentCustomer(customerId);
    setViewingOrders(true);
  };

  const filteredRows = customers.filter(
    (row) =>
      (row.Name && row.Name.toLowerCase().includes(searchText)) ||
      (row.Email && row.Email.toLowerCase().includes(searchText))
  );

  if (viewingOrders) {
    return <ViewOrders customerId={currentCustomer} onClose={() => setViewingOrders(false)} />;
  }

  return (
    <div className='w-full min-h-screen px-4 sm:px-8 lg:px-16 mt-5'>
      <div className='flex flex-wrap justify-between space-y-4 space-x-4 sm:space-y-0'>
        <div className="w-full sm:w-1/2 lg:w-1/3 mb-4 sm:mb-0">
          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            placeholder="Search by name or email"
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="w-full sm:w-auto lg:w-auto mb-4 sm:mb-0">
          <button 
            onClick={handleAddCustomer} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Customer
          </button>
        </div>
      </div>
      <div className='w-full mt-4'>
        <DataGrid
          rows={filteredRows}
          columns={columns(handleEditCustomer, handleDeleteCustomer, handleViewOrders)}
          getRowId={(row) => row.CustomerID} // Specify the custom row ID
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 15]}
          className="text-gray-800 dark:text-white"
          autoHeight
          sx={{
            '& .MuiDataGrid-root': {
              color: theme.palette.text.primary,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
            '& .MuiDataGrid-toolbarContainer': {
              backgroundColor: theme.palette.background.paper,
            },
            '& .MuiTablePagination-root': {
              color: theme.palette.text.primary,
            },
          }}
        />
      </div>
      {isAddModalOpen && (
        <AddCustomers
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveCustomer}
        />
      )}
      {isEditModalOpen && (
        <EditCustomer
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateCustomer}
          initialData={currentCustomer}
        />
      )}
    </div>
  );
}

export default Customers;
