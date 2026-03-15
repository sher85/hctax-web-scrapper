import { runScraper } from './app';
import { loadEnv } from './config/loadEnv';
import { sendEmail } from './notifications/sendEmail';

function formatSummary(summary: {
  scraped: number;
  inserted: number;
  updated: number;
  unchanged: number;
}): string {
  return [
    `Scraped properties: ${summary.scraped}`,
    `Inserted properties: ${summary.inserted}`,
    `Updated properties: ${summary.updated}`,
    `Unchanged properties: ${summary.unchanged}`
  ].join('\n');
}

async function main(): Promise<void> {
  loadEnv();

  const startedAt = new Date();
  console.log(`Scraping started at ${startedAt.toISOString()}`);

  const summary = await runScraper();
  const message = formatSummary(summary);

  console.log(message);

  const emailSent = await sendEmail(
    `Harris County scrape complete ${startedAt.toISOString()}`,
    message
  );

  if (emailSent) {
    console.log('Summary email sent.');
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Scrape failed: ${message}`);
  process.exitCode = 1;
});
