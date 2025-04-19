import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';

import { Button } from 'reactstrap';
import { Eye, Loader } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import QuriTable from '../../../../../Manage/QuriTable';
import EditModal from '../../../../../Manage/EditModal';
import { getOrders } from '../../../../../features/orders/orderSlice';

const Orders = () => {
  const name = "Order";
  const [selectedRow, setSelectedRow] = useState(null);
  const [modal, setModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [data, setData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [updatedData, setUpdatedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openName, setOpenName] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    if (orders?.length === 0) {
      getData();
    } else {
      setLoading(false);
    }
  }, [orders]);

  useEffect(() => {
    if (orders?.length !== 0) {
      setTableData(orders?.orders);
      setLoading(false);
    }
  }, [orders]);

  const getData = () => {
    setLoading(true);
    let obj = {
      page: '1',
      limit: '10',
      search: ''
    };
    //console.log('called')
   //  dispatch(getOrders(obj));
    dispatch(getOrders(obj))
      .unwrap()
      .catch((error) => {
        setErrorMessage(error.message); // Set the error message state
        setLoading(false);
      });
  };

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setModal(true);
  };

  const handleModal = () => {
    setShowEditModal(false);
    setIsUpdated(false);
    setUpdatedData([]);
  };

  const clickHandler = (data, name) => {
    setShowEditModal(true);
    if (name === 'Order Details') {
      setOpenName(name);
    }
    if (name === 'Order Status') {
      setOpenName(name);
      
    }
    setData(data);
  };

  const statusColorMap = {
    received: 'primary',
    processing: 'secondary',
    'ready for pickup': 'warning',
    saved: 'info',
    completed: 'success',
    cancelled: 'danger',
    paid: 'success',
    refunded: 'warning'
  };

  const columns = [
    {
      name: "OrderID",
      selector: row => row.OrderID,
      sortable: true,
      width: 'auto'
    },
    {
      name: "RestaurantID",
      selector: row => row.RestaurantID,
      sortable: true,
      width: 'auto'
    },
    {
      name: "CustomerID",
      selector: row => row.CustomerID,
      sortable: true,
      width: 'auto'
    },
    {
      name: "Status",
      cell: (row) => (
        <Button
          color={statusColorMap[row.Status?.toLowerCase()] || 'primary'}

          onClick={() => clickHandler(row, "Order Status")}
          className="btn-icon"
          style={{ width: '100px', fontSize: 'small' }}
          outline
        >
          <span title={(row.Status === "received" || row.Status === "Received") ? 'Received'
            : (row.Status === "processing" || row.Status === "Processing") ? 'Processing'
              : (row.Status === "ready for pickup" || row.Status === "Ready for pickup") ? 'Ready for pickup'
                : (row.Status === "saved" || row.Status === "Saved") ? 'Saved'
                  : (row.Status === "completed" || row.Status === "Completed") ? 'Completed'
                    : (row.Status === "cancelled" || row.Status === "Cancelled") ? 'Cancelled'
                      : (row.Status === "paid" || row.Status === "Paid") ? 'Paid'
                        : (row.Status === "refunded" || row.Status === "Refunded") ? 'Refunded'
                          : 'Select'}
            className="ellipsis">
            {(row.Status === "received" || row.Status === "Received") ? 'Received'
              : (row.Status === "processing" || row.Status === "Processing") ? 'Processing'
                : (row.Status === "ready for pickup" || row.Status === "Ready for pickup") ? 'Ready for Pickup'
                  : (row.Status === "saved" || row.Status === "Saved") ? 'Saved'
                    : (row.Status === "completed" || row.Status === "Completed") ? 'Completed'
                      : (row.Status === "cancelled" || row.Status === "Cancelled") ? 'Cancelled'
                        : (row.Status === "paid" || row.Status === "Paid") ? 'Paid'
                          : (row.Status === "refunded" || row.Status === "Refunded") ? 'Refunded'
                            : 'Select'}
          </span>
        </Button>
      ),
      sortable: true,
      width: "130px",
      center: true,
      style: {
        padding: '0'
      },
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          <Button
            color="primary"
            onClick={() => clickHandler(row, "Order Details")}
            outline
          >
            <Eye size='15' />
          </Button> &nbsp;
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      grow: 2,
      width: "190px",
      // style: {
      //   padding: '0'
      // },
      center: true
    }
  ];

  return (
    <div className='w-full min-h-screen px-4 sm:px-8 lg:px-16 mt-5 '>
      <Card className='p-2 dark:bg-gray-900 '>
        {loading ? <Loader /> : (
          <>
            {/* Display error message if there is one */}
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <QuriTable
              name={name}
              columns={columns}
              setTableData={setTableData}
              tableData={tableData}
            />
          </>
        )}
      </Card>

      <EditModal
        tableData={tableData}
        setTableData={setTableData}
        isUpdated={isUpdated}
        updatedData={updatedData}
        setUpdatedData={setUpdatedData}
        setIsUpdated={setIsUpdated}
        data={data}
        open={showEditModal}
        handleModal={handleModal}
        name={openName}
        ButtonClick={showEditModal}
        setButtonClicked={setShowEditModal}
      />
    </div>
  );
};

export default Orders;
