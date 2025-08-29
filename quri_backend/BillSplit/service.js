const db = require("../db/db.js");

const validStatuses = ["Paid", "Unpaid"];

const addPeopleService = async (Name, TableID, RestaurantID, Status = "Unpaid") => {
  // Ensure the status is valid; if not, default to "Unpaid"
  if (!validStatuses.includes(Status)) {
    Status = "Unpaid";
  }

  try {
    // Check if the TableID exists
    const [tableResult] = await db.promise().query(
      `SELECT * FROM tables WHERE TableID = ?`,
      [TableID]
    );

    if (tableResult.length === 0) {
      throw new Error(`Table with ID ${TableID} does not exist.`);
    }

    // Check if the person already exists
    const [existingPerson] = await db.promise().query(
      `SELECT * FROM people WHERE Name = ? AND TableID = ? AND RestaurantID = ?`,
      [Name, TableID, RestaurantID]
    );

    let result;

    if (existingPerson.length > 0) {
      // Update the existing person's status
      [result] = await db.promise().query(
        `UPDATE people SET Status = ? WHERE Name = ? AND TableID = ? AND RestaurantID = ?`,
        [Status, Name, TableID, RestaurantID]
      );
    } else {
      // Insert the new person
      [result] = await db.promise().query(
        `INSERT INTO people (Name, TableID, RestaurantID, Status) VALUES (?, ?, ?, ?)`,
        [Name, TableID, RestaurantID, Status]
      );
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};



 const getPeopleByTableIDService = async (TableID) => {
    try {
      const [result] = await db.promise().query(
        `SELECT * FROM people WHERE TableID = ?`,
        [TableID]
      );
  
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };


   const deletePeopleService = async (Id) => {
    try {
        // Check if the person with the given ID exists
        const [personResult] = await db.promise().query(
            `SELECT * FROM people WHERE Id = ?`,
            [Id]
        );

        if (personResult.length === 0) {
            throw new Error(`Person with ID ${Id} does not exist.`);
        }

        // Delete the person from the People table
        const [deleteResult] = await db.promise().query(
            `DELETE FROM people WHERE Id = ?`,
            [Id]
        );

        // Check if the deletion was successful
        if (deleteResult.affectedRows === 0) {
            throw new Error(`Failed to delete person with ID ${Id}.`);
        }

        return deleteResult;
    } catch (error) {
        console.error("Error in deletePeopleService:", error);
        throw new Error(`Error deleting person with ID ${Id}: ${error.message}`);
    }
};

 

module.exports = {
  addPeopleService,
  getPeopleByTableIDService,
  deletePeopleService
};
