import { describe, expect, it } from 'vitest';
import { parseListings } from '../src/scraper/parseListings';

describe('parseListings', () => {
  it('extracts property listings from the current Harris County listing markup', () => {
    const html = `
      <div id="taxSaleList">
        <div class="row listingArea">
          <div class="col-12 col-md-10">
            <ul class="list-listings-2 list">
              <li class="row listing">
                <div class="cell col-12 col-lg-8">
                  <div class="listing-body clearfix">
                    <h3>
                      <span class="address">123 Main St</span>
                      <span class="city">Houston</span>
                      <span class="state">TX</span>
                      <span class="zip">77002</span>
                    </h3>
                    <h4><strong class="precinct">Precinct 1</strong> / Type: <strong>SALE</strong></h4>
                    <table>
                      <tr>
                        <td>
                          <div class="row">
                            <div class="account text-nowrap col-12 col-lg-6">Account#: <strong>000-111-222-3333</strong></div>
                            <div class="SuitNumber text-nowrap col-12 col-lg-6">Cause#: <strong>SN-101</strong></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="row">
                            <div class="adjudgedValue text-nowrap col-12 col-lg-6">Adjudged Value: $<strong>250,000.00</strong></div>
                            <div class="minBid text-nowrap col-12 col-lg-6">Minimum Bid: $<strong>90,000.00</strong></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="row">
                            <div class="text-nowrap col-12">Sold with Account# <strong>444-555-666-7777</strong></div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;

    expect(parseListings(html)).toEqual([
      {
        address: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zip: '77002',
        precinct: 'Precinct 1',
        suitNumber: 'SN-101',
        account: '000-111-222-3333',
        suitNumber2: 'SALE',
        adjudgedValue: '$250,000.00',
        minBid: '$90,000.00',
        additionalField: '444-555-666-7777'
      }
    ]);
  });

  it('extracts property listings from the legacy Harris County markup', () => {
    const html = `
      <div id="taxSaleList">
        <div class="row listingArea">
          <div>
            <ul class="list-listings-2 list">
              <li>
                <h3>
                  <span class="address">123 Main St</span>
                  <span class="city">Houston</span>
                  <span class="state">TX</span>
                  <span class="zip">77002</span>
                </h3>
                <h4>
                  <strong class="precinct">Precinct 1</strong>
                  <strong>Suit 2024-12345</strong>
                </h4>
                <table>
                  <tbody>
                    <tr>
                      <td class="account listingTd"><strong>000-111-222-3333</strong></td>
                      <td class="SuitNumber listingTd"><strong>SN-101</strong></td>
                    </tr>
                    <tr>
                      <td class="adjudgedValue listingTd"><strong>$250,000</strong></td>
                      <td class="minBid listingTd"><strong>$90,000</strong></td>
                    </tr>
                  </tbody>
                </table>
                <span><strong>Additional Notes</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;

    expect(parseListings(html)).toEqual([
      {
        address: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zip: '77002',
        precinct: 'Precinct 1',
        suitNumber: 'SN-101',
        account: '000-111-222-3333',
        suitNumber2: 'Suit 2024-12345',
        adjudgedValue: '$250,000',
        minBid: '$90,000',
        additionalField: 'Additional Notes'
      }
    ]);
  });

  it('skips malformed listings without an account number', () => {
    const html = `
      <div id="taxSaleList">
        <div class="row listingArea">
          <div>
            <ul class="list-listings-2 list">
              <li>
                <h3><span class="address">Missing Account</span></h3>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;

    expect(parseListings(html)).toEqual([]);
  });
});
