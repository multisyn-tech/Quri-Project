const express = require("express");
const { getCustomerOrderDetails } = require("./controller.js");
const router = express.Router();

router.get('/:CustomerID', getCustomerOrderDetails);

module.exports = router;
