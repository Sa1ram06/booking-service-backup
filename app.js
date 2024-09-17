const express = require("express");
const mysql = require("mysql2/promise"); // Use mysql2
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const cors = require('cors');  // Import cors

// controllers
const bookingController = require("./controllers/bookingController");
const sessionController = require("./controllers/sessionController");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port
app.use(cors());  // This will allow all origins

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test MySQL connection
app.get("/api/testmysql", (req, res) => {
  pool.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Error executing query");
    }
    res.send(`Database connection successful! Test result: ${results[0].solution}`);
  });
});

// booking routes
app.get("/api/bookings/:clientId", bookingController.viewBookingsByClientId);
app.put("/api/booking/cancel/:bookingId", bookingController.cancelBookingByBookingId);
app.post("/api/booking", bookingController.createBooking);

// session routes
app.post("/api/session", sessionController.createSession);

// Initialize Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);

  // Test database connection
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("Established connection to Database");
    connection.release();
  });
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  pool.end((err) => {
    if (err) {
      console.error("Error closing MySQL connection pool:", err);
    } else {
      console.log("Database connection pool closed");
    }
    process.exit(0); // Exit with code 0 indicating successful shutdown
  });
});