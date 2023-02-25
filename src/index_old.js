// Load the Cheerio and Request libraries
const cheerio = require('cheerio');
const request = require('request');

// Define the URL of the website to scrape
const url = 'https://www.hctax.net/Property/listings/taxsalelisting';

// Make an HTTP request to the website using the Request library
request(url, (error, response, html) => {
  // Check for errors and a successful response status code (200)
  if (!error && response.statusCode == 200) {
    // Load the HTML into a Cheerio object
    const $ = cheerio.load(html);

    // Define the path to the container of listings
    const container =
      '#taxSaleList > div.row.listingArea > div > ul.list-listings-2.list';

    // Create an array to store the scraped properties
    const properties = [];

    // Loop through each listing in the container
    $(container + ' > li').each((i, el) => {
      // Extract the data for the current listing
      const property = {
        propertyID: i,
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
          .find('table tbody tr:nth-child(1) td.SuitNumber.listingTd strong')
          .text(),
        adjudgedValue: $(el)
          .find('table tbody tr:nth-child(2) td.adjudgedValue.listingTd strong')
          .text(),
        minBid: $(el)
          .find('table tbody tr:nth-child(2) td.minBid.listingTd strong')
          .text(),
        additionalField: $(el).find('span > strong').text(),
      };

      // Add the property object to the properties array
      properties.push(property);
    });

    // Log the properties array to the console
    console.log(properties);
  }
});
