const express = require("express");
const {
  billPaymentController,
  getStripePaymentsController,
  customBillCheckoutController,
  splitBillCheckoutController,
  getNGeniusPaymentController,
  handleAirpayPayment,
  handleGPayPaymentController,
  handleApplePayPaymentController,
  getPlateNumbers
} = require("./controller.js");

const router = express.Router();

router.post("/full-bill-checkout", billPaymentController);

router.post("/split-bill-checkout", splitBillCheckoutController);

router.post("/custom-bill-amount-checkout", customBillCheckoutController);

router.get("/stripe-payments", getStripePaymentsController);

router.post("/n-genius-payment", getNGeniusPaymentController)

router.post("/airpay-payment-sendData", handleAirpayPayment)

router.post("/process-gpay-payment", handleGPayPaymentController)

router.post("/handle-applepay-payment", handleApplePayPaymentController)

router.get("/get-platenumbers", getPlateNumbers)

module.exports = router;
