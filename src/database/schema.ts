import { SqliteDatabase } from './sqlite';

async function columnExists(database: SqliteDatabase, tableName: string, columnName: string): Promise<boolean> {
  const columns = await database.all<{ name: string }>(`PRAGMA table_info(${tableName})`);
  return columns.some((column) => column.name === columnName);
}

async function ensureColumn(
  database: SqliteDatabase,
  tableName: string,
  columnName: string,
  columnDefinition: string
): Promise<void> {
  if (await columnExists(database, tableName, columnName)) {
    return;
  }

  await database.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
}

export async function ensureSchema(database: SqliteDatabase): Promise<void> {
  await database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zip TEXT NOT NULL,
      precinct TEXT NOT NULL,
      suitNumber TEXT NOT NULL,
      suitNumber2 TEXT NOT NULL,
      adjudgedValue TEXT NOT NULL,
      minBid TEXT NOT NULL,
      additionalField TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS property_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account TEXT NOT NULL,
      changedAt TEXT NOT NULL,
      changes TEXT NOT NULL,
      snapshot TEXT NOT NULL
    );
  `);

  await ensureColumn(database, 'properties', 'createdAt', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn(database, 'properties', 'updatedAt', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn(database, 'property_history', 'account', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn(database, 'property_history', 'changedAt', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn(database, 'property_history', 'changes', "TEXT NOT NULL DEFAULT '[]'");
  await ensureColumn(database, 'property_history', 'snapshot', "TEXT NOT NULL DEFAULT '{}'");

  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_properties_account ON properties(account);
    CREATE INDEX IF NOT EXISTS idx_property_history_account ON property_history(account);
    CREATE INDEX IF NOT EXISTS idx_property_history_changed_at ON property_history(changedAt);
  `);
}
