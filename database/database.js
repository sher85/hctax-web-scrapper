const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './properties.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connected to the properties database.');
});

// Create the properties table if it doesn't exist
db.run(
  'CREATE TABLE IF NOT EXISTS properties (propertyId INTEGER, address TEXT, city TEXT, state TEXT, zip TEXT, precinct TEXT, suitNumber TEXT, account TEXT, suitNumber2 TEXT, adjudgedValue TEXT, minBid TEXT, additionalField TEXT)'
);

const insertProperty = (property) => {
  const sql =
    'INSERT INTO properties (propertyId, address, city, state, zip, precinct, suitNumber, account, suitNumber2, adjudgedValue, minBid, additionalField) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    property.propertyId,
    property.address,
    property.city,
    property.state,
    property.zip,
    property.precinct,
    property.suitNumber,
    property.account,
    property.suitNumber2,
    property.adjudgedValue,
    property.minBid,
    property.additionalField,
  ];

  return new Promise((resolve, reject) => {
    db.run(sql, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

const getAllProperties = () => {
  const sql = 'SELECT * FROM properties';

  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  insertProperty,
  getAllProperties,
};
