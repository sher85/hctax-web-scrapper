const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file
const dbPath = path.resolve(__dirname, 'properties.db');

// Define a function to create the properties table in the database
function createDB() {
  const db = new sqlite3.Database(dbPath);
  db.run(`
    CREATE TABLE properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      precinct TEXT,
      suit_number TEXT,
      account TEXT,
      suit_number_2 TEXT,
      adjudged_value TEXT,
      min_bid TEXT,
      additional_field TEXT
    )
  `);
  db.close();
}

module.exports = createDB;
