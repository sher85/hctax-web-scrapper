const cheerio = require('cheerio');
const request = require('request');

const url = 'https://www.hctax.net/Property/listings/taxsalelisting';
request(url, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    const properties = [];
    $('#dtBasicExample tbody tr').each((i, el) => {
      const cols = $(el).find('td');
      const property = {
        property_id: $(cols[0]).text(),
        owner: $(cols[1]).text(),
        address: $(cols[2]).text(),
        delinquent_tax_year: $(cols[3]).text(),
        sale_date: $(cols[4]).text(),
        minimum_bid: $(cols[5]).text(),
        status: $(cols[6]).text(),
      };
      properties.push(property);
    });
    console.log(properties);
  }
});
