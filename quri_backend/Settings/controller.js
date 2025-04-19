const {
  createSettingService,
  fetchAllSettingsService,
  createOrUpdateSettingsService,
  fetchSettingsService,
  WorkingHoursService,
  fetchWorkingHoursService,
} = require("./service.js");


// Controller to handle setting creation
 const createSettingController = async (req, res) => {
  try {
    const { RestaurantID, KeyID } = req.body;
    let Value = req.body.Value;

    if (req.file) {
      // If there's a file, set the Value to the file path
      Value = req.file.path;
    }

    const result = await createSettingService({ RestaurantID, KeyID, Value });
    res.status(201).json({ message: "Setting created successfully", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to fetch all settings
 const fetchAllSettingsController = async (req, res) => {
  try {
    const { RestaurantID } = req.query; // Assuming restaurant ID is passed as a query parameter
    const result = await fetchAllSettingsService(RestaurantID);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to create or update settings
 const createOrUpdateSettingsController = async (req, res) => {
  try {
    const { settings } = req.body;
    const RestaurantID = req.body.RestaurantID;

    if (!RestaurantID || !settings || !Array.isArray(settings)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const result = await createOrUpdateSettingsService(settings, RestaurantID);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to fetch settings
 const fetchSettingsController = async (req, res) => {
  try {
    const RestaurantID = req.params.RestaurantID;
    console.log(RestaurantID);
    if (!RestaurantID) {
      return res.status(400).json({ message: "Invalid RestaurantID" });
    }

    const settings = await fetchSettingsService(RestaurantID);
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Working hours logic
 */
 const workingHoursController = async (req, res) => {
  try {
    const { RestaurantID, workingHours } = req.body;

    // Log the incoming request body
   // console.log("Request Body:", req.body);

    // Validate input
    if (!RestaurantID || !workingHours || !Array.isArray(workingHours)) {
      console.error("Invalid input: ", { RestaurantID, workingHours });
      return res
        .status(400)
        .json({
          message: "All fields are required and workingHours must be an array",
        });
    }

    // Transform the workingHours array into the expected object format
    const workingHoursObject = workingHours.reduce((acc, curr) => {
      acc[curr.day] = { open: curr.open, close: curr.close };
      return acc;
    }, {});

    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    // Log the transformed working hours object
    //console.log("Transformed Working Hours Object:", workingHoursObject);

    // Validate each day's working hours
    for (const day of daysOfWeek) {
      if (!workingHoursObject[day]) {
        console.error(`Working hours for ${day} are required`);
        return res
          .status(400)
          .json({ message: `Working hours for ${day} are required` });
      }
    }

    // Call the service and log the result
    const result = await WorkingHoursService(RestaurantID, workingHoursObject);
   //console.log("Service Result:", result);

    // Respond with the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in workingHoursController:", error);
    res.status(400).json({ message: error.message });
  }
};
/**
 * Fetch Working Hours Controller
 */
 const fetchWorkingHoursController = async (req, res) => {
  try {
    const { RestaurantID } = req.params;

    if (!RestaurantID) {
      return res.status(400).json({ message: "RestaurantID is required" });
    }

    const workingHours = await fetchWorkingHoursService(RestaurantID);
    res.status(200).json(workingHours);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  createSettingController,
  fetchAllSettingsController,
  createOrUpdateSettingsController,
  fetchSettingsController,
  workingHoursController,
  fetchWorkingHoursController,
};