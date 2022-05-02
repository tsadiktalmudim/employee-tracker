const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
    {
      host: "localhost",
      // Your MySQL username,
      user: "root",
      // Your MySQL password
      password: "",
      database: "employee_tracker_db",
    },
    console.log("Connected to the Employee Tracker database.")
  );

  module.exports = db;