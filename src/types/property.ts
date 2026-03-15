export interface PropertyListing {
  address: string;
  city: string;
  state: string;
  zip: string;
  precinct: string;
  suitNumber: string;
  account: string;
  suitNumber2: string;
  adjudgedValue: string;
  minBid: string;
  additionalField: string;
}

export interface PropertyChange {
  field: keyof PropertyListing;
  previousValue: string;
  currentValue: string;
}

export interface SaveSummary {
  inserted: number;
  updated: number;
  unchanged: number;
}

export interface ScrapeSummary extends SaveSummary {
  scraped: number;
}
