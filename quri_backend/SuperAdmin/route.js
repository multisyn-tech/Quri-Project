const express = require("express");
const {
  fetchAllRestaurantsMenus,
  getAllRestaurantOrdersController,
  fetchMenuByRestaurantIDController,
  editMenuItemController
} = require("./controller.js");

const uploadFoodImage = require('../middleWare/foodUpload.js');

const router = express.Router();

router.get("/fetchAllMenus", fetchAllRestaurantsMenus);

router.get("/AllOrders", getAllRestaurantOrdersController);

router.get("/menu/:restaurantID", fetchMenuByRestaurantIDController);

router.put('/menu/edit/:menuID',uploadFoodImage.single('image'), editMenuItemController)


module.exports = router;
