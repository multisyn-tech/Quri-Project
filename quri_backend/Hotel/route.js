const express = require("express");
const {
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
  deleteCategory,
  fetchQRCodeDetailsController,
  fetchPopularDishesController
} = require("./controller.js");

const uploadFoodImage = require('../middleWare/foodUpload.js');

const uploadImage = require("../middleWare/middleware.js");

const router = express.Router();

// Table logic
router.post("/table", AddTable);
router.get("/table", GetTables);

router.delete("/removeTable/:TableID", removeTable);


//Restaurant logic
router.post("/createRestaurant", uploadImage.single("image"), createRestaurant);

router.get("/fetchRestaurant", fetchAllRestaurants);

router.get("/fetch/:restaurantId", fetchRestaurantById);

router.put("/edit/:RestaurantID", uploadImage.single("image"), editRestaurant);

router.delete("/delete/:RestaurantID", deleteRestaurant);

//Menu logic

// router.post("/addMenu", addMenu);

router.post("/addMenu", uploadFoodImage.single('image'), addMenu);

router.get("/fetchMenu", fetchAllMenus);

router.get("/menu/:MenuId", getMenuItem);

router.put("/menu/edit/:MenuID", uploadFoodImage.single('image'), editMenu);

router.delete("/menu/delete/:MenuID", deleteMenu);

// Order Details

router.post("/orderdetails", addOrderDetail);

router.get("/orderdetails/:OrderID", getAllOrderDetails);

router.put("/orderdetails/:id", editOrderDetail);

router.delete("/orderdetails/:id", removeOrderDetail);

//Category

router.post("/categories", addCategory);
router.get("/categories", fetchAllCategories);
router.put('/categories/:CategoryID', editCategory);
router.delete('/categories/:CategoryID', deleteCategory);


// get popular dishes (most ordered dishes)
router.post("/popular-dishes", fetchPopularDishesController);


// QR CODE SCAN DYNAMIC 
router.get('/QRDetails/:QRCode',fetchQRCodeDetailsController);


module.exports = router;
