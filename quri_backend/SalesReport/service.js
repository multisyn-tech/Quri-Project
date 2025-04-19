const db = require("../db/db.js");
const { reportQueries } = require('./reportType.js');

 const fetchAllSalesData = async (
  RestaurantID,
  page = 1,
  limit = 10,
  startDate,
  endDate
) => {
  const offset = (page - 1) * limit;

  const reportResults = {};

  // Iterate through each report type in reportQueries
  for (const [reportType, { query, params, countQuery, countParams }] of Object.entries(reportQueries)) {
    const queryParams = params(RestaurantID, startDate, endDate, limit, offset);
    const [results] = await db.promise().query(query, queryParams);

    if (reportType === 'orders') {
      const [[{ total }]] = await db.promise().query(countQuery, countParams(RestaurantID, startDate, endDate));
      reportResults[reportType] = { results, total };
    } else {
      // Map specific report types to the desired key names
      if (['total_sales', 'total_customers', 'total_products', 'total_orders'].includes(reportType)) {
        const keyMapping = {
          total_sales: 'totalSales',
          total_customers: 'totalCustomers',
          total_products: 'totalProducts',
          total_orders: 'totalOrders'
        };
        const keyName = keyMapping[reportType];
        reportResults[keyName] = results[0][Object.keys(results[0])[0]]; // Extract the value directly
      } else {
        reportResults[reportType] = results;
      }
    }
  }

  return reportResults;
};


module.exports = {
  fetchAllSalesData
};