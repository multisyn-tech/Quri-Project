import express from "express";
import {
  addPayment,
  getAllPayments,
  editPayment,
  removePayment,
  addPaymentType, 
  getAllPaymentTypes, 
  editPaymentType, 
  removePaymentType,
  addPaymentOptionAvailable, 
  getAllPaymentOptionsAvailable, 
  editPaymentOptionAvailable, 
  removePaymentOptionAvailable 
} from "./controller.js";

const router = express.Router();

// Route to add a new payment
router.post("/", addPayment);

// Route to get all payments
router.get("/", getAllPayments);

// Route to edit a payment
router.put("/:id", editPayment);

// Route to remove a payment
router.delete("/:id", removePayment);



/**
 * Payment Type logic
 */

// Route to add a new payment type
router.post('/paymenttypes', addPaymentType);

// Route to get all payment types
router.get('/paymenttypes', getAllPaymentTypes);

// Route to edit a payment type
router.put('/paymenttypes/:id', editPaymentType);

// Route to remove a payment type
router.delete('/paymenttypes/:id', removePaymentType);


/**
 * Payment Options available
 */

// Route to add a new payment option available
router.post('/paymentoptionsavailable', addPaymentOptionAvailable);

// Route to get all payment options available
router.get('/paymentoptionsavailable', getAllPaymentOptionsAvailable);

// Route to edit a payment option available
router.put('/paymentoptionsavailable/:id', editPaymentOptionAvailable);

// Route to remove a payment option available
router.delete('/paymentoptionsavailable/:id', removePaymentOptionAvailable);


export default router;
