const fs = require('fs');
const { scrape } = require('./scraper/scraper');
const createDB = require('./database/createDB');
const sendEmail = require('./email/sendEmail');

// Check if the database file exists and create it if it doesn't
if (!fs.existsSync('./database/properties.db')) {
  createDB();
}

// Scrape the website and log the properties to the console
async function run() {
  try {
    console.log(`Scraping ${new Date().toLocaleString()}`);
    const properties = await scrape();
    console.log('Scraped properties:', properties.length);
    console.log('Scrape successful');

    // Send notification email
    await sendEmail(
      'Scraping complete',
      'The scraping process has completed successfully.'
    );
  } catch (error) {
    console.error(`Error scraping properties: ${error.message}`);
  }
}

// Call the run function when the script is executed
run();
