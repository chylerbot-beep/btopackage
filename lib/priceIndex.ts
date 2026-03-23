export const MARKET_PRICE_INDEX = {
  year: 2026,
  source: 'MoneySmart HDB Renovation Cost Guide',
  sourceUrl:
    'https://www.moneysmart.sg/personal-loan/hdb-renovation-cost-loan-guide-singapore-ms',
  note: 'Full renovation including furniture and fittings. Packages on this site cover carpentry + finishes only.',
  flatTypes: {
    '3-room': { bto: { min: 36100, max: 43700 } },
    '4-room': { bto: { min: 51000, max: 61800 } },
    '5-room': { bto: { min: 67000, max: 82400 } },
  },
};
