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
        // Time stamp
        const startTime = new Date().toLocaleString();

        console.log(`Scraping ${startTime}`);
        const { properties, numUpdated } = await scrape();
        console.log('Scraped properties:', properties.length);
        console.log('Scrape successful');

        // Send notification email
        await sendEmail(
            `Scraping complete ${startTime}`,
            `The scraping process has completed successfully.\nScraped properties: ${
                properties.length
            }\nUpdated properties: ${await numUpdated}`
        );
    } catch (error) {
        console.error(`Error scraping properties: ${error.message}`);
    }
}

// Call the run function when the script is executed
run();
