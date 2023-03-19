const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file
const dbPath = path.resolve(__dirname, 'properties.db');

// Define a function to create the properties table in the database
function createDB() {
    const db = new sqlite3.Database(dbPath);
    db.run(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      precinct TEXT,
      suitNumber TEXT,
      account TEXT,
      suitNumber2 TEXT,
      adjudgedValue TEXT,
      minBid TEXT,
      additionalField TEXT
    )
  `);
    db.close();
}

// Define a function to create the properties table in the database
function createPropertyHistoryTable() {
    const db = new sqlite3.Database(dbPath);

    db.run(`
    CREATE TABLE IF NOT EXISTS property_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      precinct TEXT,
      suitNumber TEXT,
      account TEXT,
      suitNumber2 TEXT,
      adjudgedValue TEXT,
      minBid TEXT,
      additionalField TEXT,
      change_date TEXT,
      FOREIGN KEY(property_id) REFERENCES properties(id)
    )
  `);

    db.close();
}

module.exports = { createDB, createPropertyHistoryTable };
