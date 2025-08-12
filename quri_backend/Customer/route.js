const express = require("express");
const {
  AddOrder,
  getOrderById,
  getAllOrdersByTableId,
  FindAllCustomers,
  AddCustomers,
  getCustomerByIdController,
  editCustomerController,
  deleteCustomerController,
  GetAllOrder,
  GetAllOrderByCustomer,
  changeOrderStatus,
  editOrder,
  deleteOrder,
  getMenuByTableIDController,
  findOrderID,
  addRejectedOrder,
  getRecentOrder,
  findRejectedOrder
} = require("./controller.js");

const router = express.Router();

// Order related
router.get("/order", GetAllOrder);
// Get Order By customer ID
router.get('/orders/:customerId', GetAllOrderByCustomer);
// Get completed Order By table id
router.get('/order/:tableId', getOrderById);
// get all order by table id
router.get('/allOrders/:tableId', getAllOrdersByTableId);
// Get last ordered item
router.post('/recent-order', getRecentOrder);
// Get QrCode
router.post("/order", AddOrder);

router.post('/order/getID', findOrderID);

router.put("/order/changeStatus/:OrderID", changeOrderStatus);

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


// add "insert rejected order", "find rejected order" from restaurant dashboard to table 
router.post('/order/rejectedOrder', addRejectedOrder);
router.post('/order/rejectedOrder/:orderId', findRejectedOrder);

module.exports = router;
