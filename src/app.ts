import { saveProperties } from './database/propertyRepository';
import { ensureSchema } from './database/schema';
import { SqliteDatabase } from './database/sqlite';
import { fetchListingsPage } from './scraper/fetchListingsPage';
import { parseListings } from './scraper/parseListings';
import type { ScrapeSummary } from './types/property';

export async function runScraper(): Promise<ScrapeSummary> {
  const database = await SqliteDatabase.open();

  try {
    await ensureSchema(database);

    const html = await fetchListingsPage();
    const properties = parseListings(html);
    const summary = await saveProperties(database, properties);

    return {
      scraped: properties.length,
      inserted: summary.inserted,
      updated: summary.updated,
      unchanged: summary.unchanged
    };
  } finally {
    await database.close();
  }
}
