// Import the scraper and database modules
const scraper = require('./scraper');
const db = require('./database');

// Define the URL to scrape
const url = 'https://www.hctax.net/Property/listings/taxsalelisting';

// Define a function to scrape the website and insert the properties into the database
const scrapeProperties = async () => {
  try {
    const properties = await scraper.scrape(url);
    await db.insertProperties(properties);
    console.log('Scraped and saved properties successfully');
  } catch (error) {
    console.error(`Error scraping or saving properties: ${error.message}`);
  }
};

// Call the scrapeProperties function to begin scraping and inserting the properties
scrapeProperties();
