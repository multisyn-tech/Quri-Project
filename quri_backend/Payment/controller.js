import {
  addPaymentService,
  fetchAllPaymentsService,
  editPaymentService,
  removePaymentService,
  addPaymentTypeService,
  fetchAllPaymentTypesService,
  editPaymentTypeService,
  removePaymentTypeService,
  addPaymentOptionAvailableService,
  fetchAllPaymentOptionsAvailableService,
  editPaymentOptionAvailableService,
  removePaymentOptionAvailableService,
} from "./service.js";

// Add a payment
export const addPayment = async (req, res) => {
  try {
    const paymentId = await addPaymentService(req.body);
    res.status(201).json({ success: true, paymentId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await fetchAllPaymentsService();
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit a payment
export const editPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await editPaymentService(id, req.body);
    if (updated) {
      res
        .status(200)
        .json({ success: true, message: "Payment updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Payment not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove a payment
export const removePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await removePaymentService(id);
    if (removed) {
      res
        .status(200)
        .json({ success: true, message: "Payment removed successfully" });
    } else {
      res.status(404).json({ success: false, message: "Payment not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Payment Type logic
 */

// Add a payment type
export const addPaymentType = async (req, res) => {
  try {
    const paymentTypeId = await addPaymentTypeService(req.body);
    res.status(201).json({ success: true, paymentTypeId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all payment types
export const getAllPaymentTypes = async (req, res) => {
  try {
    const paymentTypes = await fetchAllPaymentTypesService();
    res.status(200).json({ success: true, paymentTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit a payment type
export const editPaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await editPaymentTypeService(id, req.body);
    if (updated) {
      res
        .status(200)
        .json({ success: true, message: "Payment type updated successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Payment type not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove a payment type
export const removePaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await removePaymentTypeService(id);
    if (removed) {
      res
        .status(200)
        .json({ success: true, message: "Payment type removed successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Payment type not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Payment Options logic
 */

// Add a payment option available
export const addPaymentOptionAvailable = async (req, res) => {
  try {
    const paymentOptionsID = await addPaymentOptionAvailableService(req.body);
    res.status(201).json({ success: true, paymentOptionsID });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all payment options available
export const getAllPaymentOptionsAvailable = async (req, res) => {
  try {
    const paymentOptionsAvailable =
      await fetchAllPaymentOptionsAvailableService();
    res.status(200).json({ success: true, paymentOptionsAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit a payment option available
export const editPaymentOptionAvailable = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await editPaymentOptionAvailableService(id, req.body);
    if (updated) {
      res
        .status(200)
        .json({
          success: true,
          message: "Payment option available updated successfully",
        });
    } else {
      res
        .status(404)
        .json({
          success: false,
          message: "Payment option available not found",
        });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove a payment option available
export const removePaymentOptionAvailable = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await removePaymentOptionAvailableService(id);
    if (removed) {
      res
        .status(200)
        .json({
          success: true,
          message: "Payment option available removed successfully",
        });
    } else {
      res
        .status(404)
        .json({
          success: false,
          message: "Payment option available not found",
        });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
