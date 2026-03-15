import type { PropertyChange, PropertyListing, SaveSummary } from '../types/property';
import { SqliteDatabase } from './sqlite';

interface PropertyRow {
  address: string;
  city: string;
  state: string;
  zip: string;
  precinct: string;
  suitNumber: string;
  account: string;
  suitNumber2: string;
  adjudgedValue: string;
  minBid: string;
  additionalField: string;
}

const trackedFields: Array<keyof PropertyListing> = [
  'address',
  'city',
  'state',
  'zip',
  'precinct',
  'suitNumber',
  'account',
  'suitNumber2',
  'adjudgedValue',
  'minBid',
  'additionalField'
];

export function diffProperties(previous: PropertyListing, current: PropertyListing): PropertyChange[] {
  const changes: PropertyChange[] = [];

  for (const field of trackedFields) {
    if (previous[field] === current[field]) {
      continue;
    }

    changes.push({
      field,
      previousValue: previous[field],
      currentValue: current[field]
    });
  }

  return changes;
}

function toListing(row: PropertyRow): PropertyListing {
  return {
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    precinct: row.precinct,
    suitNumber: row.suitNumber,
    account: row.account,
    suitNumber2: row.suitNumber2,
    adjudgedValue: row.adjudgedValue,
    minBid: row.minBid,
    additionalField: row.additionalField
  };
}

async function insertProperty(database: SqliteDatabase, property: PropertyListing): Promise<void> {
  await database.run(
    `
      INSERT INTO properties (
        account,
        address,
        city,
        state,
        zip,
        precinct,
        suitNumber,
        suitNumber2,
        adjudgedValue,
        minBid,
        additionalField,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    [
      property.account,
      property.address,
      property.city,
      property.state,
      property.zip,
      property.precinct,
      property.suitNumber,
      property.suitNumber2,
      property.adjudgedValue,
      property.minBid,
      property.additionalField
    ]
  );
}

async function updateProperty(
  database: SqliteDatabase,
  property: PropertyListing,
  changes: PropertyChange[]
): Promise<void> {
  await database.run(
    `
      UPDATE properties
      SET address = ?,
          city = ?,
          state = ?,
          zip = ?,
          precinct = ?,
          suitNumber = ?,
          suitNumber2 = ?,
          adjudgedValue = ?,
          minBid = ?,
          additionalField = ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE account = ?
    `,
    [
      property.address,
      property.city,
      property.state,
      property.zip,
      property.precinct,
      property.suitNumber,
      property.suitNumber2,
      property.adjudgedValue,
      property.minBid,
      property.additionalField,
      property.account
    ]
  );

  await database.run(
    `
      INSERT INTO property_history (account, changedAt, changes, snapshot)
      VALUES (?, CURRENT_TIMESTAMP, ?, ?)
    `,
    [property.account, JSON.stringify(changes), JSON.stringify(property)]
  );
}

export async function saveProperties(
  database: SqliteDatabase,
  properties: PropertyListing[]
): Promise<SaveSummary> {
  const summary: SaveSummary = {
    inserted: 0,
    updated: 0,
    unchanged: 0
  };

  await database.exec('BEGIN');

  try {
    for (const property of properties) {
      const existing = await database.get<PropertyRow>(
        `
          SELECT
            address,
            city,
            state,
            zip,
            precinct,
            suitNumber,
            account,
            suitNumber2,
            adjudgedValue,
            minBid,
            additionalField
          FROM properties
          WHERE account = ?
          ORDER BY id DESC
          LIMIT 1
        `,
        [property.account]
      );

      if (!existing) {
        await insertProperty(database, property);
        summary.inserted += 1;
        continue;
      }

      const changes = diffProperties(toListing(existing), property);
      if (changes.length === 0) {
        summary.unchanged += 1;
        continue;
      }

      await updateProperty(database, property, changes);
      summary.updated += 1;
    }

    await database.exec('COMMIT');
  } catch (error) {
    await database.exec('ROLLBACK');
    throw error;
  }

  return summary;
}
