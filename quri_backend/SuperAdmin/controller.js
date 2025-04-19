const {
  getAllRestaurantsMenus,
  getAllRestaurantOrders,
  getMenuByRestaurantID,
  editMenuItem
} = require("./service.js");

// Controller to handle fetching all restaurants' menus for the superAdmin
const fetchAllRestaurantsMenus = async (req, res) => {
  try {
    const menus = await getAllRestaurantsMenus();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants' menus." });
  }
};

// Controller to handle the request for fetching all restaurant orders
const getAllRestaurantOrdersController = async (req, res) => {
  try {
    const orders = await getAllRestaurantOrders();
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching restaurant orders",
        error: error.message,
      });
  }
};

// Controller to handle fetching menu based on restaurant ID
const fetchMenuByRestaurantIDController = async (req, res) => {
  const { restaurantID } = req.params;
  try {
    const menu = await getMenuByRestaurantID(restaurantID);
    res.status(200).json(menu);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch menu for the given restaurant ID." });
  }
};

// Controller to handle editing a menu item
const editMenuItemController = async (req, res) => {
  const { menuID } = req.params;
  const data = req.body;
  const file = req.file;

  try {
    const updated = await editMenuItem( menuID, data, file);
    if (updated) {
      res.status(200).json({ message: "Menu item updated successfully." });
    } else {
      res.status(404).json({ error: "Menu item not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  fetchAllRestaurantsMenus,
  getAllRestaurantOrdersController,
  fetchMenuByRestaurantIDController,
  editMenuItemController, 
};
