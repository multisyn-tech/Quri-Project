const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
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
  editCategoryService,
  deleteCategoryService,
  FetchQRCodeService,
  fetchPopularDishesService,
  editMenuStatusService
} = require("./service.js");

dotenv.config();
const { exec } = require('child_process');
const secretKey = process.env.JWT_SECRET;

/**
 * Add a new Table.
 */

const AddTable = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    const RestaurantID = decodedToken.restaurantId;

    console.log("RestaurantID ", RestaurantID);

    const table = await addTableService({ ...req.body, RestaurantID });

    return res.status(200).json({ message: "Table added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add table" });
  }
};

/**
 * Fetch all restaurant tables.
 */
const GetTables = async (req, res) => {
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

    const tables = await getAllTablesService(restaurantId);

    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Failed to get tables" });
  }
};

/**
 * Removing a table
 */

const removeTable = async (req, res) => {
  const { TableID } = req.params;

  try {
    const result = await removeTableService(TableID);
    res
      .status(200)
      .json({ message: "Table removed successfully", success: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
/**
 * Restaurant logic
 */

//Creating a restaurant

const createRestaurant = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { adminId, restaurantId } = await createRestaurantService(
      req.body,
      req.file
    );

    console.log(
      "Restaurant created with adminId:",
      adminId,
      "and restaurantId:",
      restaurantId
    );
    res.status(201).json({
      message: "Restaurant created successfully",
      adminId,
      restaurantId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Fetching a restaurant

const fetchAllRestaurants = async (req, res) => {
  try {
    const restaurants = await fetchAllRestaurantsService();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//FetchRestaurantByID
const fetchRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const restaurant = await getRestaurantById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Editing a restaurant
const editRestaurant = async (req, res) => {
  const { RestaurantID } = req.params;
  try {
    console.log("Incoming request body:", req.body);
    console.log("Uploaded file:", req.file);

    const success = await editRestaurantService(
      RestaurantID,
      req.body,
      req.file
    );
    if (success) {
      res.status(200).json({ message: "Restaurant updated successfully" });
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Deleting a restaurant
const deleteRestaurant = async (req, res) => {
  const { RestaurantID } = req.params;

  if (!RestaurantID) {
    return res.status(400).json({ message: "Restaurant ID is required" });
  }

  try {
    const success = await deleteRestaurantService(RestaurantID);

    if (success) {
      res.status(200).json({ message: "Restaurant deleted successfully" });
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Changed from 400 to 500 for server errors
  }
};

/**
 * Menu Logic
 */

//  const addMenu = async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

//     if (!token) {
//       throw new Error('No token provided');
//     }

//     const decodedToken = jwt.verify(token, secretKey);

//     if (!decodedToken) {
//       throw new Error('Failed to authenticate token');
//     }

//     const restaurantId = decodedToken.restaurantId;

//     const menuId = await addMenuService(req.body, restaurantId);

//     res.status(201).json({ message: "Menu item added successfully", menuId });
//   } catch (error) {
//     console.error('Error adding menu item:', error.message);
//     res.status(400).json({ message: error.message });
//   }
// };

const addMenu = async (req, res) => {
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

    // Pass req.body (data) and req.file (uploaded image) to the service
    const menuId = await addMenuService(req.body, restaurantId, req.file);

    res.status(201).json({ message: "Menu item added successfully", menuId });
  } catch (error) {
    console.error("Error adding menu item:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Fetch all menus for a specific restaurant
const fetchAllMenus = async (req, res) => {
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

    const menus = await fetchAllMenusService(restaurantId);

    res.status(200).json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error.message);
    res.status(400).json({ message: error.message });
  }
};

//Fetch Single Menu
const getMenuItem = async (req, res) => {
  const { MenuId } = req.params;

  try {
    const MenuItem = await getMenuItemService(MenuId);
    res.status(200).json(MenuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error.message);
    res.status(400).json({ message: error.message });
  }
};



// const editMenu = async (req, res) => {
//   const { MenuID } = req.params;
//   try {
//     const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

//     if (!token) {
//       throw new Error("No token provided");
//     }

//     const decodedToken = jwt.verify(token, secretKey);

//     if (!decodedToken) {
//       throw new Error("Failed to authenticate token");
//     }

//     const restaurantId = decodedToken.restaurantId;

//     console.log("Received data in editMenu:", req.body);
//     console.log("File uploaded:", req.file);

//     // if (req.file == "undefined" || req.file == undefined) {
//     //   res.status(408).json({ message: "Uplaod Image or Paste Image URL" });
//     // }

//     const updatedMenu = { ...req.body, RestaurantID: restaurantId };

//     if (!updatedMenu || Object.keys(updatedMenu).length === 0) {
//       throw new Error("Invalid input data");
//     }

//     const success = await editMenuService(
//       restaurantId,
//       MenuID,
//       updatedMenu,
//       req.file
//     );

//     if (success) {
//       res.status(200).json({ message: "Menu item updated successfully" });
//     } else {
//       res.status(404).json({ message: "Menu item not found" });
//     }
//   } catch (error) {
//     console.error("Error updating menu item:", error.message);
//     res.status(400).json({ message: error.message });
//   }
// };

const editMenu = async (req, res) => {
  const { MenuID } = req.params;
  const { ItemName, ItemDescription, Price, CategoryID, MenuStatus, Image } = req.body;
  const file = req.file;

  // console.log('MenuID:', MenuID);
  // console.log('Received data in editMenu:', req.body);
  // console.log('File uploaded:', file);

  try {
    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!decodedToken) {
      throw new Error('Failed to authenticate token');
    }

    const restaurantId = decodedToken.restaurantId;

    // Validate input data
    if (!ItemName || !ItemDescription || !Price || !CategoryID || !MenuStatus) {
      throw new Error('All fields except Image are required');
    }

    const updatedMenu = { ItemName, ItemDescription, Price, CategoryID, MenuStatus, Image };

    const success = await editMenuService(restaurantId, MenuID, updatedMenu, file);

    if (success) {
      return res.status(200).json({ message: 'Menu item updated successfully' });
    } else {
      return res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error('Error updating menu item:', error.message);
    return res.status(400).json({ message: error.message });
  }
};




const editMenuStatus = async (req, res) => {
  const { MenuID } = req.params;
  const { MenuStatus } = req.body;

  try {
    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Use environment variable for secret
    if (!decodedToken) {
      throw new Error('Failed to authenticate token');
    }

    const restaurantId = decodedToken.restaurantId;

    // Validate MenuStatus
    if (!MenuStatus || !['active', 'inactive'].includes(MenuStatus)) {
      throw new Error('MenuStatus must be "active" or "inactive"');
    }

    // Call service function with MenuID and MenuStatus
    const success = await editMenuStatusService(restaurantId, MenuID, MenuStatus);

    if (success) {
      return res.status(200).json({ message: 'Menu status updated successfully', MenuStatus });
    } else {
      return res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error('Error updating menu status:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

// Delete a menu item
const deleteMenu = async (req, res) => {
  const { MenuID } = req.params;
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

    const success = await deleteMenuService(MenuID, restaurantId);
    if (success) {
      res.status(200).json({ message: "Menu item deleted successfully" });
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Order Details logic
 */

// Add an order detail
const addOrderDetail = async (req, res) => {
  try {
    const orderDetailId = await addOrderDetailService(req.body);
    res.status(201).json({ success: true, orderDetailId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all order details based on OrderID
const getAllOrderDetails = async (req, res) => {
  try {
    const { OrderID } = req.params; // Extracting OrderID from request params
    if (!OrderID) {
      return res
        .status(400)
        .json({ success: false, message: "OrderID is required" });
    }

    const { orderDetails, customerDetails } = await fetchAllOrderDetailsService(
      OrderID
    );

    res.status(200).json({
      success: true,
      orderDetails,
      customerDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const refreshOrders = async (req, res) => {
  const { id } = req.body;  

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  exec(id, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: `Error: ${stderr}` });
    }

    res.status(200).json({ message: 'Sucessful', output: stdout });
  });
}


// Edit an order detail
const editOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await editOrderDetailService(id, req.body);
    if (updated) {
      res
        .status(200)
        .json({ success: true, message: "Order detail updated successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Order detail not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove an order detail
const removeOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await removeOrderDetailService(id);
    if (removed) {
      res
        .status(200)
        .json({ success: true, message: "Order detail removed successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Order detail not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**Category Logic
 *
 */

// Add a category
const addCategory = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    const RestaurantID = decodedToken.restaurantId;

    const categoryId = await addCategoryService({ ...req.body, RestaurantID });

    return res
      .status(201)
      .json({ message: "Category added successfully", categoryId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add category" });
  }
};

// Fetch all categories for a specific restaurant
const fetchAllCategories = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    const RestaurantID = decodedToken.restaurantId;

    const categories = await fetchAllCategoriesService(RestaurantID);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Edit a category
const editCategory = async (req, res) => {
  const { CategoryID } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    const RestaurantID = decodedToken.restaurantId;

    const success = await editCategoryService(CategoryID, {
      ...req.body,
      RestaurantID,
    });

    if (success) {
      res.status(200).json({ message: "Category updated successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { CategoryID } = req.params;
  try {
    const success = await deleteCategoryService(CategoryID);
    if (success) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// QR Code Fetching
const fetchQRCodeDetailsController = async (req, res) => {
  try {
    const { QRCode } = req.params;

    const result = await FetchQRCodeService(QRCode);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// getting Popular Dishes function
const fetchPopularDishesController = async (req, res) => {
  const { restId } = req.body;

  try {
    if (!restId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required.",
        data: [],
      });
    }

    const favoriteItems = await fetchPopularDishesService(restId);

    if (
      !favoriteItems.success ||
      !favoriteItems.data ||
      favoriteItems.data.length === 0
    ) {
      return res.status(200).json({
        success: true,
        message: "No popular dishes found.",
        data: [],
      });
    }

    return res.status(200).json(favoriteItems);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      data: [],
      error: error.message,
    });
  }
};

module.exports = {
  AddTable,
  GetTables,
  removeTable,
  createRestaurant,
  fetchAllRestaurants,
  fetchRestaurantById,
  editRestaurant,
  deleteRestaurant,
  addMenu,
  fetchAllMenus,
  getMenuItem,
  editMenu,
  deleteMenu,
  addOrderDetail,
  getAllOrderDetails,
  editOrderDetail,
  removeOrderDetail,
  addCategory,
  fetchAllCategories,
  editCategory,
  refreshOrders,
  deleteCategory,
  fetchQRCodeDetailsController,
  fetchPopularDishesController,
  editMenuStatus,
};
