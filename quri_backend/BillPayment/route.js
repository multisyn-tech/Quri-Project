const express = require("express");
const {
  billPaymentController,
  getStripePaymentsController,
  customBillCheckoutController,
  splitBillCheckoutController,
} = require("./controller.js");

const router = express.Router();

router.post("/full-bill-checkout", billPaymentController);

router.post("/split-bill-checkout", splitBillCheckoutController);

router.post("/custom-bill-amount-checkout", customBillCheckoutController);


router.get("/stripe-payments", getStripePaymentsController);

module.exports = router;
