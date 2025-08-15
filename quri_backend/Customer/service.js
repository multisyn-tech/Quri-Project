const db = require("../db/db.js");

const addOrderService = async function ({
  OrderID,
  RestaurantID,
  CustomerID,
  Status = "Received", // Default status to 'Received' if not provided
  TotalAmount,
  OrderDetails, // New parameter for order details
  TableID,
  OrderDate,
}) {
  const validStatuses = [
    "Received",
    "Processing",
    "Ready for pickup",
    "Saved",
    "Completed",
    "Cancelled",
    "Paid",
    "Refunded",
    "Accepted",
    "Rejected"
  ];

  if (!RestaurantID || !TotalAmount || !OrderDetails || !TableID) {
    throw new Error(
      "RestaurantID, TotalAmount, OrderDetails, and TableID are required"
    );
  }

  if (!validStatuses.includes(Status)) {
    throw new Error("Invalid status");
  }

  try {
    // Check if there's an existing order for the TableID
    const [existingOrders] = await db
      .promise()
      .query(
        "SELECT * FROM orders WHERE TableID = ? ORDER BY OrderID DESC LIMIT 1",
        [TableID]
      );

    if (
      existingOrders.length === 0 ||
      existingOrders[0].Status === "Completed" ||
      existingOrders[0].Status === "Received"
    ) {
      // No existing orders or the latest order is completed, insert a new order with status 'Received'
      const insertQuery =
        "INSERT INTO orders (RestaurantID, CustomerID, Status, TotalAmount,OrderDate, TableID) VALUES (?, ?, 'Received', ?,?, ?)";
      const insertValues = [
        RestaurantID,
        CustomerID,
        TotalAmount,
        OrderDate,
        TableID,
      ];
      const [result] = await db.promise().query(insertQuery, insertValues);
      OrderID = result.insertId;

      // Insert data into orderdetails table
      for (const detail of OrderDetails) {
        const { MenuID, quantity, Price } = detail;
        const insertDetailsQuery =
          "INSERT INTO orderdetails (OrderID, MenuID, Quantity, Price, isServed) VALUES (?, ?, ?, ?, ?)";
        const insertDetailsValues = [OrderID, MenuID, quantity, Price, "No"];
        await db.promise().query(insertDetailsQuery, insertDetailsValues);
      }
    } else {
      // There is an existing order that is not completed, update this order
      const currentOrder = existingOrders[0];
      OrderID = currentOrder.OrderID;

      // Update the order details
      const updateQuery =
        "UPDATE orders SET RestaurantID = ?, CustomerID = ?, Status = ?, TotalAmount = ?,OrderDate = ?, TableID = ? WHERE OrderID = ?";
      const updateValues = [
        RestaurantID,
        CustomerID,
        Status,
        TotalAmount,
        OrderDate,
        TableID,
        OrderID,
      ];
      await db.promise().query(updateQuery, updateValues);


      // DELETE previous items before inserting new ones after items rejected by restaurant 
      await db.promise().query("DELETE FROM orderdetails WHERE OrderID = ?", [OrderID]);

      // 🔁 Insert fresh order items
      for (const detail of OrderDetails) {
        const { MenuID, quantity, Price } = detail;
        const insertDetailsQuery =
          "INSERT INTO orderdetails (OrderID, MenuID, Quantity, Price, isServed) VALUES (?, ?, ?, ?, ?)";
        const insertDetailsValues = [OrderID, MenuID, quantity, Price, "No"];
        await db.promise().query(insertDetailsQuery, insertDetailsValues);
      }


      // Insert or update data into orderdetails table
      // for (const detail of OrderDetails) {
      //   const { MenuID, quantity, Price } = detail;
      //   // Check if the detail already exists
      //   const [existingDetails] = await db
      //     .promise()
      //     .query(
      //       "SELECT * FROM orderdetails WHERE OrderID = ? AND MenuID = ?",
      //       [OrderID, MenuID]
      //     );

      //   if (existingDetails.length === 0) {
      //     // If detail does not exist, insert it
      //     const insertDetailsQuery =
      //       "INSERT INTO orderdetails (OrderID, MenuID, Quantity, Price, isServed) VALUES (?, ?, ?, ?, ?)";
      //     const insertDetailsValues = [OrderID, MenuID, quantity, Price, "No"];
      //     await db.promise().query(insertDetailsQuery, insertDetailsValues);
      //   } else {
      //     // If detail exists, update the quantity and price
      //     const updateDetailsQuery =
      //       "UPDATE orderdetails SET Quantity = ?, Price = ? WHERE OrderID = ? AND MenuID = ?";
      //     const updateDetailsValues = [quantity, Price, OrderID, MenuID];
      //     await db.promise().query(updateDetailsQuery, updateDetailsValues);
      //   }
      // }


    }

    return { OrderID };
  } catch (err) {
    console.error("Error in addOrderService:", err);
    throw err;
  }
};

