const express = require("express");
const {
  AddOrder,
  getOrderById,
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
  getMenuByTableIDController
} = require("./controller.js");

const router = express.Router();

// Order related
router.get("/order", GetAllOrder); 
// Get Order By customer ID
router.get('/orders/:customerId', GetAllOrderByCustomer);
// Get Order By OrderID
router.get('/order/:tableId', getOrderById);

// Get QrCode
router.post("/order", AddOrder);
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

module.exports = router;
