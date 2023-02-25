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

// Define a function to update an existing property in the database
async function updateProperty(property) {
  // Check if the property already exists in the database
  const existingProperty = await getData(
    'SELECT * FROM properties WHERE account = ?',
    [property.account]
  );

  if (existingProperty.length > 0) {
    const existing = existingProperty[0];
    let changes = '';

    // Check each property to see if it has changed
    if (existing.suit_number !== property.suitNumber) {
      changes += `suit_number from ${existing.suit_number} to ${property.suitNumber}, `;
    }

    if (existing.suit_number_2 !== property.suitNumber2) {
      changes += `suit_number_2 from ${existing.suit_number_2} to ${property.suitNumber2}, `;
    }

    if (existing.adjudged_value !== property.adjudgedValue) {
      changes += `adjudged_value from ${existing.adjudged_value} to ${property.adjudgedValue}, `;
    }

    if (existing.min_bid !== property.minBid) {
      changes += `min_bid from ${existing.min_bid} to ${property.minBid}, `;
    }

    if (existing.additional_field !== property.additionalField) {
      changes += `additional_field from ${existing.additional_field} to ${property.additionalField}, `;
    }

    if (changes) {
      console.log(`Updated property ${property.account}: ${changes}`);
      await runQuery(
        'UPDATE properties SET suit_number = ?, suit_number_2 = ?, adjudged_value = ?, min_bid = ?, additional_field = ? WHERE account = ?',
        [
          property.suitNumber,
          property.suitNumber2,
          property.adjudgedValue,
          property.minBid,
          property.additionalField,
          property.account,
        ]
      );
    }
  }
}

async function saveProperties(properties) {
  let updatedEntries = 0;

  // Loop through each property and insert or update it in the database
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    const existing = await getData(
      'SELECT * FROM properties WHERE account = ?',
      [property.account]
    );
    if (existing.length > 0) {
      // Check if any of the property fields have changed
      const updatedFields = {};
      const fields = [
        'address',
        'city',
        'state',
        'zip',
        'precinct',
        'suitNumber',
        'suitNumber2',
        'adjudgedValue',
        'minBid',
        'additionalField',
      ];
      fields.forEach((field) => {
        if (existing[0][field] !== property[field]) {
          updatedFields[field] = property[field];
        }
      });

      if (Object.keys(updatedFields).length > 0) {
        // Update the existing property in the database
        const updateFields = Object.keys(updatedFields).map(
          (field) => `${field} = ?`
        );
        const updateParams = Object.values(updatedFields);
        updateParams.push(property.account);
        await runQuery(
          `UPDATE properties SET ${updateFields.join(', ')} WHERE account = ?`,
          updateParams
        );

        console.log(`Property ${property.account} updated:`);
        console.log(updatedFields);

        updatedEntries++;
      }
    } else {
      // Insert the new property into the database
      const query =
        'INSERT INTO properties (address, city, state, zip, precinct, suitNumber, account, suitNumber2, adjudgedValue, minBid, additionalField) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const params = [
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
      await runQuery(query, params);

      console.log(`New property added to database: ${property.account}`);
    }
  }

  // Log number of updates to terminal
  console.log('Updated properties:', updatedEntries);
}

module.exports = {
  runQuery,
  getData,
  saveProperties,
  updateProperty,
};
