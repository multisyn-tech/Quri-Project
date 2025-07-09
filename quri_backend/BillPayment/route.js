const express = require("express");
const {
  billPaymentController,
  getStripePaymentsController,
  customBillCheckoutController,
  splitBillCheckoutController,
  getNGeniusPaymentController,
  getAirpayController,
  handleGPayPaymentController,
  handleApplePayPaymentController
} = require("./controller.js");

const router = express.Router();

router.post("/full-bill-checkout", billPaymentController);

router.post("/split-bill-checkout", splitBillCheckoutController);

router.post("/custom-bill-amount-checkout", customBillCheckoutController);

router.get("/stripe-payments", getStripePaymentsController);

router.post("/n-genius-payment", getNGeniusPaymentController)

router.post("/airpay-payment", getAirpayController)

router.post("/process-gpay-payment", handleGPayPaymentController)

router.post("/handle-applepay-payment", handleApplePayPaymentController)

module.exports = router;
