import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { RiEyeFill } from "react-icons/ri";
import { getOrdersByCustomer } from '../../../../../features/orders/orderSlice';

const ViewOrders = ({ customerId, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { ordersByCustomer, status, error } = useSelector((state) => state.orders);
  
  const [filteredRows, setFilteredRows] = useState([]);

  const columns = [
    { field: 'OrderID', headerName: 'Order ID', flex: 1 },
    { field: 'TotalAmount', headerName: 'Total', flex: 1 },
    { field: 'Status', headerName: 'Order Status', flex: 1 },
    {
      field: 'Action', headerName: 'Action', flex: 1, renderCell: () => (
        <div className="flex items-center w-full h-full">
          <RiEyeFill
            size={22}
            className="text-brand-500 dark:text-blue-500 cursor-pointer"
          />
        </div>
      )
    },
  ];

  useEffect(() => {
    dispatch(getOrdersByCustomer(customerId));
  }, [dispatch, customerId]);

  useEffect(() => {
    if (status === 'succeeded' && ordersByCustomer.orders) {
      console.log('Orders:', ordersByCustomer.orders); // Log the orders for debugging
      setFilteredRows(ordersByCustomer.orders); // Set the orders array directly
    }
  }, [ordersByCustomer, status]);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className='w-full mt-4'>
      <button onClick={onClose} className="bg-red-500 mt-4 text-white px-4 py-2 rounded hover:bg-red-700 mb-4">
        Back to Customers
      </button>
      <DataGrid
        rows={filteredRows}
        getRowId={(row) => row.OrderID} // Adjusted to OrderID
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
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
  );
};

export default ViewOrders;
