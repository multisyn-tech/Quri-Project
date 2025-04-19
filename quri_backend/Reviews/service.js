const db = require("../db/db.js");

// Add a Review
const addReviewService = async (data) => {
    const { RestaurantID, MenuID, OrderID, CustomerID, Rating, Comments } = data;
  
    // Validate Rating
    const validRatings = ['1', '2', '3', '4', '5'];
    if (!validRatings.includes(Rating)) {
      throw new Error("Invalid Rating. Must be '1', '2', '3', '4', or '5'");
    }
  
    try {
      // Proceed with inserting the review
      const [result] = await db.promise().query(
        `INSERT INTO reviews (RestaurantID, MenuID, OrderID, CustomerID, Rating, Comments) VALUES (?, ?, ?, ?, ?, ?)`,
        [RestaurantID, MenuID, OrderID, CustomerID, Rating, Comments]
      );
  
      return result.insertId; // Ensure to access insertId from the correct object
    } catch (error) {
      console.error('Error executing query:', error.message);
      throw new Error(error.message);
    }
  };


// Fetch Reviews
 const fetchReviewsByRestaurantService = async (RestaurantID) => {
  try {
    const [reviews] = await db.promise().query(
      `SELECT 
         r.ReviewID,
         r.RestaurantID,
         r.MenuID,
         m.ItemName,
         r.OrderID,
         r.CustomerID,
         c.Name AS CustomerName,
         r.Rating,
         r.Comments,
         r.CreatedAt
       FROM reviews r
       LEFT JOIN menus m ON r.MenuID = m.MenuID
       LEFT JOIN customers c ON r.CustomerID = c.CustomerID
       WHERE r.RestaurantID = ?`,
      [RestaurantID]
    );
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    throw new Error(error.message);
  }
};



// Edit a review 
 const editReviewService = async (ReviewID, data) => {
    const { RestaurantID, MenuID, OrderID, CustomerID, Rating, Comments } = data;
  
    // Validate Rating
    const validRatings = ['1', '2', '3', '4', '5'];
    if (!validRatings.includes(Rating)) {
      throw new Error("Invalid Rating. Must be '1', '2', '3', '4', or '5'");
    }
  
    try {
      // Proceed with updating the review
      const [result] = await db.promise().query(
        `UPDATE reviews SET RestaurantID = ?, MenuID = ?, OrderID = ?, CustomerID = ?, Rating = ?, Comments = ? WHERE ReviewID = ?`,
        [RestaurantID, MenuID, OrderID, CustomerID, Rating, Comments, ReviewID]
      );
  
      return result.affectedRows > 0; // Ensure to check affectedRows from the correct object
    } catch (error) {
      console.error('Error executing query:', error.message);
      throw new Error(error.message);
    }
  };
  
  // Delete a review
   const deleteReviewService = async (ReviewID) => {
    try {
      const [result] = await db.promise().query(
        `DELETE FROM reviews WHERE ReviewID = ?`,
        [ReviewID]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting review:', error.message);
      throw new Error(error.message);
    }
  };

  

  module.exports = {
    addReviewService,
    fetchReviewsByRestaurantService,
    editReviewService,
    deleteReviewService
  };