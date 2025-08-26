import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@mui/material';
import { Button } from 'reactstrap';
import { Eye, Loader, Download } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import QuriTable from '../../../../../Manage/QuriTable';
import EditModal from '../../../../../Manage/EditModal';
import { getOrders, getDetailsOfOrders, addRejectedOrder, resetRejectedOrderItems, resetDetailsOfOrder, rejectedItemsAdded, getPlateNumber } from '../../../../../features/orders/orderSlice';
import notificationSound from '../../../../../assets/audio/order.mp3';
import { Box, TextField, InputAdornment } from '@mui/material';

import jsPDF from "jspdf";
import "jspdf-autotable";


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

  // const [showModal, setShowModal] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [rejectedModal, setRejectedModal] = useState({});
  const [rejectedItems, setRejectedItems] = useState({});

  const [plateNumberData, setPlateNumberData] = useState([]);
  const [isLoadingPlateNumber, setIsLoadingPlateNumber] = useState(true);
  const [loader, setLoader] = useState(false);

  const [allOrders, setAllOrders] = useState([]);

  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  // console.log("order:", orders)

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);


  const prevOrderCountRef = useRef(null);
  const isAudioUnlocked = useRef(false);
  const audioRef = useRef(new Audio(notificationSound));


  useEffect(() => {
    dispatch(resetDetailsOfOrder());
    dispatch(rejectedItemsAdded(false))
  }, []);


  useEffect(() => {
    if (isDatePickerOpen) return; // pause polling
    const fetchData = async () => {
      await getData();
    };

    fetchData(); // initial load

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval); // cleanup
  }, [isDatePickerOpen]);




  useEffect(() => {
    if (orders?.orders?.length) {
      setTableData(orders.orders);
    }
  }, [orders]);



  useEffect(() => {
    unlockAudio();
    document.addEventListener('click', unlockAudio);
  }, []);


  useEffect(() => {
    getRejectedOrderItems()
  }, [rejectedModal?.newStatus])




  const unlockAudio = () => {
    audioRef.current.play().catch(() => { });
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    isAudioUnlocked.current = true;
    document.removeEventListener('click', unlockAudio);
  };


  const getRejectedOrderItems = () => {
    if (rejectedModal?.newStatus == 'Rejected') {
      // console.log("rejected order :", rejectedModal)
      dispatch(getDetailsOfOrders(rejectedModal.OrderID))
        .unwrap()
        .then((data) => {
          // console.log("order details: --- > ", data)
          setRejectedItems(data)

        })
        .catch((error) => {
          console.log("error occured at geting order: --- > ", error)
          setErrorMessage(error.message);
          setLoading(false);
        });
    }

  }



  const handleCheckboxChange = (index) => {
    const originalItems = rejectedItems.orderDetails.items;


    const updatedItems = originalItems.map((item, i) =>
      i === index ? { ...item, unavailable: !item.unavailable } : { ...item }
    );

    setRejectedItems((prev) => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        items: updatedItems
      }
    }));
  };


  const handleSubmitUnavailableItems = () => {

    let unavailableItems = [];
    unavailableItems = [
      {
        orderId: rejectedItems?.orderDetails?.OrderID,
        rejectedItems: rejectedItems?.orderDetails?.items
          ?.filter((item) => item.unavailable)
          ?.map(({ OrderID, ...rest }) => rest),
      }
    ];

    // console.log("✅ Unavailable Items Submitted:", unavailableItems);

    // dispatch(resetRejectedOrderItems());
    dispatch(addRejectedOrder(unavailableItems));

    dispatch(rejectedItemsAdded(true))

    // close modal on submit
    setRejectedModal({});
  };




  const getData = async () => {
    setLoading(true);
    setIsLoadingPlateNumber(true);
    let obj = {
      page: '1',
      limit: '1000',
      search: ''
    };

    try {
      const plateData = await getPlateNumberRecord();

      return dispatch(getOrders(obj))
        .unwrap()
        .then((data) => {

          // console.log("order data --> ", data.orders)
          const orders = data.orders || [];
          const paidOrders = orders.filter(order =>
            ["paid", "completed"].includes(order.Status.toLowerCase())
          );


          // Append plate numbers to orders
          // const updated = filteringPlateNumber(orders, plateData);
          const updated = filteringPlateNumber(paidOrders, plateData);
          setTableData(updated);

          setAllOrders(updated)
          const newOrderStatus = data.orders.length > 0 ? data.orders[data.orders.length - 1].Status : null;
          // if new order arrive then ring the bell and if order is rejected and then came again then dont ring bell
          // if (
          //   prevOrderCountRef.current !== null &&
          //   data.orders.length > prevOrderCountRef.current &&
          //   !["Accepted", "Rejected", "Completed"].includes(newOrderStatus) &&
          //   isAudioUnlocked.current
          // ) {

          // audioRef.current.loop = true; // Enable looping
          // audioRef.current.play().catch((err) => console.error("Audio play error:", err));

          // }

          // if (["Accepted", "Rejected", "Completed"].includes(newOrderStatus) && !audioRef.current.paused) {
          //   audioRef.current.pause();
          //   audioRef.current.currentTime = 0;
          // }

          prevOrderCountRef.current = data.orders.length;
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setErrorMessage(error.message);
          setLoading(false);
        });

    }
    catch (error) {
      console.error("Error fetching orders:", error);
      setIsLoadingPlateNumber(false);
    }
    finally {
      setIsLoadingPlateNumber(false);
    }
  };




  const getPlateNumberRecord = async () => {
    try {
      const data = await dispatch(getPlateNumber()).unwrap();
      setPlateNumberData(data);
      return data;
    } catch (err) {
      console.error("Error fetching plate numbers:", err);
      return [];
    }
  };



  const filteringPlateNumber = (orders, plateData) => {

    const plateMap = new Map();

    plateData.forEach(({ OrderID, PlateNumber }) => {
      if (PlateNumber) {
        // Only keep the latest PlateNumber if multiple exist
        plateMap.set(OrderID, PlateNumber);
      }
    });

    setIsLoadingPlateNumber(false);
    return orders.map(order => ({
      ...order,
      PlateNumber: plateMap.get(order.OrderID) || '-',
    }));

  }



  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const downloadCSV = async () => {
    setLoader(true); // show spinner
    const start = startDate ? normalizeDate(startDate) : null;
    const end = endDate ? normalizeDate(endDate) : null;

    const completedOrders = allOrders.filter(order => {

      if (!order.Status || order.Status.trim().toLowerCase() !== "completed") return false;


      const [month, day, year] = order.OrderDate.trim().split("-");
      const orderDate = normalizeDate(new Date(year, month - 1, day));


      if (start && orderDate < start) return false;
      if (end && orderDate > end) return false;

      return true;
    });

    if (completedOrders.length === 0) {
      alert("No completed orders in this date range!");
      setLoader(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    // CSV header
    const header = [
      "Order ID",
      "Restaurant ID",
      "Order Date",
      "Table ID",
      "Plate Number",
      "Total Amount"
    ];

    // CSV rows
    const rows = completedOrders.map(o => [
      o.OrderID,
      o.RestaurantID,
      o.OrderDate,
      o.TableID,
      o.PlateNumber,
      o.TotalAmount
    ]);

    // Combine header + rows
    const csvContent =
      [header, ...rows]
        .map(row => row.map(val => `"${val}"`).join(",")) // quote values for safety
        .join("\n");

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "completed_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);



    setLoader(false); // hide spinner
  };




  // const getData = () => {
  //   setLoading(true);
  //   let obj = {
  //     page: '1',
  //     limit: '1000',
  //     search: ''
  //   };
  //   //console.log('called')
  //   //  dispatch(getOrders(obj));
  //   return dispatch(getOrders(obj))
  //     .unwrap()
  //     .then((data) => {


  //       if (
  //         prevOrderCountRef.current !== null &&
  //         data.orders.length > prevOrderCountRef.current &&
  //         isAudioUnlocked.current
  //       ) {
  //         audioRef.current.play();
  //       }

  //       prevOrderCountRef.current = data.orders.length;
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching orders:", error);
  //       setErrorMessage(error.message);
  //       setLoading(false);
  //     })
  //     .finally(() => {
  //       setLoading(false); // Always stop loading regardless of success/fail
  //     });;
  // };




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
    refunded: 'warning',
    accepted: 'info',
    rejected: 'danger'

  };

  const columns = [
    {
      name: "Order ID",
      selector: row => row.OrderID,
      sortable: true,
      width: 'auto'
    },
    {
      name: "Restaurant ID",
      selector: row => row.RestaurantID,
      sortable: true,
      width: 'auto'
    },
    {
      name: "Table ID",
      selector: row => row.TableID,
      sortable: true,
      width: 'auto'
    },
    {
      name: "Date",
      selector: row => {
        if (!row.OrderDate) return "";
        const [month, day, year] = row.OrderDate.split("-");
        return `${day}-${month}-${year}`;
      },
      sortable: true,
      width: 'auto'
    },
    {
      name: "Plate Number",
      // selector: row => isLoadingPlateNumber ? 'Loading...' : row.PlateNumber,
      selector: row => row.PlateNumber,
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


          <span title={
            (row.Status === "received" || row.Status === "Received") ? 'Received'
              : (row.Status === "processing" || row.Status === "Processing") ? 'Processing'
                : (row.Status === "ready for pickup" || row.Status === "Ready for pickup") ? 'Ready for pickup'
                  : (row.Status === "saved" || row.Status === "Saved") ? 'Saved'
                    : (row.Status === "completed" || row.Status === "Completed") ? 'Delivered'
                      : (row.Status === "cancelled" || row.Status === "Cancelled") ? 'Cancelled'
                        : (row.Status === "paid" || row.Status === "Paid") ? 'Paid'
                          : (row.Status === "refunded" || row.Status === "Refunded") ? 'Refunded'
                            : (row.Status === "accepted" || row.Status === "Accepted") ? 'Accepted'
                              : (row.Status === "rejected" || row.Status === "Rejected") ? 'Rejected'
                                : 'Select'
          }
            className="ellipsis">
            {(row.Status === "received" || row.Status === "Received") ? 'Received'
              : (row.Status === "processing" || row.Status === "Processing") ? 'Processing'
                : (row.Status === "ready for pickup" || row.Status === "Ready for pickup") ? 'Ready for Pickup'
                  : (row.Status === "saved" || row.Status === "Saved") ? 'Saved'
                    : (row.Status === "completed" || row.Status === "Completed") ? 'Delivered'
                      : (row.Status === "cancelled" || row.Status === "Cancelled") ? 'Cancelled'
                        : (row.Status === "paid" || row.Status === "Paid") ? 'Paid'
                          : (row.Status === "refunded" || row.Status === "Refunded") ? 'Refunded'
                            : (row.Status === "accepted" || row.Status === "Accepted") ? 'Accepted'
                              : (row.Status === "rejected" || row.Status === "Rejected") ? 'Rejected'
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
        {showModal ? (
          <>

            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  🔔 New feature! You’ll now hear this sound every time a new order hits — no more missed activity!
                </p>

                {/* Audio player for user interaction */}
                <audio controls>
                  <source src={notificationSound} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>

                <button
                  onClick={() => {
                    unlockAudio();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  OK
                </button>
              </div>
            </div>
          </>

        ) :

          loading ?
            // <Loader />
            (
              <>
                <div class="text-right p-2 ">
                  <div class="d-flex justify-content-around align-items-center ">


                    <TextField
                      label="start date"
                      type="date"
                      variant="outlined"
                      size="small"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onFocus={() => setIsDatePickerOpen(true)}
                      onBlur={() => setIsDatePickerOpen(false)}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      label="end date"
                      type="date"
                      variant="outlined"
                      size="small"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onFocus={() => setIsDatePickerOpen(true)}
                      onBlur={() => setIsDatePickerOpen(false)}
                      InputLabelProps={{ shrink: true }}
                    />

                    <button
                      className="btn btn-info"
                      onClick={downloadCSV}
                      disabled={loader}
                    >
                      {loader ? (
                        <Loader />
                      ) : (
                        <Download size={20} color="#000" />
                      )}
                    </button>

                  </div>
                </div>

                <QuriTable
                  name={name}
                  columns={columns}
                  setTableData={setTableData}
                  tableData={tableData}
                />
              </>
            )
            : (
              <>

                {/* Display error message if there is one */}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                <div class="text-right p-2">
                  <div class="d-flex justify-content-around align-items-center">
                    <TextField
                      label="start date"
                      type="date"
                      variant="outlined"
                      size="small"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onFocus={() => setIsDatePickerOpen(true)}
                      onBlur={() => setIsDatePickerOpen(false)}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      label="end date"
                      type="date"
                      variant="outlined"
                      size="small"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onFocus={() => setIsDatePickerOpen(true)}
                      onBlur={() => setIsDatePickerOpen(false)}
                      InputLabelProps={{ shrink: true }}
                    />

                    <button
                      className="btn btn-info"
                      onClick={downloadCSV}
                      disabled={loader} // disable while loading
                    >
                      {loader ? (
                        <Loader />
                      ) : (
                        <Download size={20} color="#000" />
                      )}
                    </button>

                  </div>
                </div>


                <QuriTable
                  name={name}
                  columns={columns}
                  setTableData={setTableData}
                  tableData={tableData}
                />

              </>
            )}
      </Card>


      {/* rejected items modal */}
      {rejectedModal?.newStatus === "Rejected" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">

            {/* Close Modal (X) */}
            <button
              onClick={() => setRejectedModal({})}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>

            {/* Loader if data not yet loaded */}
            {!rejectedItems?.orderDetails?.items ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-700">Loading items...</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-red-600 mb-2 text-center">Order Rejected</h2>
                <p className="text-gray-700"><span className="font-medium">Status:</span> {rejectedModal.newStatus}</p>
                <p className="text-gray-700 mb-4"><span className="font-medium">Order ID:</span> {rejectedModal.OrderID}</p>

                {/* Show Items */}
                {rejectedItems.orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b py-2">
                    <div className="text-left">
                      <p className="font-medium">{item.ItemName}</p>
                      {/* <p className="text-sm text-gray-600">{item.ItemDescription}</p> */}
                      <p className="text-sm text-gray-800">Qty: {item.Quantity}</p>
                      <p className="text-sm text-gray-800">Price: {item.ItemPrice}  <small>AED</small> </p>
                    </div>
                    <div className="ml-4">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.unavailable || false}
                          onChange={() => handleCheckboxChange(index)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span>Unavailable</span>
                      </label>
                    </div>
                  </div>
                ))}

                {/* Submit Button */}
                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
                  onClick={handleSubmitUnavailableItems}
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </div>
      )}



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
        rejectedModalStatus={rejectedModal}
        setRejectedModalStatus={setRejectedModal}
      />

    </div>
  );
};

export default Orders;
