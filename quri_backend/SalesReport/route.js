const express = require("express");
const { fetchAllSalesController } = require("./controller.js");

const router = express.Router();

router.get('/sales-report', fetchAllSalesController);

module.exports = router;
