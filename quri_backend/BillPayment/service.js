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


const getPlateNumberRecord = async () => {

    const query = 'SELECT PlateNumber, OrderID FROM platenumber';

    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}


module.exports = {
    addPlateNumberService,
    getPlateNumberRecord
};
