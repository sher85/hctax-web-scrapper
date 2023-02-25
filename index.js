const fs = require('fs');
const { scrape } = require('./scraper/scraper');
const createDB = require('./database/createDB');

// Check if the database file exists and create it if it doesn't
if (!fs.existsSync('./database/properties.db')) {
  createDB();
}

// Scrape the website and log the properties to the console
async function run() {
  try {
    console.log(`Scraping ${new Date().toLocaleString()}`);
    const properties = await scrape();
    console.log('Scrape successful');
  } catch (error) {
    console.error(`Error scraping properties: ${error.message}`);
  }
}

// Call the run function when the script is executed
run();
