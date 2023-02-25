const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './database/properties.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connected to the properties database.');
});

// Create the properties table if it doesn't exist
db.run(
  'CREATE TABLE IF NOT EXISTS properties (propertyId INTEGER, address TEXT, city TEXT, state TEXT, zip TEXT, precinct TEXT, suitNumber TEXT, account TEXT, suitNumber2 TEXT, adjudgedValue TEXT, minBid TEXT, additionalField TEXT)',
  (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    }
    console.log('Properties table created successfully');
  }
);

// Close the database connection
db.close((err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Database connection closed.');
});
