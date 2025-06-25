const db = require("../db/db.js");



const addPlateNumberService = async (orderInfo) => {
    try {
        const {
            OrderID,            
            PlateNumber,
        } = orderInfo;

        const [result] = await db.promise().query(
            `INSERT INTO platenumber (OrderID, PlateNumber)
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE PlateNumber = VALUES(PlateNumber)`,
            [
                OrderID,                
                PlateNumber,
            ]
        );

        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    addPlateNumberService,
};