const getOrderByTableIdService = async (TableID) => {
  if (!TableID) {
    throw new Error("TableID is required");
  }

  try {
    console.log("Fetching order for TableID:", TableID); // Log the TableID

    // Fetch the latest order for the given TableID that is not completed
    const [orders] = await db
      .promise()
      .query(
        "SELECT * FROM orders WHERE TableID = ? AND Status <> 'Completed' ORDER BY OrderID DESC LIMIT 1",
        [TableID]
      );

    if (orders.length === 0) {
      console.log("No order found for TableID:", TableID); // Log if no order is found
      throw new Error("Order not found");
    }

    const latestOrder = orders[0];
    console.log("Order details:", latestOrder); // Log the order details
    const OrderID = latestOrder.OrderID;

    // Fetch order details with menu information
    const [orderDetails] = await db.promise().query(
      `SELECT od.OrderDetailID, od.MenuID, od.Quantity, od.Price, od.isServed,
              m.ItemName, m.ItemDescription, m.CategoryID,
              c.CategoryName
       FROM orderdetails od
       JOIN menus m ON od.MenuID = m.MenuID
       JOIN categories c ON m.CategoryID = c.CategoryID
       WHERE od.OrderID = ?
       ORDER BY od.OrderDetailID DESC`, // Ensuring the order details are fetched in descending order by OrderDetailID
      [OrderID]
    );

    console.log("Order details fetched:", orderDetails); // Log the order details

    return {
      OrderID: OrderID,
      order: latestOrder,
      orderDetails: orderDetails,
    };
  } catch (error) {
    console.error("Error fetching order by TableID:", error);
    throw error;
  }
};



const getAllOrderByTableIdService = async (TableID) => {
  if (!TableID) {
    throw new Error("TableID is required");
  }

  try {
    console.log("Fetching order for TableID:", TableID); // Log the TableID

    // Fetch the latest order for the given TableID that is not completed
    const [orders] = await db
      .promise()
      .query(
        "SELECT * FROM orders WHERE TableID = ? ORDER BY OrderID DESC LIMIT 1",
        [TableID]
      );

    if (orders.length === 0) {
      console.log("No order found for TableID:", TableID); // Log if no order is found
      throw new Error("Order not found");
    }

    const latestOrder = orders[0];
    console.log("Order details:", latestOrder); // Log the order details
    const OrderID = latestOrder.OrderID;

    // Fetch order details with menu information
    const [orderDetails] = await db.promise().query(
      `SELECT od.OrderDetailID, od.MenuID, od.Quantity, od.Price, od.isServed,
              m.ItemName, m.ItemDescription, m.CategoryID,
              c.CategoryName
       FROM orderdetails od
       JOIN menus m ON od.MenuID = m.MenuID
       JOIN categories c ON m.CategoryID = c.CategoryID
       WHERE od.OrderID = ?
       ORDER BY od.OrderDetailID DESC`, // Ensuring the order details are fetched in descending order by OrderDetailID
      [OrderID]
    );

    console.log("Order details fetched:", orderDetails); // Log the order details

    return {
      OrderID: OrderID,
      order: latestOrder,
      orderDetails: orderDetails,
    };
  } catch (error) {
    console.error("Error fetching order by TableID:", error);
    throw error;
  }
};




