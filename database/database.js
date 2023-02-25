const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file
const dbPath = path.resolve(__dirname, 'properties.db');

// Define a function to run database queries
function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.run(query, params, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
      db.close();
    });
  });
}

// Define a function to get data from the database
function getData(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.all(query, params, function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
      db.close();
    });
  });
}

// Define a function to save the scraped properties to the database
async function saveProperties(properties) {
  console.log('number properties in database.js: ', properties.length);
  const existingAccounts = await getData('SELECT account FROM properties');
  const existingAccountsSet = new Set(
    existingAccounts.map((property) => property.account)
  );
  const newProperties = properties.filter(
    (property) => !existingAccountsSet.has(property.account)
  );
  if (newProperties.length > 0) {
    const query = `INSERT INTO properties (address, city, state, zip, precinct, suit_number, account, suit_number_2, adjudged_value, min_bid, additional_field) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = newProperties.map((property) => [
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
    ]);
    await Promise.all(params.map((param) => runQuery(query, param)));
  }
}

module.exports = {
  runQuery,
  getData,
  saveProperties,
};
