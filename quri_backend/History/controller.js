const { customerOrderDetails } = require("./service.js");
const dotenv = require("dotenv");

dotenv.config();

const getCustomerOrderDetails = async (req, res) => {
  const { CustomerID } = req.params;

  try {
    // Fetch order details
    const result = await customerOrderDetails(CustomerID);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in orders:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};

module.exports = {
  getCustomerOrderDetails
};
