const express = require("express");
const {
  AddOrder,
  getOrderById,
  getAllOrdersByTableId,
  FindAllCustomers,
  AddCustomers,
  getCustomerByIdController,
  editCustomerController,
  userLogs,
  deleteCustomerController,
  GetAllOrder,
  GetAllOrderByCustomer,
  changeOrderStatus,
  editOrder,
  deleteOrder,
  getMenuByTableIDController,
  findOrderID,
  addRejectedOrder,
  findRejectedOrder,
  saveUserActivity,
  refreshOrders,
  getAllActivity
} = require("./controller.js");

const router = express.Router();

// get all activity of user (stages of orders)
router.get('/get_all_activity/:restId/:tabId', getAllActivity)
router.get('/user_logs', userLogs)

// Order related
router.get("/order", GetAllOrder);
// Get Order By customer ID
router.get('/orders/:customerId', GetAllOrderByCustomer);
// Get completed Order By table id
router.get('/order/:tableId', getOrderById);
// get all order by table id
router.get('/allOrders/:tableId', getAllOrdersByTableId);
// Get QrCode
router.post("/order", AddOrder);
router.post('/order/getID', findOrderID);
router.put("/order/changeStatus/:OrderID", changeOrderStatus);
router.post("/refresh-order", refreshOrders);
router.put("/order/edit/:OrderID", editOrder);
router.delete("/order/delete/:OrderID", deleteOrder);
// Customer related
router.get("/", FindAllCustomers);
router.post("/", AddCustomers);
router.get("/:customerId", getCustomerByIdController);
router.put("/:customerId", editCustomerController);
router.delete("/:customerId", deleteCustomerController);

// Fetch Menu based on Table ID
router.get("/menu/:tableId", getMenuByTableIDController);
router.post('/order/rejectedOrder', addRejectedOrder);
router.post('/order/rejectedOrder/:orderId', findRejectedOrder);
router.post('/activity', saveUserActivity)



module.exports = router;
