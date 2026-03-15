import axios from 'axios';

export const LISTINGS_URL = 'https://www.hctax.net/Property/listings/taxsalelisting';

export async function fetchListingsPage(): Promise<string> {
  const response = await axios.get<string>(LISTINGS_URL, {
    headers: {
      'User-Agent': 'hctax-web-scrapper/0.1.0'
    },
    timeout: 30000
  });

  return response.data;
}
