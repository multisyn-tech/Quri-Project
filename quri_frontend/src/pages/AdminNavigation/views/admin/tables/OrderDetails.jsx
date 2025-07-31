import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Paper, Typography, Container,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, Select, MenuItem, Switch
} from '@mui/material';

import { Button } from 'reactstrap'
import { Print } from '@mui/icons-material';
import ReactToPrint from 'react-to-print';
import { orderStatusOptions, orderMethodOptions, deliveryMen, myToast } from '../../../../../Manage/snippets';
import { getDetailsOfOrders, getOrders, updateOrderStatus, resetDetailsOfOrder } from '../../../../../features/orders/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import ManageSelect from '../../../../../Manage/ManageSelect';
import QuriLogo from '../../../../../assets/Admin/Quri.svg'
import toast from 'react-hot-toast';

import { QURI_SERVICE_FEE } from "../../../../../config/constants";

const OrderDetails = (props) => {

  const formData1 = props.data
  const updatedData = props.updatedData
  const setUpdatedData = props.setUpdatedData
  const tableData = props.tableData
  const setIsUpdated = props.setIsUpdated
  const tableForm = props.tableForm
  const setTableData = props.setTableData

  const dataAvaliable = formData1 !== undefined

  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings?.settings);

  const restaurantName = settings && settings.length > 0
    ? settings.find(item => item.KeyID === "RestaurantName")?.Value
    : "Restaurant Not Available";

  //console.log("Restaurant Name: ",restaurantName);

  const orders = useSelector((state) => state.orders?.orders?.orders);
  const lastOrderID = orders[orders.length - 1].OrderID


  // const orderID = useSelector(state => state.orders.orders?.orders?.[0]?.OrderID || 'No order found');
  const orderID = lastOrderID

  // console.log("orders:", orders)
  // console.log("last order:", lastOrderID)

  // console.log("Order ID: ", orderID);

  const orderDetails = useSelector(state => state.orders.detailsOfOrders)
  // console.log("Order Details: ", orderDetails)

  // const cartItems = useSelector(state => state.orders.cartItems || [] )
  // console.log("cart items: ", cartItems)


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryServiceNameInput, setDeliveryServiceNameInput] = useState('');
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [selectedStatusOption, setSelectedStatusOption] = useState('');
  const [selectedMethodOption, setSelectedMethodOption] = useState(orderMethodOptions[0]);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState('');
  const [status, setStatus] = useState(dataAvaliable ? formData1.status : '')

  const [errorMessage, setErrorMessage] = useState("")




  useEffect(() => {
    if (orderDetails?.orderDetails?.Status) {
      const status = orderDetails.orderDetails.Status;

      // Check if the status exists in the orderStatusOptions array
      if (orderStatusOptions.includes(status)) {
        setSelectedStatusOption(status);
      }
    }
  }, [orderDetails]);


  // Fetch order details whenever the orderID changes
  useEffect(() => {
    if (orderID) {
      dispatch(resetDetailsOfOrder()); // Optional safety
      dispatch(getDetailsOfOrders(orderID)); // Fetch details for the given orderID
    }
  }, [dispatch, orderID]);



  const invoiceStyle = { display: 'flex', justifyContent: 'flex-end' };
  const componentRef = useRef();

  useEffect(() => {
    if (selectedMethodOption === "By Third Party Delivery Service") {
      setIsModalOpen(true);
      setSelectedDeliveryMan('');
    } else {
      setIsModalOpen(false);
    }
  }, [selectedMethodOption]);

  const handleStatusChange = (e) => setSelectedStatusOption(e);
  const handleMethodChange = (event) => setSelectedMethodOption(event.target.value);
  const handleSwitchChange = (event) => setSwitchChecked(event.target.checked);
  const handleDeliveryManChange = (event) => {
    const selectedMan = deliveryMen.find(man => man.name === event.target.value);
    setSelectedDeliveryMan(selectedMan);
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setDeliveryServiceNameInput('');
    setTrackingIdInput('');
  };

  // const data1 = {
  //   invoiceNumber: '123',
  //   createdDate: 'January 1, 2023',
  //   dueDate: 'February 1, 2023',
  //   companyInfo: {
  //     name: 'Sparksuite, Inc.',
  //     address: '12345 Sunny Road',
  //     city: 'Sunnyville, CA 12345',
  //   },
  //   customerInfo: {
  //     name: 'Acme Corp.',
  //     contactName: 'John Doe',
  //     email: 'john@example.com',
  //   },
  //   paymentMethod: 'Check',
  //   checkNumber: '1000',
  //   items: [
  //     { description: 'Website design', price: '$300.00' },
  //     { description: 'Hosting (3 months)', price: '$75.00' },
  //     { description: 'Domain name (1 year)', price: '$10.00' },
  //   ],
  //   total: '$385.00',
  // };


  const data1 = {
    invoiceNumber: orderDetails?.orderDetails?.OrderID || '',
    createdDate: orderDetails?.orderDetails?.OrderDate || '',
    dueDate: orderDetails?.orderDetails?.OrderDate || '',  // Add logic if you have a due date
    companyInfo: {
      name: restaurantName, // Replace with actual company info if available
      // address: 'Res Address',
      // city: 'City, State, ZIP',
    },
    customerInfo: {
      name: orderDetails?.customerDetails?.Name || '',
      phoneNumber: orderDetails?.customerDetails?.PhoneNumber || '',
      email: orderDetails?.customerDetails?.Email || '',
    },
    paymentMethod: 'Card', // Replace with the actual payment method
    checkNumber: '#2132',   // Replace with the actual check number
    items: orderDetails?.orderDetails?.items?.map(item => ({
      description: item.ItemName,
      Quantity: item.Quantity,
      price: `AED ${item.ItemPrice}`,
    })) || [],
    // items: cartItems.map(item => ({
    //   description: item.ItemName,
    //   Quantity: item.quantity,
    //   price: `AED ${item.Price}`,
    // })) || [],
    total: `AED ${orderDetails?.orderDetails?.TotalAmount || '0.00'}`,
  };



  useEffect(() => {
    dispatch(getDetailsOfOrders(formData1.OrderID))
  }, [])


  const handleTimeoutAlert = (obj) => {
    const myPromise = new Promise(async (resolve, reject) => {
      dispatch(updateOrderStatus(obj, dataAvaliable && formData1.OrderID)).then((response) => {
        const result = response

        if (tableForm) {

          const data = JSON.parse(JSON.stringify(tableData))

          const newObj = {
            id: result.id,
            sn: data.length + 1,
            status: obj.status
          }

          data.unshift(newObj)
          setTableData(data)
          props.setInputModal(false)

        }
        setIsUpdated(true)
        props.setInputModal(false);
        // props.setTableData([])
        // setTableData([])

        let obj = {
          page: '1',
          limit: '100',
          search: ''
        };

        dispatch(getOrders(obj));

        resolve(result)
      }).catch((err) => {
        reject(err)
      });


    })

    return myToast(myPromise)

  }

  const handleUpdate = () => {
    let obj = {
      newStatus: selectedStatusOption,
    }


    if (obj.newStatus == '') {
      setErrorMessage('status')
      toast.error('Select Status to Proceed')
    }
    else {
      setErrorMessage("")
    }
    if (errorMessage == "" && obj.newStatus !== '') {
      if (dataAvaliable) {
        // const updatedObj = Object.assign(obj, {id: formData1.id, provinceName: filteredProvince.label})
        const updatedObj = Object.assign(obj, { OrderID: formData1.OrderID })

        setUpdatedData(updatedObj)

        props.RejectedModalStatus(updatedObj)

      }
      handleTimeoutAlert(obj)
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={8} xl={8}>
            {formData1 && (
              <>
                <div style={{ ...invoiceStyle, paddingBottom: '0rem' }}>
                  <ReactToPrint
                    trigger={() => <Button startIcon={<Print />} color="primary" variant="contained">Print Invoice</Button>}
                    content={() => componentRef.current}
                  />
                </div>
                <div>
                  <Paper sx={{ padding: 1 }}>
                    <Container ref={componentRef} maxWidth="md">
                      <InvoiceHeader data1={data1} formData1={formData1} />
                      <InvoiceBody data1={data1} />
                    </Container>
                  </Paper>
                </div>
              </>
            )}
          </Grid>
          <Grid item xs={12} md={12} lg={4} xl={4}>
            <Grid container spacing={2}>
              <OrderShippingInfo
                errorMessage={errorMessage}
                dataAvaliable={dataAvaliable}
                formData1={formData1}
                selectedStatusOption={selectedStatusOption}
                handleStatusChange={handleStatusChange}
                switchChecked={switchChecked}
                handleSwitchChange={handleSwitchChange}
              />
            </Grid>
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button className=" mb-1" color="primary" type="button" onClick={handleUpdate} style={{ float: 'right', marginTop: '1rem' }}>
              {'Update'}
            </Button>
          </div>
        </Grid>
      </Box>
    </>
  );
};

