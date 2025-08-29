const db = require("../db/db.js");

const customerOrderDetails = async function (CustomerID) {
  try {
    const query = `
        SELECT 
          o.OrderID,
          o.CustomerID,
          o.Status,
          o.TotalAmount,
          o.OrderDate,
          od.OrderDetailID,
          od.MenuID,
          od.Quantity,
          od.Price,
          od.isServed
        FROM 
          orders o
        JOIN 
          orderdetails od ON o.OrderID = od.OrderID
        WHERE 
          o.CustomerID = ?;
      `;

    const [rows] = await db.promise().query(query, [CustomerID]);

    const result = {
      CustomerID: CustomerID,
      orders: [],
    };

    const ordersMap = new Map();

    rows.forEach((row) => {
      if (!ordersMap.has(row.OrderID)) {
        ordersMap.set(row.OrderID, {
          OrderID: row.OrderID,
          Status: row.Status,
          TotalAmount: row.TotalAmount,
          OrderDate: row.OrderDate,
          orderDetails: [],
        });
      }
      ordersMap.get(row.OrderID).orderDetails.push({
        OrderDetailID: row.OrderDetailID,
        MenuID: row.MenuID,
        Quantity: row.Quantity,
        Price: row.Price,
        isServed: row.isServed,
      });
    });

    result.orders = Array.from(ordersMap.values());

    return result;
  } catch (err) {
    console.error("Error in fetching customer order details:", err);
    throw err;
  }
};

module.exports = {
  customerOrderDetails,
};
