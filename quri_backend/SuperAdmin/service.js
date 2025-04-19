const db = require("../db/db.js");
const path = require('path');
//Fetch all restaurants Menu
const getAllRestaurantsMenus = async () => {
  try {
    // SQL query to fetch the restaurant and menu details
    const [rows] = await db.promise().query(`
        SELECT 
          ra.RestaurantID, 
          r.RestaurantName, 
          m.MenuID, 
          m.ItemName, 
          m.ItemDescription, 
          m.Price, 
          m.Image, 
          m.CategoryID, 
          m.MenuStatus,
          c.CategoryName
        FROM 
          restaurantadmins ra
        JOIN 
          restaurants r ON ra.RestaurantID = r.RestaurantID
        JOIN 
          menus m ON ra.RestaurantID = m.RestaurantID
        JOIN 
          categories c on m.CategoryID = c.CategoryID;
      `);

    // Group menus by RestaurantID
    const groupedMenus = rows.reduce((acc, menu) => {
      const { RestaurantID, RestaurantName, ...menuDetails } = menu;

      if (!acc[RestaurantID]) {
        acc[RestaurantID] = {
          RestaurantID,
          RestaurantName,
          menus: [],
        };
      }
      acc[RestaurantID].menus.push(menuDetails);

      return acc;
    }, {});

    // Return grouped menus as an array
    return Object.values(groupedMenus);
  } catch (error) {
    // Handle any errors that occur during query execution
    console.error("Error fetching restaurants' menus:", error);
    throw error;
  }
};

// Fetch all restaurant orders
const getAllRestaurantOrders = async () => {
  try {
    // SQL query to fetch the restaurant and order details
    const [rows] = await db.promise().query(`
       SELECT 
    ra.RestaurantID, 
    r.RestaurantName, 
    o.*, 
    od.*, 
    m.ItemName, 
    c.CategoryName
FROM 
    restaurantadmins ra
JOIN 
    restaurants r ON ra.RestaurantID = r.RestaurantID
JOIN 
    orders o ON ra.RestaurantID = o.RestaurantID
JOIN 
    orderdetails od ON o.OrderID = od.OrderID
JOIN 
    menus m ON od.MenuID = m.MenuID        
JOIN 
    categories c ON m.CategoryID = c.CategoryID ;
      `);

    // Group orders by RestaurantID
    const groupedOrders = rows.reduce((acc, order) => {
      const {
        RestaurantID,
        RestaurantName,
        OrderID,
        OrderDate,
        OrderStatus,
        TotalAmount,
        ...orderDetails
      } = order;

      if (!acc[RestaurantID]) {
        acc[RestaurantID] = {
          RestaurantID,
          RestaurantName,
          orders: {},
        };
      }

      // Group order details by OrderID
      if (!acc[RestaurantID].orders[OrderID]) {
        acc[RestaurantID].orders[OrderID] = {
          OrderID,
          OrderDate,
          OrderStatus,
          TotalAmount,
          orderDetails: [],
        };
      }

      acc[RestaurantID].orders[OrderID].orderDetails.push(orderDetails);

      return acc;
    }, {});

    // Convert grouped orders to an array with nested order details
    return Object.values(groupedOrders).map((restaurant) => ({
      ...restaurant,
      orders: Object.values(restaurant.orders),
    }));
  } catch (error) {
    // Handle any errors that occur during query execution
    console.error("Error fetching restaurants' orders:", error);
    throw error;
  }
};


// Fetch menu based on restaurant ID
const getMenuByRestaurantID = async (restaurantID) => {
  try {
    // SQL query to fetch menu based on restaurant ID
    const [rows] = await db.promise().query(`
      SELECT m.MenuID, m.ItemName, m.ItemDescription, m.Price, m.Image, m.CategoryID, m.MenuStatus, ra.RestaurantID, c.CategoryName
      FROM restaurantadmins ra
      JOIN menus m ON m.restaurantID = ra.RestaurantID
      JOIN categories c ON c.CategoryID = m.CategoryID
      WHERE ra.RestaurantID = ?;
    `, [restaurantID]);

    if (rows.length === 0) {
      return null;
    }

    const { RestaurantID, ...menuDetails } = rows[0];
    const menuItems = rows.map(({ RestaurantID, ...menu }) => menu);

    return {
      RestaurantID,
      menuItems
    };
  } catch (error) {
    // Handle any errors that occur during query execution
    console.error("Error fetching menu by restaurant ID:", error);
    throw error;
  }
};

// Edit Menu Item
const editMenuItem = async (menuId, data, file) => {
  const { ItemName, ItemDescription, Price, Image, MenuStatus } = data;

  console.log("Received MenuStatus:", MenuStatus);
  console.log("Received file:", file);
  console.log("Menu ID:", menuId);

  // Validate MenuStatus
  const validMenuStatuses = ["active", "inactive"];
  if (!validMenuStatuses.includes(MenuStatus)) {
    throw new Error("Invalid MenuStatus. Must be 'active' or 'inactive'");
  }

  try {
    let imageUrl;

    if (file) {
      // If a file was uploaded, save its path as the image URL
      imageUrl = `uploads/food/${path.basename(file.path)}`;
    } else if (Image && Image.startsWith("http")) {
      // If no file but Image URL is provided, use that
      imageUrl = Image;
    } else {
      throw new Error("Image is required either as a file or a URL.");
    }

    // Proceed with updating the menu item
    const [result] = await db.promise().query(
      `UPDATE menus 
         SET ItemName = ?, 
             ItemDescription = ?, 
             Price = ?, 
             Image = ?, 
             MenuStatus = ? 
         WHERE MenuID = ?`,
      [
        ItemName,
        ItemDescription,
        Price,
        imageUrl, // Use the generated or provided image URL
        MenuStatus,
        menuId,
      ]
    );

    return result.affectedRows > 0; // Returns true if the menu item was updated successfully
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw new Error(error.message);
  }
};




module.exports = {
  getAllRestaurantsMenus,
  getAllRestaurantOrders,
  getMenuByRestaurantID,
  editMenuItem  
};
