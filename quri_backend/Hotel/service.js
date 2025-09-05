const db = require("../db/db.js");
const path = require("path");
const bcrypt = require("bcrypt");

// Helper function to generate restaurantID
const generateRandomRestaurantID = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// Helper function to generate a random restaurant name
const generateRandomRestaurantName = () => {
  const adjectives = [
    "Delicious",
    "Spicy",
    "Cozy",
    "Tasty",
    "Gourmet",
    "Fresh",
    "Savory",
    "Zesty",
    "Hearty",
  ];
  const nouns = [
    "Bistro",
    "Grill",
    "Kitchen",
    "Cafe",
    "Diner",
    "Eatery",
    "Spot",
    "Place",
    "Corner",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective} ${randomNoun}`;
};

//Valid Status
const validStatus = ["Active", "Inactive"];

const addTableService = async (data) => {
  const { RestaurantID, QRCode, Type } = data;

  try {
    // Check if RestaurantID exists
    const [restaurant] = await db
      .promise()
      .query(`SELECT * FROM restaurants WHERE RestaurantID = ?`, [
        RestaurantID,
      ]);
    if (restaurant.length === 0) {
      throw new Error("Invalid RestaurantID, Restaurant Doesn't exist");
    }

    // Proceed with inserting the table
    await db
      .promise()
      .query(`INSERT INTO tables (RestaurantID, QRCode, Type) VALUES(?, ?, ?)`, [
        RestaurantID,
        QRCode,
        Type
      ]);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllTablesService = async (restaurantId) => {
  try {
    const [tables] = await db
      .promise()
      .query("SELECT * FROM tables WHERE RestaurantID = ?", [restaurantId]);
    return tables;
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeTableService = async (TableID) => {
  try {
    // Check if the table exists
    const [table] = await db
      .promise()
      .query(`SELECT * FROM tables WHERE TableID = ?`, [TableID]);

    if (table.length === 0) {
      throw new Error("Table not found");
    }

    // Proceed with deleting the table
    await db.promise().query(`DELETE FROM tables WHERE TableID = ?`, [TableID]);
    return true;
  } catch (error) {
    console.error("Error in removeTableService:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Restaurant logic
 */

/**
 * Creating a restaurant
 */

const createRestaurantService = async (data, file) => {
  const restaurantID = generateRandomRestaurantID();
  const {
    Username,
    Password,
    restaurantName,
    restaurantAddress,
    phoneNumber,
    description,
    status,
  } = data;

  // Hash the password
  const hashedPassword = await bcrypt.hash(Password, 10);
  /**
   * It is just dummy generator, not needed since in my table I made restaurant ID and restaurant Name cannot be null.
   * I just made it so that it does not give error, however we dont need it.
   */
  // const restaurantName = generateRandomRestaurantName();

  if (!validStatus.includes(status)) {
    throw new Error(
      `Invalid status. Status must be one of: ${validStatus.join(", ")}`
    );
  }

  // Prepare settings array, including restaurantName
  const settings = [
    { KeyID: "restaurantName", Value: restaurantName },
    { KeyID: "restaurantAddress", Value: restaurantAddress },
    { KeyID: "phoneNumber", Value: phoneNumber },
    { KeyID: "description", Value: description },
  ];

  try {
    // Step 1: Check if the username already exists
    const existingUserResult = await db.query(
      `SELECT * FROM restaurantadmins WHERE Username = ?`,
      [Username]
    );

    if (existingUserResult.length > 0) {
      // Username already exists
      throw new Error(
        "Username already exists. Please choose a different one."
      );
    }

    // Step 2: Insert into `restaurantadmins` table
    const adminInsertResult = await db.query(
      `INSERT INTO restaurantadmins (Username, Password, RestaurantID, verificationToken, Role, isVerified) VALUES (?, ?, ?, null, 'restaurant', 1)`,
      [Username, hashedPassword, restaurantID]
    );

    // Step 3: Insert into `restaurants` table
    const restaurantInsertResult = await db.query(
      `INSERT INTO restaurants (RestaurantID, RestaurantName, Address, PhoneNumber, CreatedAt,status) VALUES (?, ?, null, null, NOW(),?)`,
      [restaurantID, restaurantName, status]
    );

    // Step 4: Insert multiple settings into `settings` table
    for (const { KeyID, Value } of settings) {
      await db.query(
        `INSERT INTO settings (RestaurantID, KeyID, Value) VALUES (?, ?, ?)`,
        [restaurantID, KeyID, Value]
      );
    }

    // Step 5: Insert the image path into the `settings` table if the image is uploaded
    if (file) {
      const imagePath = `uploads/${file.filename}`; // Get the file path
      await db.query(
        `INSERT INTO settings (RestaurantID, KeyID, Value) VALUES (?, ?, ?)`,
        [restaurantID, "image", imagePath]
      );
    }

    return {
      adminId: adminInsertResult.insertId,
      restaurantId: restaurantInsertResult.insertId,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Fetching all restaurants with their settings and admin usernames
 */

const fetchAllRestaurantsService = async () => {
  try {
    // Fetch all restaurants along with the admin username
    const restaurants = await db.query(
      `SELECT r.RestaurantID, r.RestaurantName, r.status, ra.Username 
       FROM restaurants r
       JOIN restaurantadmins ra ON r.RestaurantID = ra.RestaurantID
       WHERE r.status IS NOT NULL`
    );

    // Iterate over each restaurant and fetch associated settings from `settings` table
    for (const restaurant of restaurants) {
      const settings = await db.query(
        `SELECT KeyID, Value FROM settings WHERE RestaurantID = ?`,
        [restaurant.RestaurantID]
      );

      // Map settings to the restaurant object
      for (const { KeyID, Value } of settings) {
        restaurant[KeyID] = Value;
      }
    }

    return restaurants;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Fetch by ID
 */

const getRestaurantById = async (restaurantId) => {
  try {
    // Fetch restaurant details along with admin username
    const [restaurantRows] = await db.promise().query(
      `SELECT r.RestaurantID, r.RestaurantName, r.status, ra.Username 
         FROM restaurants r 
         JOIN restaurantadmins ra ON r.RestaurantID = ra.RestaurantID
         WHERE r.RestaurantID = ?`,
      [restaurantId]
    );

    if (restaurantRows.length === 0) {
      throw new Error("Restaurant not found");
    }

    const restaurant = restaurantRows[0];

    // Fetch restaurant settings
    const [settingsRows] = await db
      .promise()
      .query("SELECT KeyID, Value FROM settings WHERE RestaurantID = ?", [
        restaurantId,
      ]);

    // Map settings into the restaurant object
    for (const { KeyID, Value } of settingsRows) {
      restaurant[KeyID] = Value; // Add settings as key-value pairs
    }

    return restaurant; // Return restaurant with settings and username
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Editing a restaurant
 */

// Service for editing a restaurant
const editRestaurantService = async (RestaurantID, data, file) => {
  const {
    restaurantName,
    restaurantAddress,
    phoneNumber,
    description,
    status,
    Username,
  } = data;

  try {
    // Step 1: Update the `restaurants` table
    const restaurantUpdateResult = await db.query(
      `UPDATE restaurants SET RestaurantName = ?, status = ? WHERE RestaurantID = ?`,
      [restaurantName, status, RestaurantID]
    );

    // If no rows are affected, the restaurant doesn't exist
    if (restaurantUpdateResult.affectedRows === 0) {
      return false;
    }

    // Step 2: Update the `restaurantadmins` table (only update Username if provided)
    if (Username) {
      await db.query(
        `UPDATE restaurantadmins SET Username = ? WHERE RestaurantID = ?`,
        [Username, RestaurantID]
      );
    }

    // Step 3: Update the `settings` table for other restaurant information
    const settings = [
      { KeyID: "restaurantAddress", Value: restaurantAddress },
      { KeyID: "phoneNumber", Value: phoneNumber },
      { KeyID: "description", Value: description },
    ];

    for (const { KeyID, Value } of settings) {
      await db.query(
        `INSERT INTO settings (RestaurantID, KeyID, Value)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE Value = ?`,
        [RestaurantID, KeyID, Value, Value]
      );
    }

    // Step 4: Update the image if a new one is uploaded
    if (file) {
      const imagePath = `uploads/${file.filename}`; // Get the file path
      await db.query(
        `INSERT INTO settings (RestaurantID, KeyID, Value)
         VALUES (?, 'image', ?)
         ON DUPLICATE KEY UPDATE Value = ?`,
        [RestaurantID, imagePath, imagePath]
      );
    }

    return true; // Indicate success
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Deleting a restaurant
 */
const deleteRestaurantService = async (RestaurantID) => {
  try {
    // Start a transaction to ensure all or none of the deletions happen
    await db.query("START TRANSACTION");

    // Delete from `restaurantadmins` where the RestaurantID matches
    await db.query(`DELETE FROM restaurantadmins WHERE RestaurantID = ?`, [
      RestaurantID,
    ]);

    // Delete from `settings` where the RestaurantID matches
    await db.query(`DELETE FROM settings WHERE RestaurantID = ?`, [
      RestaurantID,
    ]);

    // Finally, delete from `restaurants` where the RestaurantID matches
    const result = await db.query(
      `DELETE FROM restaurants WHERE RestaurantID = ?`,
      [RestaurantID]
    );

    // If the restaurant deletion was successful, commit the transaction
    if (result.affectedRows > 0) {
      await db.query("COMMIT");
      return true;
    } else {
      // If no restaurant was found/deleted, rollback the transaction
      await db.query("ROLLBACK");
      return false;
    }
  } catch (error) {
    // In case of an error, rollback the transaction and throw the error
    await db.query("ROLLBACK");
    throw new Error(error.message);
  }
};

/**
 * Menu logic
 */

// Add a menu
// const addMenuService = async (data, restaurantId) => {
//   const { ItemName, ItemDescription, Price, Image, CategoryID, MenuStatus } =
//     data;

//   // Validate MenuStatus
//   const validMenuStatuses = ["active", "inactive"];
//   if (!validMenuStatuses.includes(MenuStatus)) {
//     throw new Error("Invalid MenuStatus. Must be 'active' or 'inactive'");
//   }

//   try {
//     // Verify CategoryID exists for the given RestaurantID
//     const [categories] = await db
//       .promise()
//       .query(
//         `SELECT CategoryID FROM categories WHERE RestaurantID = ? AND CategoryID = ?`,
//         [restaurantId, CategoryID]
//       );

//     if (categories.length === 0) {
//       throw new Error("Invalid CategoryID for the given RestaurantID");
//     }

//     // Proceed with inserting the menu item
//     const [result] = await db
//       .promise()
//       .query(
//         `INSERT INTO menus (RestaurantID, ItemName, ItemDescription, Price, Image, CategoryID, MenuStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [
//           restaurantId,
//           ItemName,
//           ItemDescription,
//           Price,
//           Image,
//           CategoryID,
//           MenuStatus,
//         ]
//       );

//     return result.insertId; // Ensure to access insertId from the correct object
//   } catch (error) {
//     console.error("Error executing query:", error.message);
//     throw new Error(error.message);
//   }
// };

const addMenuService = async (data, restaurantId, file) => {
  const { ItemName, ItemDescription, Price, Image, CategoryID, MenuStatus } =
    data;

  console.log("Received MenuStatus:", MenuStatus);

  // Validate MenuStatus
  const validMenuStatuses = ["active", "inactive"];
  if (!validMenuStatuses.includes(MenuStatus)) {
    throw new Error("Invalid MenuStatus. Must be 'active' or 'inactive'");
  }

  try {
    // Verify CategoryID exists for the given RestaurantID
    const [categories] = await db
      .promise()
      .query(
        `SELECT CategoryID FROM categories WHERE RestaurantID = ? AND CategoryID = ?`,
        [restaurantId, CategoryID]
      );

    if (categories.length === 0) {
      throw new Error("Invalid CategoryID for the given RestaurantID");
    }

    let imageUrl;

    if (file) {
      // If a file was uploaded, save its path as the image URL
      imageUrl = `food-uploads/${path.basename(file.path)}`;
    } else if (Image) {
      // If no file but Image URL is provided, use that
      imageUrl = Image;
    } else {
      throw new Error("Image is required either as a file or a URL.");
    }

    // Proceed with inserting the menu item
    const [result] = await db
      .promise()
      .query(
        `INSERT INTO menus (RestaurantID, ItemName, ItemDescription, Price, Image, CategoryID, MenuStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          restaurantId,
          ItemName,
          ItemDescription,
          Price,
          imageUrl, // Use the generated or provided image URL
          CategoryID,
          MenuStatus,
        ]
      );

    return result.insertId; // Return the insert ID
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw new Error(error.message);
  }
};

//Fetching single Menu Item
// const getMenuItemService = async (menuId) => {
//   try {
//     const [rows] = await db.promise().query(
//       `SELECT
//           m.*,
//           c.CategoryName
//         FROM
//           menus m
//         JOIN
//           categories c ON m.CategoryID = c.CategoryID
//         WHERE
//           m.MenuID = ?`,
//       [menuId]
//     );

//     if (rows.length === 0) {
//       throw new Error("Menu item not found");
//     }

//     return rows[0];
//   } catch (error) {
//     console.error("Error fetching menu item:", error.message);
//     throw new Error(error.message);
//   }
// };

const getMenuItemService = async (menuId) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
          m.*,
          c.CategoryName 
        FROM 
          menus m
        JOIN 
          categories c ON m.CategoryID = c.CategoryID
        WHERE 
          m.MenuID = ?`,
      [menuId]
    );

    if (rows.length === 0) {
      throw new Error("Menu item not found");
    }

    const menuItem = rows[0];

    // Determine if the image is a local file or an internet URL
    let imageSource = "url"; // Default is URL
    if (menuItem.Image.startsWith("food-uploads/")) {
      imageSource = "uploaded"; // If it's a local file
    }

    return {
      ...menuItem,
      imageSource, // Add imageSource field to the result
    };
  } catch (error) {
    console.error("Error fetching menu item:", error.message);
    throw new Error(error.message);
  }
};

// Fetch all menus for a specific restaurant
// const fetchAllMenusService = async (restaurantId) => {
//   try {
//     const [menus] = await db.promise().query(
//       `SELECT
//           m.*,
//           c.CategoryName
//         FROM
//           menus m
//         JOIN
//           categories c ON m.CategoryID = c.CategoryID
//         WHERE
//           m.RestaurantID = ?`,
//       [restaurantId]
//     );
//     return menus;
//   } catch (error) {
//     console.error("Error fetching menus:", error.message);
//     throw new Error(error.message);
//   }
// };

const fetchAllMenusService = async (restaurantId) => {
  try {
    const [menus] = await db.promise().query(
      `SELECT 
          m.*, 
          c.CategoryName 
        FROM 
          menus m
        JOIN 
          categories c ON m.CategoryID = c.CategoryID
        WHERE 
          m.RestaurantID = ?`,
      [restaurantId]
    );

    // Check if each menu item has a file-uploaded image or a URL
    const updatedMenus = menus.map((menu) => {
      const isFileUpload = menu.Image && menu.Image.startsWith("food-uploads/");
      return {
        ...menu,
        isFileUpload, // Boolean to indicate whether the image is a file
        ImageUrl: isFileUpload
          ? `${process.env.BASE_URL}/${menu.Image}`
          : menu.Image, // Construct a full URL if it's a local file
      };
    });

    return updatedMenus;
  } catch (error) {
    console.error("Error fetching menus:", error.message);
    throw new Error(error.message);
  }
};


// const editMenuService = async (restaurantId, MenuID, data, file) => {
//   const { ItemName, ItemDescription, Price, Image, CategoryID, MenuStatus } =
//     data;


//   // Validate MenuStatus
//   const validMenuStatuses = ["active", "inactive"];
//   if (!validMenuStatuses.includes(MenuStatus)) {
//     throw new Error("Invalid MenuStatus. Must be 'active' or 'inactive'");
//   }

//   try {
//     // Verify CategoryID exists for the given RestaurantID
//     const [categories] = await db
//       .promise()
//       .query(
//         `SELECT CategoryID FROM categories WHERE RestaurantID = ? AND CategoryID = ?`,
//         [restaurantId, CategoryID]
//       );

//     if (categories.length === 0) {
//       throw new Error("Invalid CategoryID for the given RestaurantID");
//     }

//     let imageUrl;

//     if (file) {
//       // If a file was uploaded, save its path as the image URL
//       imageUrl = `food-uploads/${path.basename(file.path)}`;
//     } else if (Image) {
//       // If no file but Image URL is provided, use that
//       imageUrl = Image;
//     } else {
//       throw new Error("Image is required either as a file or a URL.");
//     }

//     // Proceed with updating the menu item
//     const [result] = await db.promise().query(
//       `UPDATE menus 
//          SET ItemName = ?, 
//              ItemDescription = ?, 
//              Price = ?, 
//              Image = ?, 
//              CategoryID = ?, 
//              MenuStatus = ? 
//          WHERE MenuID = ? AND RestaurantID = ?`,
//       [
//         ItemName,
//         ItemDescription,
//         Price,
//         imageUrl, // Use the generated or provided image URL
//         CategoryID,
//         MenuStatus,
//         MenuID,
//         restaurantId,
//       ]
//     );

//     return result.affectedRows > 0; // Returns true if the menu item was updated successfully
//   } catch (error) {
//     console.error("Error executing query:", error.message);
//     throw new Error(error.message);
//   }
// };



const editMenuService = async (restaurantId, MenuID, data, file) => {
  const { ItemName, ItemDescription, Price, CategoryID, MenuStatus, Image } = data;

  // Validate MenuStatus
  const validMenuStatuses = ['active', 'inactive'];
  if (!validMenuStatuses.includes(MenuStatus)) {
    throw new Error("Invalid MenuStatus. Must be 'active' or 'inactive'");
  }

  try {

    const [categories] = await db
      .promise()
      .query(
        `SELECT CategoryID FROM categories WHERE RestaurantID = ? AND CategoryID = ?`,
        [restaurantId, CategoryID]
      );

    if (categories.length === 0) {
      throw new Error('Invalid CategoryID for the given RestaurantID');
    }

    const [menu] = await db
      .promise()
      .query(
        `SELECT MenuID FROM menus WHERE MenuID = ? AND RestaurantID = ?`,
        [MenuID, restaurantId]
      );

    if (menu.length === 0) {
      return false;
    }

    let imageUrl = null;
    if (file) {

      imageUrl = `food-uploads/${path.basename(file.path)}`;
    } else if (Image && Image.trim() !== '') {

      imageUrl = Image;
    }


    let query = `UPDATE menus SET ItemName = ?, ItemDescription = ?, Price = ?, CategoryID = ?, MenuStatus = ?`;
    const queryParams = [ItemName, ItemDescription, Price, CategoryID, MenuStatus];

    if (imageUrl) {
      query += `, Image = ?`;
      queryParams.push(imageUrl);
    }

    query += ` WHERE MenuID = ? AND RestaurantID = ?`;
    queryParams.push(MenuID, restaurantId);

    const [result] = await db.promise().query(query, queryParams);

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error executing query:', error.message);
    throw new Error(error.message);
  }
};



const editMenuStatusService = async (restaurantId, MenuID, MenuStatus) => {
  try {

    const [menu] = await db
      .promise()
      .query(
        `SELECT MenuID FROM menus WHERE MenuID = ? AND RestaurantID = ?`,
        [MenuID, restaurantId]
      );



    if (!['active', 'inactive'].includes(MenuStatus)) {
      throw new Error('MenuStatus must be "active" or "inactive"');
    }


    const [result] = await db
      .promise()
      .query(
        `UPDATE menus 
         SET MenuStatus = ? 
         WHERE MenuID = ? AND RestaurantID = ?`,
        [MenuStatus, MenuID, restaurantId]
      );

    if (result.affectedRows === 0) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in editMenuStatusService:', error.message);
    throw error;
  }
};



// Delete a menu item
const deleteMenuService = async (MenuID, RestaurantID) => {
  try {

    await db.promise().query(
      `DELETE FROM orderdetails WHERE MenuID = ?`,
      [MenuID]
    );

    const [result] = await db
      .promise()
      .query(`DELETE FROM menus WHERE MenuID = ? AND RestaurantID = ?`, [
        MenuID,
        RestaurantID,
      ]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting menu item:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Order Details logic
 */

// Add an order detail
const addOrderDetailService = async (data) => {
  const { OrderID, MenuID, Quantity, isServed, Price } = data;
  try {
    // Check if OrderID and MenuID exist
    const order = await db.query(`SELECT * FROM orders WHERE OrderID = ?`, [
      OrderID,
    ]);
    const menu = await db.query(`SELECT * FROM menus WHERE MenuID = ?`, [
      MenuID,
    ]);

    if (order.length === 0) {
      throw new Error("Invalid OrderID");
    }
    if (menu.length === 0) {
      throw new Error("Invalid MenuID");
    }

    // Proceed with inserting the order detail
    const result = await db.query(
      `INSERT INTO orderdetails (OrderID, MenuID, Quantity, isServed, Price) VALUES (?, ?, ?, ?, ?)`,
      [OrderID, MenuID, Quantity, isServed, Price]
    );
    return result.insertId;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch all order details and customer details based on OrderID
const fetchAllOrderDetailsService = async (OrderID) => {
  try {
    const [results] = await db.promise().query(
      `SELECT 
      orderdetails.*, 
      orders.OrderDate, 
      orders.TotalAmount, 
      orders.Status,
      orders.RestaurantID,
      COALESCE(customers.Name, 'N/A') AS CustomerName, 
      COALESCE(customers.Email, 'N/A') AS CustomerEmail, 
      COALESCE(customers.PhoneNumber, 'N/A') AS CustomerPhone,
      COALESCE(menus.MenuID, 0) AS MenuID,
      COALESCE(menus.ItemName, 'N/A') AS ItemName,
      COALESCE(menus.ItemDescription, 'N/A') AS ItemDescription,
      COALESCE(menus.Price, 0) AS MenuPrice,
      COALESCE(menus.CategoryID, 0) AS MenuCategoryID,
      COALESCE(billingaddress.Country, 'N/A') AS BillingCountry,
      COALESCE(billingaddress.City, 'N/A') AS BillingCity,
      COALESCE(billingaddress.ZipCode, 'N/A') AS BillingZipCode,
      COALESCE(restaurants.RestaurantName, 'N/A') AS RestaurantName
FROM orderdetails 
JOIN orders ON orderdetails.OrderID = orders.OrderID 
LEFT JOIN customers ON orders.CustomerID = customers.CustomerID
LEFT JOIN menus ON orderdetails.MenuID = menus.MenuID
LEFT JOIN billingaddress ON customers.CustomerID = billingaddress.CustomerID
LEFT JOIN restaurants ON orders.RestaurantID = restaurants.RestaurantID
WHERE orderdetails.OrderID = ?`,
      [OrderID]
    );

    if (results.length === 0) {
      return { orderDetails: [], customerDetails: {}, menuDetails: [] };
    }

    const orderDetails = {
      OrderID: results[0].OrderID,
      OrderDate: results[0].OrderDate,
      TotalAmount: results[0].TotalAmount,
      Status: results[0].Status,
      RestaurantID: results[0].RestaurantID,
      Restaurant: results[0].RestaurantID,
      RestaurantName: results[0].RestaurantName,
      items: results.map((result) => ({
        ProductID: result.MenuID,
        CategoryID: result.CategoryID,
        ItemName: result.ItemName,
        ItemPrice: result.Price,
        ItemDescription: result.ItemDescription,
        Quantity: result.Quantity,
        UnitPrice: result.UnitPrice,
        Discount: result.Discount,
      })),
    };

    const customerDetails = {
      Name: results[0].Name,
      Email: results[0].Email,
      PhoneNumber: results[0].PhoneNumber,
      Country: results[0].Country,
      City: results[0].City,
      ZipCode: results[0].ZipCode,
    };

    return { orderDetails, customerDetails };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Edit an order detail
const editOrderDetailService = async (OrderDetailID, data) => {
  const { OrderID, MenuID, Quantity, isServed, Price } = data;
  try {
    // Check if the order detail exists
    const [orderDetail] = await db.query(
      `SELECT * FROM orderdetails WHERE OrderDetailID = ?`,
      [OrderDetailID]
    );

    if (orderDetail.length === 0) {
      throw new Error("Order detail not found");
    }

    // Proceed with updating the order detail
    await db.query(
      `UPDATE orderdetails SET OrderID = ?, MenuID = ?, Quantity = ?, isServed = ?, Price = ? WHERE OrderDetailID = ?`,
      [OrderID, MenuID, Quantity, isServed, Price, OrderDetailID]
    );
    return true;
  } catch (error) {
    console.error("Error in editOrderDetailService:", error.message);
    throw new Error(error.message);
  }
};

// Remove an order detail
const removeOrderDetailService = async (OrderDetailID) => {
  try {
    // Check if the order detail exists
    const [orderDetail] = await db.query(
      `SELECT * FROM orderdetails WHERE OrderDetailID = ?`,
      [OrderDetailID]
    );

    if (orderDetail.length === 0) {
      throw new Error("Order detail not found");
    }

    // Proceed with deleting the order detail
    await db.query(`DELETE FROM orderdetails WHERE OrderDetailID = ?`, [
      OrderDetailID,
    ]);
    return true;
  } catch (error) {
    console.error("Error in removeOrderDetailService:", error.message);
    throw new Error(error.message);
  }
};



const addUnitService = async (name, restId) => {
  try {
    await db.query(`INSERT INTO units (name, restId) VALUES (?,?)`, [name, restId]);
    const [rows] = await db.promise().query("SELECT * FROM units");
    return rows;
  } catch (error) {
    throw new Error(error.message);
  }
};


const addAddonService = async (restId, name, unit, price, description) => {
  try {
    await db.query(`INSERT INTO addons (name, unit, price, description, restId) VALUES (?,?,?,?,?)`,
      [name, unit, price, description, restId]
    );
    const [rows] = await db.promise().query("SELECT * FROM addons WHERE restId = ?", [restId]);
    return rows;
  } catch (error) {
    throw new Error(error.message);
  }
}



const getUnitsService = async (restId) => {
  try {
    const [rows] = await db.promise().query(`SELECT * from units WHERE restId = ?`, [restId]);
    return rows
  }
  catch (err) {
    throw new Error(err.message)
  }
}


const getAddonsService = async (restId) => {
  try {
    const [rows] = await db.promise().query(`SELECT * from addons WHERE restId = ?`, [restId]);
    return rows
  }
  catch (err) {
    throw new Error(err.message)
  }
}


const deleteAddonService = async (id) => {
  try {
    const [rows] = await db.promise().query(`DELETE from addons WHERE id = ?`, [id]);
    return true
  }
  catch (err) {
    throw new Error(err.message)
  }
}

const updateAddonService = async (id, name, unit, price, description, restId) => {
  try {
    const [result] = await db.promise().query(
      `UPDATE addons 
       SET name = ?, unit = ?, price = ?, description = ? 
       WHERE id = ? AND restId = ?`,
      [name, unit, price, description, id, restId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Addon not found" });
    }
    return true
  } catch (err) {
    console.error("Error updating addon:", err);
    return false;
  }
}

/**
 * Category Logic
 */

// Add a category
const addCategoryService = async (data) => {
  const { RestaurantID, CategoryName } = data;
  try {
    // Check if RestaurantID exists
    const [restaurant] = await db
      .promise()
      .query(`SELECT * FROM restaurants WHERE RestaurantID = ?`, [
        RestaurantID,
      ]);
    if (restaurant.length === 0) {
      throw new Error("Invalid RestaurantID");
    }

    // Proceed with inserting the category
    const [result] = await db
      .promise()
      .query(
        `INSERT INTO categories (RestaurantID, CategoryName) VALUES(?, ?)`,
        [RestaurantID, CategoryName]
      );
    return result.insertId;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch all categories for a specific restaurant
const fetchAllCategoriesService = async (RestaurantID) => {
  try {
    const [categories] = await db
      .promise()
      .query(`SELECT * FROM categories WHERE RestaurantID = ?`, [RestaurantID]);
    return categories;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Edit a category
const editCategoryService = async (CategoryID, data) => {
  const { RestaurantID, CategoryName } = data;
  try {
    // Check if the category exists
    const [category] = await db
      .promise()
      .query(`SELECT * FROM categories WHERE CategoryID = ?`, [CategoryID]);
    if (category.length === 0) {
      throw new Error("Category not found");
    }

    // Check if RestaurantID exists
    const [restaurant] = await db
      .promise()
      .query(`SELECT * FROM restaurants WHERE RestaurantID = ?`, [
        RestaurantID,
      ]);
    if (restaurant.length === 0) {
      throw new Error("Invalid RestaurantID");
    }

    // Proceed with updating the category
    await db
      .promise()
      .query(
        `UPDATE categories SET CategoryName = ?, RestaurantID = ? WHERE CategoryID = ?`,
        [CategoryName, RestaurantID, CategoryID]
      );
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a category
const deleteCategoryService = async (CategoryID) => {
  try {
    // Check if the category exists
    const [category] = await db
      .promise()
      .query(`SELECT * FROM categories WHERE CategoryID = ?`, [CategoryID]);
    if (category.length === 0) {
      throw new Error("Category not found");
    }

    // Proceed with deleting the category
    await db
      .promise()
      .query(`DELETE FROM categories WHERE CategoryID = ?`, [CategoryID]);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Fetching a QRCode

// export const FetchQRCOdeService = async (QRCode) => {
//   try {
//     // Query to check if QRCode exists and fetch TableID and restaurantID
//     const [rows] = await db
//       .promise()
//       .query(`SELECT TableID, RestaurantID  FROM tables WHERE QRCode = ?`, [
//         QRCode,
//       ]);

//     // Check if any row is returned
//     if (rows.length > 0) {
//       // QR code is valid, return the fetched data
//       return {
//         success: true,
//         message: 'QR Code is valid.',
//         flag:1,
//         data: {
//           QRCode,
//           TableID: rows[0].TableID,
//           RestaurantID: rows[0].RestaurantID,
//         },
//       };
//     } else {
//       // QR code is invalid
//       return {
//         success: false,
//         message: 'Invalid QR Code.',
//         flag:0,
//       };
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

const FetchQRCodeService = async (QRCode) => {
  try {

    const [rows] = await db
      .promise()
      .query(`SELECT TableID, RestaurantID,Type FROM tables WHERE QRCode = ?`, [
        QRCode,
      ]);


    if (rows.length > 0) {
      const { TableID, RestaurantID, Type } = rows[0];

      // Now that the QR code is valid, fetch the settings based on RestaurantID
      const [settingsRows] = await db
        .promise()
        .query(`SELECT * FROM settings WHERE RestaurantID = ?`, [RestaurantID]);

      const settingsData = settingsRows.length > 0 ? settingsRows : [];

      const [orderRows] = await db
        .promise()
        .query(
          `SELECT OrderID, status FROM orders WHERE TableID = ? ORDER BY OrderDate DESC LIMIT 1`,
          [TableID]
        );

      if (orderRows.length > 0) {
        const { OrderID, status: orderStatus } = orderRows[0];


        if (orderStatus === "completed" || orderStatus === "cancelled") {
          // The order is new
          return {
            success: true,
            message: "QR Code is valid, and the order is new.",
            flag: 0,
            data: {
              QRCode,
              TableID,
              Type,
              RestaurantID,
              settings: settingsData, // Include settings data
            },
          };
        } else {
          // The order is existing
          return {
            success: true,
            message: "QR Code is valid, and the order is existing.",
            flag: 1,
            data: {
              QRCode,
              TableID,
              Type,
              RestaurantID,
              OrderID,
              orderStatus,
              settings: settingsData, // Include settings data
            },
          };
        }
      } else {
        // No order exists for this TableID, consider it as a new order
        return {
          success: true,
          message: "QR Code is valid, and no existing order is found.",
          flag: 0,
          data: {
            QRCode,
            TableID,
            Type,
            RestaurantID,
            settings: settingsData, // Include settings data
          },
        };
      }
    } else {
      // QR code is invalid
      return {
        success: false,
        message: "Invalid QR Code.",
        flag: 0,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchPopularDishesService = async (restaurantID) => {
  try {


    // const [rows] = await db.promise().query(
    //   `SELECT 
    //       m.MenuID,
    //       m.ItemName,
    //       m.Price,
    //       m.ItemDescription,
    //       m.Image,
    //       c.CategoryID,
    //       c.CategoryName,
    //       COUNT(od.MenuID) AS total_orders
    //     FROM 
    //       orderdetails od
    //     JOIN 
    //       orders o ON od.OrderID = o.OrderID
    //     JOIN 
    //       menus m ON od.MenuID = m.MenuID
    //     JOIN 
    //       categories c ON m.CategoryID = c.CategoryID
    //     WHERE 
    //       o.RestaurantID = ? AND m.RestaurantID = ?
    //     GROUP BY 
    //       m.MenuID, m.itemName, m.itemDescription, m.Image, m.Price, c.CategoryName
    //     ORDER BY 
    //       total_orders DESC
    //     LIMIT 10`,
    //   [restaurantID, restaurantID]
    // );


    const [rows] = await db.promise().query(
      `SELECT 
        m.MenuID,
        m.ItemName,
        m.Price,
        m.ItemDescription,
        m.Image,
        c.CategoryID,
        c.CategoryName,
        COUNT(od.MenuID) AS total_orders
        FROM 
          orderdetails od
        JOIN 
          orders o ON od.OrderID = o.OrderID
        JOIN 
          menus m ON od.MenuID = m.MenuID
        JOIN 
          categories c ON m.CategoryID = c.CategoryID
        WHERE 
          o.RestaurantID = ? 
          AND m.RestaurantID = ?
          AND c.RestaurantID = ?
        GROUP BY 
          m.MenuID, m.ItemName, m.ItemDescription, m.Image, m.Price, c.CategoryID, c.CategoryName
        ORDER BY 
          total_orders DESC
        LIMIT 10`,
      [restaurantID, restaurantID, restaurantID]
    );


    return {
      success: true,
      message: "Top 10 popular dishes fetched successfully.",
      data: rows,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching popular dishes.",
      error: error.message,
    };
  }
};

module.exports = {
  addTableService,
  getAllTablesService,
  removeTableService,
  createRestaurantService,
  fetchAllRestaurantsService,
  getRestaurantById,
  editRestaurantService,
  deleteRestaurantService,
  addMenuService,
  fetchAllMenusService,
  getMenuItemService,
  editMenuService,
  deleteMenuService,
  addOrderDetailService,
  fetchAllOrderDetailsService,
  editOrderDetailService,
  removeOrderDetailService,
  addCategoryService,
  fetchAllCategoriesService,
  addUnitService,
  addAddonService,
  getUnitsService,
  getAddonsService,
  deleteAddonService,
  updateAddonService,
  editCategoryService,
  deleteCategoryService,
  FetchQRCodeService,
  fetchPopularDishesService,
  editMenuStatusService
};