// Adding a customer
const addCustomer = async (data) => {
  const { Name, PhoneNumber, Email, RestaurantID } = data;
  if (!Name) {
    throw new Error("Name cannot be null or undefined");
  }
  if (!PhoneNumber) {
    throw new Error("PhoneNumber cannot be null or undefined");
  }
  if (!Email) {
    throw new Error("Email cannot be null or undefined");
  }
  if (!RestaurantID) {
    throw new Error("RestaurantID cannot be null or undefined");
  }

  try {
    const result = await db
      .promise()
      .query(
        `INSERT INTO customers (Name, PhoneNumber, Email, RestaurantID) VALUES (?, ?, ?, ?)`,
        [Name, PhoneNumber, Email, RestaurantID]
      );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findAllCustomers = async function (RestaurantID) {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM customers WHERE RestaurantID = ?", [RestaurantID]);
    return rows;
  } catch (err) {
    console.error("Error in findAllCustomers:", err);
    throw err;
  }
};

// Fetch customer by ID
const getCustomerById = async (customerId) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM customers WHERE CustomerID = ?", [customerId]);
    if (rows.length === 0) {
      throw new Error("Customer not found");
    }
    return rows[0];
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw new Error(error.message);
  }
};

// Edit customer
const editCustomer = async (customerId, customerData) => {
  try {
    const { name, email, phoneNumber, restaurantId } = customerData;
    const result = await db
      .promise()
      .query(
        "UPDATE customers SET Name = ?, Email = ?, PhoneNumber = ?, RestaurantID = ? WHERE CustomerID = ?",
        [name, email, phoneNumber, restaurantId, customerId]
      );

    if (result[0].affectedRows === 0) {
      throw new Error("Customer not found");
    }
    return result;
  } catch (error) {
    console.error("Error editing customer:", error);
    throw new Error(error.message);
  }
};

// Delete customer
const deleteCustomer = async (customerId) => {
  try {
    const result = await db
      .promise()
      .query("DELETE FROM customers WHERE CustomerID = ?", [customerId]);

    if (result[0].affectedRows === 0) {
      throw new Error("Customer not found");
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error(error.message);
  }
};

const getAllOrder = async function (RestaurantID, page, limit) {
  try {
    const offset = (page - 1) * limit;

    const [rows] = await db
      .promise()
      .query("SELECT * FROM orders WHERE RestaurantID = ? LIMIT ? OFFSET ?", [
        RestaurantID,
        limit,
        offset,
      ]);

    const [countResult] = await db
      .promise()
      .query("SELECT COUNT(*) as total FROM orders WHERE RestaurantID = ?", [
        RestaurantID,
      ]);
    const total = countResult[0].total;

    return { orders: rows, total };
  } catch (err) {
    console.error("Error in orders:", err);
    throw err;
  }
};

/**
 * Fetch All Orders based on Customer ID
 *
 */

const getOrderByCustomerID = async function (
  RestaurantID,
  CustomerID,
  page,
  limit
) {
  try {
    const offset = (page - 1) * limit;

    // Fetch orders
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM orders WHERE RestaurantID = ? AND CustomerID = ? LIMIT ? OFFSET ?",
        [RestaurantID, CustomerID, limit, offset]
      );

    // Fetch total count of orders
    const [countResult] = await db
      .promise()
      .query(
        "SELECT COUNT(*) as total FROM orders WHERE RestaurantID = ? AND CustomerID = ?",
        [RestaurantID, CustomerID]
      );

    const total = countResult[0].total;

    return { orders: rows, total };
  } catch (err) {
    console.error("Error in fetching orders By Customer:", err);
    throw err;
  }
};

/**
 * Cancelling the order only if the customer's order is received and not started to process.
 */
