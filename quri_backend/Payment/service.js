import db from "../db/db.js";

/**
 * Payments logic
 */

// Add a payment
export const addPaymentService = async (data) => {
  const { OrderID, PaymentMethod, Amount } = data;
  try {
    // Check if OrderID exists
    const order = await db.query(
      `SELECT * FROM Orders WHERE OrderID = ?`,
      [OrderID]
    );

    if (order.length === 0) {
      throw new Error("Invalid OrderID");
    }

    // Check if PaymentMethod is valid
    if (!['card', 'cash'].includes(PaymentMethod)) {
      throw new Error("Invalid PaymentMethod");
    }

    // Proceed with inserting the payment
    const result = await db.query(
      `INSERT INTO Payments (OrderID, PaymentMethod, Amount) VALUES (?, ?, ?)`,
      [OrderID, PaymentMethod, Amount]
    );
    return result.insertId;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch all payments
export const fetchAllPaymentsService = async () => {
  try {
    const payments = await db.query(`SELECT * FROM Payments`);
    return payments;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Edit a payment
export const editPaymentService = async (PaymentID, data) => {
  const { OrderID, PaymentMethod, Amount } = data;
  try {
    // Check if the payment exists
    const [payment] = await db.query(
      `SELECT * FROM Payments WHERE PaymentID = ?`,
      [PaymentID]
    );

    if (payment.length === 0) {
      throw new Error("Payment not found");
    }

    // Check if PaymentMethod is valid
    if (!['card', 'cash'].includes(PaymentMethod)) {
      throw new Error("Invalid PaymentMethod");
    }

    // Proceed with updating the payment
    await db.query(
      `UPDATE Payments SET OrderID = ?, PaymentMethod = ?, Amount = ? WHERE PaymentID = ?`,
      [OrderID, PaymentMethod, Amount, PaymentID]
    );
    return true;
  } catch (error) {
    console.error("Error in editPaymentService:", error.message);
    throw new Error(error.message);
  }
};

// Remove a payment
export const removePaymentService = async (PaymentID) => {
  try {
    // Check if the payment exists
    const [payment] = await db.query(
      `SELECT * FROM Payments WHERE PaymentID = ?`,
      [PaymentID]
    );

    if (payment.length === 0) {
      throw new Error("Payment not found");
    }

    // Proceed with deleting the payment
    await db.query(
      `DELETE FROM Payments WHERE PaymentID = ?`,
      [PaymentID]
    );
    return true;
  } catch (error) {
    console.error("Error in removePaymentService:", error.message);
    throw new Error(error.message);
  }
};


/**
 * Payment Type method 
 */

// Add a payment type
export const addPaymentTypeService = async (data) => {
  const { PaymentTypeName, PaymentTypeImage } = data;
  try {
    const result = await db.query(
      `INSERT INTO PaymentType (PaymentTypeName, PaymentTypeImage) VALUES (?, ?)`,
      [PaymentTypeName, PaymentTypeImage]
    );
    return result.insertId;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch all payment types
export const fetchAllPaymentTypesService = async () => {
  try {
    const paymentTypes = await db.query(`SELECT * FROM PaymentType`);
    return paymentTypes;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Edit a payment type
export const editPaymentTypeService = async (PaymentTypeID, data) => {
  const { PaymentTypeName, PaymentTypeImage } = data;
  try {
    // Check if the payment type exists
    const [paymentType] = await db.query(
      `SELECT * FROM PaymentType WHERE PaymentTypeID = ?`,
      [PaymentTypeID]
    );

    if (paymentType.length === 0) {
      throw new Error("Payment type not found");
    }

    // Proceed with updating the payment type
    await db.query(
      `UPDATE PaymentType SET PaymentTypeName = ?, PaymentTypeImage = ? WHERE PaymentTypeID = ?`,
      [PaymentTypeName, PaymentTypeImage, PaymentTypeID]
    );
    return true;
  } catch (error) {
    console.error("Error in editPaymentTypeService:", error.message);
    throw new Error(error.message);
  }
};

// Remove a payment type
export const removePaymentTypeService = async (PaymentTypeID) => {
  try {
    // Check if the payment type exists
    const [paymentType] = await db.query(
      `SELECT * FROM PaymentType WHERE PaymentTypeID = ?`,
      [PaymentTypeID]
    );

    if (paymentType.length === 0) {
      throw new Error("Payment type not found");
    }

    // Proceed with deleting the payment type
    await db.query(
      `DELETE FROM PaymentType WHERE PaymentTypeID = ?`,
      [PaymentTypeID]
    );
    return true;
  } catch (error) {
    console.error("Error in removePaymentTypeService:", error.message);
    throw new Error(error.message);
  }
};


/**
 * Payment Service Options
 */

// Add a payment option available
export const addPaymentOptionAvailableService = async (data) => {
  const { RestaurantID, PaymentTypeID } = data;
  try {
    // Check if RestaurantID exists
    const restaurant = await db.query(
      `SELECT * FROM Restaurants WHERE RestaurantID = ?`,
      [RestaurantID]
    );

    if (restaurant.length === 0) {
      throw new Error("Invalid RestaurantID");
    }

    // Check if PaymentTypeID exists
    const paymentType = await db.query(
      `SELECT * FROM PaymentType WHERE PaymentTypeID = ?`,
      [PaymentTypeID]
    );

    if (paymentType.length === 0) {
      throw new Error("Invalid PaymentTypeID");
    }

    // Proceed with inserting the payment option available
    const result = await db.query(
      `INSERT INTO PaymentOptionsAvailable (RestaurantID, PaymentTypeID) VALUES (?, ?)`,
      [RestaurantID, PaymentTypeID]
    );
    return result.insertId;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch all payment options available
export const fetchAllPaymentOptionsAvailableService = async () => {
  try {
    const paymentOptionsAvailable = await db.query(`SELECT * FROM PaymentOptionsAvailable`);
    return paymentOptionsAvailable;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Edit a payment option available
export const editPaymentOptionAvailableService = async (PaymentOptionsID, data) => {
  const { RestaurantID, PaymentTypeID } = data;
  try {
    // Check if the payment option available exists
    const [paymentOptionAvailable] = await db.query(
      `SELECT * FROM PaymentOptionsAvailable WHERE PaymentOptionsID = ?`,
      [PaymentOptionsID]
    );

    if (paymentOptionAvailable.length === 0) {
      throw new Error("Payment option available not found");
    }

    // Check if RestaurantID exists
    const restaurant = await db.query(
      `SELECT * FROM Restaurants WHERE RestaurantID = ?`,
      [RestaurantID]
    );

    if (restaurant.length === 0) {
      throw new Error("Invalid RestaurantID");
    }

    // Check if PaymentTypeID exists
    const paymentType = await db.query(
      `SELECT * FROM PaymentType WHERE PaymentTypeID = ?`,
      [PaymentTypeID]
    );

    if (paymentType.length === 0) {
      throw new Error("Invalid PaymentTypeID");
    }

    // Proceed with updating the payment option available
    await db.query(
      `UPDATE PaymentOptionsAvailable SET RestaurantID = ?, PaymentTypeID = ? WHERE PaymentOptionsID = ?`,
      [RestaurantID, PaymentTypeID, PaymentOptionsID]
    );
    return true;
  } catch (error) {
    console.error("Error in editPaymentOptionAvailableService:", error.message);
    throw new Error(error.message);
  }
};

// Remove a payment option available
export const removePaymentOptionAvailableService = async (PaymentOptionsID) => {
  try {
    // Check if the payment option available exists
    const [paymentOptionAvailable] = await db.query(
      `SELECT * FROM PaymentOptionsAvailable WHERE PaymentOptionsID = ?`,
      [PaymentOptionsID]
    );

    if (paymentOptionAvailable.length === 0) {
      throw new Error("Payment option available not found");
    }

    // Proceed with deleting the payment option available
    await db.query(
      `DELETE FROM PaymentOptionsAvailable WHERE PaymentOptionsID = ?`,
      [PaymentOptionsID]
    );
    return true;
  } catch (error) {
    console.error("Error in removePaymentOptionAvailableService:", error.message);
    throw new Error(error.message);
  }
};