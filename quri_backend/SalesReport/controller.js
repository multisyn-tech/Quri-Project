const { fetchAllSalesData } = require("./service.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.JWT_SECRET;

 const fetchAllSalesController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      throw new Error('No token provided');
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new Error('Failed to authenticate token');
    }

    const restaurantId = decodedToken.restaurantId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { startDate, endDate } = req.query;

    // Fetch all the sales data
    const reportResults = await fetchAllSalesData(restaurantId, page, limit, startDate, endDate);

    res.status(200).json({
      message: "All reports fetched successfully",
      data: reportResults,
      status: 1,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  fetchAllSalesController
};