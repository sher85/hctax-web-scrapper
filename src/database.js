const sqlite3 = require('sqlite3').verbose();

// Define the file name and table name for the database
const dbFile = 'properties.db';
const tableName = 'properties';

// Define the SQL statement to create the properties table
const createTableSql = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    propertyId INTEGER PRIMARY KEY,
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
