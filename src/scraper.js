const axios = require('axios');
const cheerio = require('cheerio');

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

        // Define an array to hold the scraped properties
        const properties = [];

        // Loop through each row in the property table
        $('#dtBasicExample tbody tr').each((i, el) => {
          // Find the columns in the current row
          const cols = $(el).find('td');

          // Extract the property data from the columns and store it in an object
          const property = {
            propertyId: i,
            address: $(cols[0]).text(),
            city: $(cols[1]).text(),
            state: $(cols[2]).text(),
            zip: $(cols[3]).text(),
            precinct: $(cols[4]).text(),
            suitNumber: $(cols[5]).text(),
            account: $(cols[6]).text(),
            suitNumber2: $(cols[7]).text(),
            adjudgedValue: $(cols[8]).text(),
            minBid: $(cols[9]).text(),
          };

          // Check if the additional field is present and extract it if it is
          const additionalField = $(cols[10]).find('strong').text().trim();
          if (additionalField !== '') {
            property.additionalField = additionalField;
          }

          // Add the property object to the properties array
          properties.push(property);
        });

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