const changeOrderStatusService = async function (OrderID, newStatus) {

  // Enum for valid statuses
  const validStatuses = [
    "Received",
    "Processing",
    "Ready for pickup",
    "Saved",
    "Completed",
    "Cancelled",
    "Paid",
    "Refunded",
    "Accepted",
    "Rejected"
  ];



  // Validate the new status
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status");
  }



  try {
    // Check the current status of the order
    const [order] = await db
      .promise()
      .query("SELECT Status FROM orders WHERE OrderID = ?", [OrderID]);
    if (order.length === 0) {
      throw new Error("Order not found");
    }

    const currentStatus = order[0].Status;

    // Allow cancellation only if the current status is "Received"
    if (currentStatus !== "Received" && newStatus === "Cancelled") {
      throw new Error(
        "Order can only be cancelled if it is in 'Received' status"
      );
    }

    // Update the status
    const text = "UPDATE orders SET Status = ? WHERE OrderID = ?";
    const values = [newStatus, OrderID];



    const result = await db.promise().query(text, values);
    return result;
  } catch (err) {
    console.error("Error in changeOrderStatus:", err);
    throw err;
  }
};

//editing the order based on status

const editOrderService = async function ({
  OrderID,
  RestaurantID,
  CustomerID,
  Status,
  TotalAmount,
}) {
  // Enum for valid statuses
  const validStatuses = [
    "Received",
    "Processing",
    "Ready for pickup",
    "Saved",
    "Completed",
    "Cancelled",
    "Paid",
    "Refunded",
    "Accepted",
    "Rejected"
  ];

  // Validate input
  if (!OrderID || !RestaurantID || !CustomerID || !Status || !TotalAmount) {
    throw new Error("All fields are required");
  }

  // Validate Status
  if (!validStatuses.includes(Status)) {
    throw new Error("Invalid status");
  }

  try {
    // Fetch the current status of the order
    const [order] = await db
      .promise()
      .query("SELECT Status FROM orders WHERE OrderID = ?", [OrderID]);
    if (order.length === 0) {
      throw new Error("Order not found");
    }

    const currentStatus = order[0].Status;

    // Check conditions
    if (currentStatus === "Received") {
      // Allow CRUD operations
      const text =
        "UPDATE orders SET RestaurantID = ?, CustomerID = ?, Status = ?, TotalAmount = ? WHERE OrderID = ?";
      const values = [RestaurantID, CustomerID, Status, TotalAmount, OrderID];
      const result = await db.promise().query(text, values);
      return result;
    } else if (currentStatus === "Processing") {
      // Allow CRU operations (not delete)
      if (Status === "Cancelled") {
        throw new Error("Cannot cancel order in 'Processing' status");
      }
      const text =
        "UPDATE orders SET RestaurantID = ?, CustomerID = ?, Status = ?, TotalAmount = ? WHERE OrderID = ?";
      const values = [RestaurantID, CustomerID, Status, TotalAmount, OrderID];
      const result = await db.promise().query(text, values);
      return result;
    } else {
      throw new Error("Cannot modify order in current status");
    }
  } catch (err) {
    console.error("Error in editOrderService:", err);
    throw err;
  }
};

//Deleting the order only if order status is receive

const deleteOrderService = async function (OrderID) {
  try {
    // Fetch the current status of the order
    const [order] = await db
      .promise()
      .query("SELECT Status FROM orders WHERE OrderID = ?", [OrderID]);
    if (order.length === 0) {
      throw new Error("Order not found");
    }

    const currentStatus = order[0].Status;

    // Check condition
    if (currentStatus !== "Received") {
      throw new Error(
        "Order can only be deleted if it is in 'Received' status"
      );
    }

    // Proceed with deleting the order
    const result = await db
      .promise()
      .query("DELETE FROM orders WHERE OrderID = ?", [OrderID]);
    return result;
  } catch (err) {
    console.error("Error in deleteOrderService:", err);
    throw err;
  }
};

/**
 * Get Menu Based on Table ID
 * The Table ID will determine the Menu
 * Restaurant ID will link both menu
 */

