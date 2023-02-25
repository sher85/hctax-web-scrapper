const axios = require('axios');
const cheerio = require('cheerio');

// Retrieve the HTML content from a URL
async function getHTML(url) {
  const response = await axios.get(url);
  return response.data;
}

// Extract property data from HTML content
function extractProperties(html) {
  const properties = [];

  // Load the HTML into cheerio
  const $ = cheerio.load(html);

  // Loop through each row in the property table
  $('#dtBasicExample tbody tr').each((i, el) => {
    // Find the columns in the current row
    const cols = $(el).find('td');

    // Extract the property data from the columns and store it in an object
    const property = {
      property_id: i,
      owner: $(cols[1]).text(),
      address: $(cols[2]).text(),
      city: $(cols[3]).text(),
      state: $(cols[4]).text(),
      zip: $(cols[5]).text(),
      precinct: $(cols[6]).text(),
      account: $(cols[7]).text(),
      suit_number: $(cols[8]).text(),
      adjudged_value: $(cols[9]).text(),
      min_bid: $(cols[10]).text(),
      delinquent_tax_year: $(cols[11]).text(),
      sale_date: $(cols[12]).text(),
      status: $(cols[13]).text(),
      link: $(cols[1]).find('a').attr('href'),
    };

    // Add the property object to the properties array
    properties.push(property);
  });

  return properties;
}

module.exports = {
  getHTML,
  extractProperties,
};
