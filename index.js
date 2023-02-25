const { scrape } = require('./scraper/scraper');

// Scrape the website and save the data to the database
async function run() {
  try {
    console.log(`Scraping ${new Date().toLocaleString()}`);
    await scrape();
    console.log('Scrape successful');
  } catch (error) {
    console.error(`Error scraping or saving properties: ${error.message}`);
  }
}

// Call the run function when the script is executed
run();
