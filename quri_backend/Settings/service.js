const db = require("../db/db.js");
const path = require("path");


const createSettingService = async function ({
  RestaurantID,
  KeyID,
  Value,
}) {
  try {
    // Validate input
    if (!RestaurantID || !KeyID || !Value) {
      throw new Error("All fields are required");
    }



    let fileUrl = null;

    if (KeyID === 'bg') {
      fileUrl = `uploads/bg/${path.basename(Value)}`;
    } else {
      fileUrl = `uploads/${path.basename(Value)}`;
    }

    // Check if the setting already exists
    const [existingSetting] = await db
      .promise()
      .query("SELECT * FROM settings WHERE RestaurantID = ? AND KeyID = ?", [
        RestaurantID,
        KeyID,
      ]);

    let result;
    if (existingSetting.length > 0) {
      // Update the existing setting
      const query =
        "UPDATE settings SET Value = ? WHERE RestaurantID = ? AND KeyID = ?";
      const values = [fileUrl, RestaurantID, KeyID];
      result = await db.promise().query(query, values);
    } else {
      // Insert a new setting
      const query =
        "INSERT INTO settings (RestaurantID, KeyID, Value) VALUES (?, ?, ?)";
      const values = [RestaurantID, KeyID, fileUrl];
      result = await db.promise().query(query, values);
    }

    return result;
  } catch (err) {
    console.error("Error in createSettingService:", err);
    throw err;
  }
};

// Create a service to fetch all settings
const fetchAllSettingsService = async function (RestaurantID) {
  try {
    const query = "SELECT * FROM settings WHERE RestaurantID = ?";
    const values = [RestaurantID];
    const [result] = await db.promise().query(query, values);
    return result;
  } catch (err) {
    console.error("Error in fetchAllSettingsService:", err);
    throw err;
  }
};

// Updating the Services
const createOrUpdateSettingsService = async (settings, RestaurantID) => {
  try {
    for (const { KeyID, Value } of settings) {
      // Check if the setting already exists
      const [existingSetting] = await db
        .promise()
        .query("SELECT * FROM settings WHERE RestaurantID = ? AND KeyID = ?", [
          RestaurantID,
          KeyID,
        ]);

      if (existingSetting.length > 0) {
        // Update the existing setting
        await db
          .promise()
          .query(
            "UPDATE settings SET Value = ? WHERE RestaurantID = ? AND KeyID = ?",
            [Value, RestaurantID, KeyID]
          );
      } else {
        // Insert a new setting
        await db
          .promise()
          .query(
            "INSERT INTO settings (RestaurantID, KeyID, Value) VALUES (?, ?, ?)",
            [RestaurantID, KeyID, Value]
          );
      }
    }

    return { message: "Settings updated successfully" };
  } catch (err) {
    console.error("Error in createOrUpdateSettingsService:", err);
    throw err;
  }
};

const fetchSettingsService = async (RestaurantID) => {
  try {
    const [settings] = await db.promise().query("SELECT * FROM settings WHERE RestaurantID = ?", [RestaurantID]);

    if (!settings || settings.length === 0) {
      throw new Error('No settings found for the given RestaurantID');
    }

    return settings;
  } catch (err) {
    console.error("Error in fetchSettingsService:", err);
    throw err;
  }
};


/**
 * Working hours 
 */

/**
 * Create Or Update Work Hours
 */

/**
 * Create Or Update Work Hours
 * @param {number} RestaurantID - The ID of the restaurant.
 * @param {Object} workingHours - An object containing working hours for each day of the week.
 * @param {string} workingHours.monday - Working hours for Monday.
 * @param {string} workingHours.tuesday - Working hours for Tuesday.
 * @param {string} workingHours.wednesday - Working hours for Wednesday.
 * @param {string} workingHours.thursday - Working hours for Thursday.
 * @param {string} workingHours.friday - Working hours for Friday.
 * @param {string} workingHours.saturday - Working hours for Saturday.
 * @param {string} workingHours.sunday - Working hours for Sunday.
 */
const WorkingHoursService = async (RestaurantID, workingHours) => {
  try {
    // Validate input
    if (!RestaurantID || !workingHours || typeof workingHours !== 'object') {
      throw new Error("All fields are required and workingHours must be an object");
    }

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for (const day of daysOfWeek) {
      if (workingHours[day] === undefined) {
        throw new Error(`Working hours for ${day} are required`);
      }

      const KeyID = day;
      const { open, close } = workingHours[day];
      const Value = JSON.stringify({ open, close });  // Serialize open and close times into a single string

      // Check if the setting already exists
      const [existingSetting] = await db
        .promise()
        .query("SELECT * FROM settings WHERE RestaurantID = ? AND KeyID = ?", [
          RestaurantID,
          KeyID,
        ]);

      let result;
      if (existingSetting.length > 0) {
        // Update the existing setting
        const query = "UPDATE settings SET Value = ? WHERE RestaurantID = ? AND KeyID = ?";
        const values = [Value, RestaurantID, KeyID];
        result = await db.promise().query(query, values);
      } else {
        // Insert a new setting
        const query = "INSERT INTO settings (RestaurantID, KeyID, Value) VALUES (?, ?, ?)";
        const values = [RestaurantID, KeyID, Value];
        result = await db.promise().query(query, values);
      }
    }

    return { success: true, message: "Working hours updated successfully" };
  } catch (err) {
    console.error("Error in WorkingHours:", err);
    throw err;
  }
};



/**
 * Fetch Working Hours
 * @param {number} RestaurantID - The ID of the restaurant.
 * @returns {Object} An object containing working hours for each day of the week.
 */
const fetchWorkingHoursService = async (RestaurantID) => {
  try {
    // Validate input
    if (!RestaurantID) {
      throw new Error("RestaurantID is required");
    }

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const workingHours = {};

    for (const day of daysOfWeek) {
      const [result] = await db
        .promise()
        .query("SELECT Value FROM settings WHERE RestaurantID = ? AND KeyID = ?", [
          RestaurantID,
          day,
        ]);

      if (result.length > 0) {
        workingHours[day] = JSON.parse(result[0].Value); // Deserialize the JSON string
      } else {
        workingHours[day] = null; // Or any default value you prefer
      }
    }

    return workingHours;
  } catch (err) {
    console.error("Error in fetchWorkingHoursService:", err);
    throw err;
  }
};



module.exports = {
  createSettingService,
  fetchAllSettingsService,
  createOrUpdateSettingsService,
  fetchSettingsService,
  WorkingHoursService,
  fetchWorkingHoursService,
};
