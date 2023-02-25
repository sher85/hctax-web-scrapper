const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file
const dbPath = path.resolve(__dirname, 'properties.db');

// Create a new database connection
const db = new sqlite3.Database(dbPath);

// Create the "properties" table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY,
    property_id TEXT,
    owner TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    precinct TEXT,
    account TEXT,
    suit_number TEXT,
    adjudged_value TEXT,
    min_bid TEXT,
    delinquent_tax_year TEXT,
    sale_date TEXT,
    status TEXT,
    link TEXT
  )`);
});

// Close the database connection
db.close();
