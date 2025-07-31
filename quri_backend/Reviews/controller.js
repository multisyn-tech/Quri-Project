const {
  addReviewService,
  fetchReviewsByRestaurantService,
  editReviewService,
  deleteReviewService,
} = require("./service.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.JWT_SECRET;

// Add a review
const addReview = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    // Ensure CustomerID is coming from request body for testing purposes
    const reviewData = {
      ...req.body,
      CustomerID: decodedToken.userId || req.body.CustomerID,
    }; // Assuming the token contains userId

    const reviewId = await addReviewService(reviewData);

    res.status(201).json({ message: "Review added successfully", reviewId });
  } catch (error) {
    console.error("Error adding review:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Fetch reviews by RestaurantID
const fetchReviewsByRestaurant = async (req, res) => {
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

    const reviews = await fetchReviewsByRestaurantService(restaurantId);

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Edit a review
const editReview = async (req, res) => {
  const { ReviewID } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    const success = await editReviewService(ReviewID, req.body);

    if (success) {
      res.status(200).json({ message: "Review updated successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { ReviewID } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format "Bearer TOKEN"

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new Error("Failed to authenticate token");
    }

    const success = await deleteReviewService(ReviewID);
    if (success) {
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  fetchReviewsByRestaurant,
  editReview,
  deleteReview,
};
