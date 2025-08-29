const express = require("express");
const {
  Login,
  Register,
  restaurantRegisteration,
  fetchAllRestaurantsMenus,
  getAllRestaurantOrdersController,
  fetchMenuByRestaurantIDController,
  editMenuItemController
} = require("./controller.js");

const uploadFoodImage = require('../middleWare/foodUpload.js');

const router = express.Router();

router.post("/login", Login);
router.post("/register", Register);

router.post("/restaurant-registeration", restaurantRegisteration);


router.get("/fetchAllMenus", fetchAllRestaurantsMenus);

router.get("/AllOrders", getAllRestaurantOrdersController);

router.get("/menu/:restaurantID", fetchMenuByRestaurantIDController);

router.put('/menu/edit/:menuID',uploadFoodImage.single('image'), editMenuItemController)


module.exports = router;
