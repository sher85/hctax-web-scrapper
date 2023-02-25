const cheerio = require('cheerio');
const request = require('request');

// Define a function to scrape the website and extract the property data
const scrape = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (error || response.statusCode !== 200) {
        reject(new Error(`Error fetching URL: ${url}`));
      } else {
        const $ = cheerio.load(html);

        // Define the CSS selector for the property container
        const container =
          '#taxSaleList > div.row.listingArea > div > ul.list-listings-2.list';
        const properties = [];

        // Extract the property data from each listing in the container
        $(container + ' > li').each((i, el) => {
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

          // Add the property data to the properties array
          properties.push(property);
        });

        resolve(properties);
      }
    });
  });
};

// Export the scrape function for use in other modules
module.exports = {
  scrape,
};
