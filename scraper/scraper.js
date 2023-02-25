const axios = require('axios');
const cheerio = require('cheerio');
const { saveProperties } = require('../database/database');

// Define the URL to scrape
const url = 'https://www.hctax.net/Property/listings/taxsalelisting';

// Define the function to scrape the properties
const scrape = () => {
  return new Promise((resolve, reject) => {
    // Send an HTTP GET request to the URL
    axios
      .get(url)
      .then((response) => {
        // Load the HTML document into Cheerio
        const $ = cheerio.load(response.data);

        // Define the path to the container of listings
        const container =
          '#taxSaleList > div.row.listingArea > div > ul.list-listings-2.list';

        // Create an array to store the scraped properties
        const properties = [];

        // Loop through each listing in the container
        $(container + ' > li').each((i, el) => {
          // Extract the data for the current listing
          const property = {
            propertyId: i,
            address: $(el).find('h3 > span.address').text(),
            city: $(el).find('h3 > span.city').text(),
            state: $(el).find('h3 > span.state').text(),
            zip: $(el).find('h3 > span.zip').text(),
            precinct: $(el).find('h4 > strong.precinct').text(),
            suitNumber: $(el).find('h4 > strong:nth-child(2)').text(),
            account: $(el)
              .find('table tbody tr:nth-child(1) td.account.listingTd strong')
              .text(),
            suitNumber2: $(el)
              .find(
                'table tbody tr:nth-child(1) td.SuitNumber.listingTd strong'
              )
              .text(),
            adjudgedValue: $(el)
              .find(
                'table tbody tr:nth-child(2) td.adjudgedValue.listingTd strong'
              )
              .text(),
            minBid: $(el)
              .find('table tbody tr:nth-child(2) td.minBid.listingTd strong')
              .text(),
            additionalField: $(el).find('span > strong').text(),
          };

          // Add the property object to the properties array
          properties.push(property);
        });

        // Save the properties to the database
        saveProperties(properties);

        // Resolve the promise with the properties array
        resolve(properties);
      })
      .catch((error) => {
        // Reject the promise with the error
        reject(error);
      });
  });
};

// Export the scrape function for use in other modules
module.exports = {
  scrape,
};
