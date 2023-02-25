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
`;

// Define a function to open the database connection and create the properties table
const createDb = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFile, (error) => {
      if (error) {
        reject(error);
      } else {
        db.run(createTableSql, (error) => {
          if (error) {
            reject(error);
          } else {
            console.log(`Database table "${tableName}" created successfully`);
            resolve(db);
          }
        });
      }
    });
  });
};

// Define a function to insert the properties into the database
const insertProperties = (properties) => {
  return new Promise((resolve, reject) => {
    createDb()
      .then((db) => {
        const placeholders = properties
          .map(() => '(?,?,?,?,?,?,?,?,?,?,?,?)')
          .join(',');
        const values = properties.flatMap((property) =>
          Object.values(property)
        );
        const sql = `INSERT INTO ${tableName} VALUES ${placeholders}`;

        db.run(sql, values, function (error) {
          if (error) {
            reject(error);
          } else {
            console.log(`Inserted ${this.changes} properties into database`);
            resolve();
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Export the insertProperties function for use in other modules
module.exports = {
  insertProperties,
};
