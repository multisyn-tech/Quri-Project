 const reportQueries = {
    total_sales: {
      query: `
        SELECT SUM(TotalAmount) as total_sales
        FROM orders
        WHERE RestaurantID = ? AND Status = "Completed";
      `,
      params: (RestaurantID) => [RestaurantID],
    },
    sales_by_item: {
      query: `
        SELECT 
          m.ItemName,
          SUM(od.Quantity * od.Price) as total_sales
        FROM 
          orderdetails od
        JOIN 
          menus m ON od.MenuID = m.MenuID
        JOIN 
          orders o ON od.OrderID = o.OrderID
        WHERE 
          o.RestaurantID = ? AND o.OrderDate BETWEEN ? AND ?
        GROUP BY 
          m.ItemName;
      `,
      params: (RestaurantID, startDate, endDate) => [RestaurantID, startDate, endDate],
    },
    sales_by_category: {
      query: `
        SELECT 
          c.CategoryName,
          SUM(od.Quantity * od.Price) as total_sales
        FROM 
          orderdetails od
        JOIN 
          menus m ON od.MenuID = m.MenuID
        JOIN 
          categories c ON m.CategoryID = c.CategoryID
        JOIN 
          orders o ON od.OrderID = o.OrderID
        WHERE 
          o.RestaurantID = ? AND o.OrderDate BETWEEN ? AND ?
        GROUP BY 
          c.CategoryName;
      `,
      params: (RestaurantID, startDate, endDate) => [RestaurantID, startDate, endDate],
    },
    sales_over_time: {
      query: `
        SELECT 
          DATE(o.OrderDate) as date,
          SUM(o.TotalAmount) as total_sales
        FROM 
          orders o
        WHERE 
          o.RestaurantID = ? AND OrderDate BETWEEN ? AND ?
        GROUP BY 
          DATE(o.OrderDate);
      `,
      params: (RestaurantID, startDate, endDate) => [RestaurantID, startDate, endDate],
    },
    total_customers: {
      query: `
        SELECT COUNT(*) as total_customers
        FROM customers
        WHERE RestaurantID = ?;
      `,
      params: (RestaurantID) => [RestaurantID],
    },
    total_products: {
      query: `
        SELECT COUNT(*) as total_menu_items
        FROM menus
        WHERE RestaurantID = ?;
      `,
      params: (RestaurantID) => [RestaurantID],
    },
    total_orders: {
      query: `
        SELECT COUNT(*) as total_orders
        FROM orders
        WHERE RestaurantID = ?;
      `,
      params: (RestaurantID) => [RestaurantID],
    },
    orders: {
      query: `
        SELECT 
          o.orderID,
          o.TotalAmount,
          o.Status,
          c.Name
        FROM 
          orders o
        JOIN 
          customers c ON o.customerID = c.customerID
        WHERE 
          o.RestaurantID = ? AND o.OrderDate BETWEEN ? AND ?
        LIMIT ? OFFSET ?
      `,
      params: (RestaurantID, startDate, endDate, limit, offset) => [RestaurantID, startDate, endDate, limit, offset],
      countQuery: `
        SELECT COUNT(*) as total
        FROM 
          orders
        WHERE 
          RestaurantID = ? AND OrderDate BETWEEN ? AND ?
      `,
      countParams: (RestaurantID, startDate, endDate) => [RestaurantID, startDate, endDate],
    },
  };

  module.exports={
    reportQueries
  }