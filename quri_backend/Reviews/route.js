const express = require("express");
const {
  addReview,
  fetchReviewsByRestaurant,
  editReview,
  deleteReview,
} = require("./controller.js");

const router = express.Router();

router.post("/", addReview);
router.get("/", fetchReviewsByRestaurant);
router.put("/:ReviewID", editReview);
router.delete("/:ReviewID", deleteReview);

module.exports = router;
