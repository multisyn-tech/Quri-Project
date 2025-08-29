const express = require("express");
const {
  Login,
  AddAdmin,
  VerifyEmail,
  CheckVerification,
  resendEmail,
} = require("./controller.js");

const router = express.Router();

router.post("/login", Login);
router.post("/add", AddAdmin);

router.get("/verify-email/:token", VerifyEmail);
router.get("/check-verification", CheckVerification);

// Route to resend verification email
router.post("/resendVerificationEmail",  resendEmail);

module.exports = router;