const getMenuByTableID = async function (TableID) {
  try {
    const query = `
      SELECT t.RestaurantID, t.TableID, m.MenuID, m.Price, m.ItemName, m.ItemDescription, m.Image, m.CategoryID, c.CategoryName, m.MenuStatus, r.RestaurantName, r.Address
      FROM tables t
      JOIN menus m ON t.RestaurantID = m.RestaurantID
      JOIN categories c ON m.CategoryID = c.CategoryID
      JOIN restaurants r ON t.RestaurantID = r.RestaurantID
      WHERE t.TableID = ?
        AND m.CategoryID IS NOT NULL
        AND m.MenuStatus = 'active'
      ORDER BY 
        CASE 
          WHEN c.CategoryName = 'Appetizers' THEN 1
          WHEN c.CategoryName = 'Sides' THEN 3
          WHEN c.CategoryName = 'Beverages' THEN 4
          WHEN c.CategoryName = 'Desserts' THEN 5
          ELSE 2
        END, 
        c.CategoryName;
    `;

    const [rows] = await db.promise().query(query, [TableID]);

    if (rows.length === 0) {
      return null;
    }

    // Extract Restaurant details
    const restaurantDetails = {
      RestaurantID: rows[0].RestaurantID,
      TableID: rows[0].TableID,
      RestaurantName: rows[0].RestaurantName,
      Address: rows[0].Address,
      MenuStatus: rows[0].MenuStatus,
    };

    // Extract Menu items
    const menuItems = rows.map((row) => ({
      MenuID: row.MenuID,
      Price: row.Price,
      ItemName: row.ItemName,
      ItemDescription: row.ItemDescription,
      Image: row.Image,
      CategoryID: row.CategoryID,
      CategoryName: row.CategoryName,
    }));

    return {
      restaurantDetails,
      menuItems,
    };
  } catch (err) {
    console.error("Error in getMenuByTableID:", err);
    throw err;
  }
};

// get order id by orderDetailID
const findOrderIDService = async function (orderDetailIds) {
  try {
    const placeholders = orderDetailIds.map(() => "?").join(", ");
    const query = `
      SELECT DISTINCT OrderID 
      FROM orderdetails 
      WHERE OrderDetailID IN (${placeholders})
    `;

    const [rows] = await db.query(query, orderDetailIds);

    const orderID = rows?.OrderID ?? null;
    return orderID;
  } catch (err) {
    console.error("Error in getting Order Id from order detail id:", err);
    throw err;
  }
};


// add rejected order into table
const addRejectedOrderService = async (items) => {
  for (const item of items) {
    const orderId = item.orderId;
    const rejectedItems = item.rejectedItems;

    const rejectedItemsJSON = JSON.stringify(rejectedItems);

    const query = `
      INSERT INTO rejectedorders (OrderID, rejectedOrder)
      VALUES (?, ?)
    `;
    await db.query(query, [orderId, rejectedItemsJSON]);
  }

  return {
    orderId: items[items.length - 1].orderId,
    rejectedItems: items[items.length - 1].rejectedItems,
  };
};


const findRejectedOrderService = async (orderId) => {
  const query = `
    SELECT * FROM rejectedorders
    WHERE OrderID = ?
    ORDER BY id DESC
    LIMIT 1
  `;


  const [rows] = await db.query(query, [orderId]);
  return rows;
};



const saveUserActivityService = async ({ userId, tableId, restaurantId, stage }) => {

  const query = `
    INSERT INTO logs (user_id, table_id, rest_id, stage)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db
    .promise()
    .query(query, [userId, tableId, restaurantId, stage]);


  return {
    id: result.insertId,
    userId,
    tableId,
    restaurantId,
    stage
  };
}



const getAllActivityService = async () => {
  const query = `
    SELECT DISTINCT user_id, table_id, rest_id, stage, created_at
    FROM logs
    ORDER BY created_at DESC
  `;
  const [rows] = await db.promise().query(query);
  return rows;
};





module.exports = {
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

};
