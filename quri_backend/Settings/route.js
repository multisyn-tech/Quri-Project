const express = require("express");
const {
  createSettingController,
  fetchAllSettingsController,
  createOrUpdateSettingsController,
  fetchSettingsController,
  workingHoursController,
  fetchWorkingHoursController,
} = require("./controller.js");

const upload = require("../middleWare/middleware.js");

const router = express.Router();

router.post("/", upload.single("image"), createSettingController);
router.get("/", fetchAllSettingsController);
router.post("/data", createOrUpdateSettingsController);
router.get("/fetch/:RestaurantID", fetchSettingsController);
router.post("/working-hours", workingHoursController);
router.get("/working-hours/:RestaurantID", fetchWorkingHoursController);

module.exports = router;
