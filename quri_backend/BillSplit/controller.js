const {
  addPeopleService,
  getPeopleByTableIDService,
  deletePeopleService,
} = require("./service.js");

 const addPeopleController = async (req, res) => {
  const { Name, TableID, RestaurantID, Status } = req.body;

  try {
    const result = await addPeopleService(Name, TableID, RestaurantID, Status);

    res.status(200).json({
      success: true,
      message: "Person added successfully",
      data: {
        id: result.insertId,
        Name,
        TableID,
        RestaurantID,
        Status,
      },
    });
  } catch (error) {
    console.error("Error adding person:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 const getPeopleByTableIDController = async (req, res) => {
  const { TableID } = req.params;

  try {
    const people = await getPeopleByTableIDService(TableID);

    res.status(200).json({
      success: true,
      data: people,
    });
  } catch (error) {
    console.error("Error fetching people:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 const deletePeopleController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Log the id to debug if it's being correctly passed
    console.log("Deleting person with ID:", id);
    
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const result = await deletePeopleService(id);
    res.status(200).json({ message: "Person deleted successfully", result });
  } catch (error) {
    console.error("Error in deletePeopleController:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPeopleController,
  getPeopleByTableIDController,
  deletePeopleController 
};