const InvoiceHeader = ({ data1, formData1 }) => {
  const invoiceStyle = { display: 'flex', justifyContent: 'flex-end' };

  return (
    <>
      <div style={{ ...invoiceStyle, paddingBottom: '1rem' }}></div>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
            <img
              src={QuriLogo}
              alt="Quri Logo"
              style={{ width: '100%', maxWidth: 300 }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Typography fontWeight='bold' variant="body1" style={invoiceStyle}>
            Order ID #: {formData1.OrderID}
          </Typography>
          <Typography variant="body1" style={invoiceStyle}>
            <b>Order Date: </b> {formData1.OrderDate}
          </Typography>
          {/* <Typography variant="body1" style={invoiceStyle}>
            <b>Due: </b> {data1.dueDate}
          </Typography> */}
          <Typography variant="body1" style={invoiceStyle}>
            {/* <b>Time: </b> {data1.dueDate} */}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

const InvoiceBody = ({ data1 }) => {

  const totalString = data1.total;
  const numericTotal = parseFloat(totalString.replace(/[^0-9.]/g, ""));
  let finalAmount = numericTotal + QURI_SERVICE_FEE;



  return (
    <>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          {/* <Typography variant="body1" className='text-nowrap'> <span className='font-bold'>Restaurant Name: </span> {data1.companyInfo.name}</Typography>
          <Typography variant="body1">{data1.companyInfo.address}</Typography>
          <Typography variant="body1">{data1.companyInfo.city}</Typography> */}
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography variant="body1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {data1.customerInfo.name}
          </Typography>
          <Typography variant="body1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {data1.customerInfo.phoneNumber}
          </Typography>
          <Typography variant="body1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {data1.customerInfo.email}
          </Typography>
        </Grid>
      </Grid>
      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          {/* <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Check #</TableCell>
            </TableRow>
          </TableHead> */}
          {/* <TableBody>
            <TableRow>
              <TableCell>{data1.paymentMethod}</TableCell>
              <TableCell align="right">{data1.checkNumber}</TableCell>
            </TableRow>
          </TableBody> */}
        </Table>
      </TableContainer>
      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data1.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.Quantity} &nbsp; { <small>({item.Quantity} x {(item?.price ?? "0").replace(/[^0-9.]/g, "")} AED)</small>} </TableCell>
                <TableCell align="right">
                  {(
                    Number((item?.price ?? "0").replace(/[^0-9.]/g, "")) *
                    Number(item?.Quantity ?? 0)
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>Service Fee:</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">{QURI_SERVICE_FEE}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total:</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">AED {finalAmount.toFixed(2)} </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const OrderShippingInfo = ({ dataAvaliable, formData1, selectedStatusOption, handleStatusChange, switchChecked, handleSwitchChange, errorMessage }) => {


  return (
    <Grid item xs={12}>
      <Paper elevation={2} sx={{ padding: 2 }}>
        <Typography variant="h6" align='center'>Order & Shipping Info</Typography>
        <FormControl fullWidth variant="outlined" style={{ marginTop: '1rem' }} size="small">
          <Typography sx={{ fontWeight: 'bold' }}>Change Order Status</Typography>
          <ManageSelect
            width="100%"
            type='group'
            id='op_status'
            label='Select Status *'
            defaultValue={dataAvaliable &&
              (formData1.Status === "received" || formData1.Status === "Received" ?
                orderStatusOptions.find(x => x.value === "received")
                : formData1.Status === "processing" || formData1.Status === "Processing" ?
                  orderStatusOptions.find(x => x.value === "processing")
                  : formData1.Status === "ready for pickup" || formData1.Status === "Ready for pickup" ?
                    orderStatusOptions.find(x => x.value === "ready_for_pickup")
                    : formData1.Status === "saved" || formData1.Status === "Saved" ?
                      orderStatusOptions.find(x => x.value === "saved")
                      : formData1.Status === "completed" || formData1.Status === "Completed" ?
                        orderStatusOptions.find(x => x.value === "completed")
                        : formData1.Status === "cancelled" || formData1.Status === "Cancelled" ?
                          orderStatusOptions.find(x => x.value === "cancelled")
                          : formData1.Status === "paid" || formData1.Status === "Paid" ?
                            orderStatusOptions.find(x => x.value === "paid")
                            : formData1.Status === "refunded" || formData1.Status === "Refunded" ?
                              orderStatusOptions.find(x => x.value === "refunded")
                              : formData1.Status === "accepted" || formData1.Status === "Accepted" ?
                                orderStatusOptions.find(x => x.value === "accepted")
                                : formData1.Status === "rejected" || formData1.Status === "Rejected" ?
                                  orderStatusOptions.find(x => x.value === "rejected")
                                  : orderStatusOptions.find(x => x.value === "select")) // Default if no match
            }

            options={orderStatusOptions}
            // value="Select Status *"
            errorStyle={errorMessage === "status"}
            // loadingCondition={provinceLoading}
            // onChange ={(e) =>{
            //      setStatus(e.label) 
            //     // setValue(-1)
            //     // setProvinceName(e.label)
            // } }

            onChange={(e) => { handleStatusChange(e.label) }}
          />
        </FormControl>
        <Grid container alignItems="center" style={{ marginTop: '1rem' }}>
          <Grid item xs>
            <Typography sx={{ fontWeight: 'bold' }}>Payment Status:</Typography>
          </Grid>
          <Grid item>
            {/* {switchChecked ? "Paid" : "Unpaid"}
            <Switch
              checked={switchChecked}
              onChange={handleSwitchChange}
            /> */}
            {formData1.Status === "Completed" || formData1.Status === "completed" ? (
              <>
                <span>Paid</span>
                <Switch
                  checked={true}
                  onChange={() => { }}
                  disabled
                />
              </>
            ) : (
              <>
                <span>Unpaid</span>
                <Switch
                  checked={switchChecked}
                  onChange={handleSwitchChange}
                  disabled
                />
              </>
            )}

          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default OrderDetails;
