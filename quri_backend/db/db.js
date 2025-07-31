require('dotenv').config(); 
// const mysql = require('mysql2');
// const util = require('util');

// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: process.env.DB_HOST || 'localhost', // Default to localhost if not provided
//     user: process.env.DB_USER || 'root', // Default to root if not provided
//     password: process.env.DB_PASSWORD || null, // Use null if no password is provided
//     database: process.env.DB_NAME || 'quriapp' // Default to quriapp if not provided
// });

// // Promisify the pool.query method to use async/await
// pool.query = util.promisify(pool.query);

// module.exports = pool;


const mysql = require('mysql2');
const util = require('util');


const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    // password: "QuriDB#123",
    database: process.env.DB_NAME || 'quriapp'
});

pool.query = util.promisify(pool.query);

module.exports = pool;