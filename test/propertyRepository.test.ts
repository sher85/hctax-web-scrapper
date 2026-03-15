import { describe, expect, it } from 'vitest';
import { diffProperties } from '../src/database/propertyRepository';
import type { PropertyListing } from '../src/types/property';

const baseProperty: PropertyListing = {
  address: '123 Main St',
  city: 'Houston',
  state: 'TX',
  zip: '77002',
  precinct: 'Precinct 1',
  suitNumber: 'Suit 2024-12345',
  account: '000-111-222-3333',
  suitNumber2: 'SN-101',
  adjudgedValue: '$250,000',
  minBid: '$90,000',
  additionalField: 'Additional Notes'
};

describe('diffProperties', () => {
  it('returns only changed fields', () => {
    const updated = {
      ...baseProperty,
      minBid: '$100,000',
      adjudgedValue: '$260,000'
    };

    expect(diffProperties(baseProperty, updated)).toEqual([
      {
        field: 'adjudgedValue',
        previousValue: '$250,000',
        currentValue: '$260,000'
      },
      {
        field: 'minBid',
        previousValue: '$90,000',
        currentValue: '$100,000'
      }
    ]);
  });

  it('returns an empty array when values match', () => {
    expect(diffProperties(baseProperty, baseProperty)).toEqual([]);
  });
});
