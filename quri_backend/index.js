const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db/db.js");
const adminRoutes = require("./Auth/route.js");
const customerRoutes = require("./Customer/route.js");
const restaurantRoutes = require("./Hotel/route.js");
const settingRoutes = require("./Settings/route.js");
// const paymentRoutes = require('./Payment/route.js');
const reviewRoutes = require('./Reviews/route.js');
const customerHistoryRoutes = require('./History/route.js');
const salesRoutes = require('./SalesReport/route.js');
const peopleRoutes = require('./BillSplit/route.js');
const superAdminRoutes=require('./SuperAdmin/route.js');

const billPaymentRoutes=require('./BillPayment/route.js');


const port = process.env.PORT || 5000;

const Sentry = require("./instrument.js");

db.query("SELECT 1")
  .then(() => {
    console.log("db connection succeeded.");
  })
  .catch((err) => console.log("db connection failed . \n" + err));

const app = express();
app.use(
  cors({
    origin: "*", // must change later
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the food uploads directory
app.use('/food-uploads', express.static(path.join(__dirname, 'uploads/food')));

app.use("/admin", adminRoutes);
app.use("/customers", customerRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/setting", settingRoutes);
// app.use('/payments', paymentRoutes);
app.use('/reviews', reviewRoutes);
app.use('/customerHistory',customerHistoryRoutes);
app.use('/sales',salesRoutes);
app.use('/people',peopleRoutes);
app.use('/superAdmin',superAdminRoutes);

// stripe payment gateway route  
app.use('/bill',billPaymentRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use((req, res, next) => {
  res.status(404).send("No Route Foundssss");
});


// handle global exceptions
process.on("uncaughtException", (err) => {
  Sentry.captureException(err);
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  Sentry.captureException(reason);
  console.error("Unhandled Rejection:", reason);
});
