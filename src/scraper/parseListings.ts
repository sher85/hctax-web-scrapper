import { load } from 'cheerio';
import type { AnyNode } from 'domhandler';
import type { PropertyListing } from '../types/property';

function text(value: string | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function firstText($: ReturnType<typeof load>, element: AnyNode, selectors: string[]): string {
  for (const selector of selectors) {
    const value = text($(element).find(selector).first().text());
    if (value) {
      return value;
    }
  }

  return '';
}

function labeledValue(rawText: string, label: string): string {
  const cleaned = text(rawText);
  if (!cleaned) {
    return '';
  }

  return cleaned.replace(new RegExp(`^${label}\\s*`, 'i'), '');
}

function soldWithAccountText($: ReturnType<typeof load>, element: AnyNode): string {
  const candidates = $(element).find('div.text-nowrap.col-12');

  for (const candidate of candidates.toArray()) {
    const value = text($(candidate).text());
    if (value.toLowerCase().includes('sold with account#')) {
      return labeledValue(value, 'Sold with Account#');
    }
  }

  return text($(element).find('span > strong').last().text());
}

export function parseListings(html: string): PropertyListing[] {
  const $ = load(html);
  const container = '#taxSaleList > div.row.listingArea > div > ul.list-listings-2.list';
  const properties: PropertyListing[] = [];

  $(`${container} > li`).each((_, element) => {
    const detailType = text($(element).find('h4 > strong').eq(1).text());
    const soldWithAccount = soldWithAccountText($, element);

    const listing: PropertyListing = {
      address: text($(element).find('h3 > span.address').text()),
      city: text($(element).find('h3 > span.city').text()),
      state: text($(element).find('h3 > span.state').text()),
      zip: text($(element).find('h3 > span.zip').text()),
      precinct: text($(element).find('h4 > strong.precinct').text()),
      suitNumber: firstText($, element, [
        'div.SuitNumber strong',
        'table tbody tr:nth-child(1) td.SuitNumber.listingTd strong',
        'h4 > strong:nth-of-type(2)'
      ]),
      account: firstText($, element, [
        'div.account strong',
        'table tbody tr:nth-child(1) td.account.listingTd strong'
      ]),
      suitNumber2: detailType,
      adjudgedValue:
        labeledValue(firstText($, element, ['div.adjudgedValue', 'td.adjudgedValue.listingTd']), 'Adjudged Value:') ||
        firstText($, element, ['div.adjudgedValue strong', 'table tbody tr:nth-child(2) td.adjudgedValue.listingTd strong']),
      minBid:
        labeledValue(firstText($, element, ['div.minBid', 'td.minBid.listingTd']), 'Minimum Bid:') ||
        firstText($, element, ['div.minBid strong', 'table tbody tr:nth-child(2) td.minBid.listingTd strong']),
      additionalField: soldWithAccount
    };

    if (!listing.account) {
      return;
    }

    properties.push(listing);
  });

  return properties;
}
