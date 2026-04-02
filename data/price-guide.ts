export type PriceItem = {
  label: string;
  low: number;
  high: number;
  unit: string;
  note?: string;
};

export type PriceCategory = {
  id: string;
  title: string;
  unitNote?: string;
  items: PriceItem[];
};

export const priceCategories: PriceCategory[] = [
  {
    id: 'carpentry',
    title: 'Carpentry',
    items: [
      { label: 'Kitchen top cabinet', low: 150, high: 200, unit: 'per ft run' },
      { label: 'Kitchen bottom cabinet', low: 150, high: 200, unit: 'per ft run' },
      { label: 'Wardrobe - casement / swing door', low: 250, high: 360, unit: 'per ft run' },
      { label: 'Wardrobe - sliding door', low: 300, high: 380, unit: 'per ft run' },
      { label: 'Full height storage cabinet', low: 250, high: 330, unit: 'per ft run' },
      { label: 'TV console (suspended)', low: 150, high: 210, unit: 'per ft run' },
      { label: 'Study table with drawers', low: 150, high: 200, unit: 'per ft run' },
    ],
  },
  {
    id: 'countertops',
    title: 'Kitchen Countertops & Backsplash',
    unitNote: 'Countertops are measured per foot run (length). Backsplash by area (per sqft).',
    items: [
      { label: 'Sintered stone countertop', low: 130, high: 180, unit: 'per ft run' },
      { label: 'Sintered stone backsplash', low: 100, high: 160, unit: 'per ft run' },
      { label: 'Quartz countertop', low: 100, high: 160, unit: 'per ft run' },
      { label: 'Solid surface countertop', low: 80, high: 140, unit: 'per ft run' },
      { label: 'Backsplash - tempered glass', low: 30, high: 45, unit: 'per sqft' },
      { label: 'Backsplash - tiles', low: 35, high: 50, unit: 'per sqft' },
    ],
  },
  {
    id: 'flooring',
    title: 'Flooring',
    items: [
      { label: 'Cement screeding', low: 4, high: 6, unit: 'per sqft' },
      { label: 'Self-leveling compound', low: 2, high: 3, unit: 'per sqft', note: 'Required before vinyl installation' },
      { label: 'Vinyl LVT - supply & install', low: 5, high: 8, unit: 'per sqft' },
      { label: 'Homogenous floor tiles - supply & lay', low: 7, high: 12, unit: 'per sqft', note: 'Includes tiles up to $3.50/sqft. Screed quoted separately.' },
    ],
  },
  {
    id: 'tiling',
    title: 'Bathroom Tiling',
    items: [
      { label: '2 bathrooms - overlay', low: 3000, high: 4200, unit: 'per set', note: 'Includes tiles up to $3.50/sqft' },
      { label: 'Per bathroom - hack & relay', low: 3100, high: 4700, unit: 'per bathroom' },
    ],
  },
  {
    id: 'ceiling',
    title: 'False Ceiling',
    items: [
      { label: 'Plasterboard flat ceiling', low: 4, high: 8, unit: 'per sqft' },
      { label: 'Cove lighting / L-box', low: 13, high: 25, unit: 'per ft run' },
      { label: 'Curtain or aircon pelmet', low: 13, high: 22, unit: 'per ft run' },
    ],
  },
  {
    id: 'glass-doors',
    title: 'Glass & Doors',
    items: [
      { label: 'Shower screen - fixed panel (frameless)', low: 300, high: 450, unit: 'per panel' },
      { label: 'Shower screen - fixed + swing door (frameless)', low: 600, high: 800, unit: 'per set' },
      { label: 'Laminated bedroom door - supply & install', low: 340, high: 500, unit: 'per door' },
      { label: 'Toilet door - bifold single panel', low: 450, high: 550, unit: 'per door' },
      { label: 'Toilet door - bifold louvre', low: 520, high: 650, unit: 'per door' },
    ],
  },
  {
    id: 'painting',
    title: 'Painting',
    items: [
      { label: '3-Room BTO - walls, ceiling & sealer', low: 1600, high: 2200, unit: 'lump sum' },
      { label: '4-Room BTO - walls, ceiling & sealer', low: 1900, high: 2600, unit: 'lump sum' },
      { label: '5-Room BTO - walls, ceiling & sealer', low: 2100, high: 2800, unit: 'lump sum' },
    ],
  },
];

export const sources = [
  { label: 'JS Carpentry - Carpentry Price List Singapore', url: 'https://jscarpentry.com.sg/pricelist/' },
  { label: 'WhiteArtz Carpentry - Price List 2026', url: 'https://whiteartz.com/carpentry-price-list-singapore/' },
  { label: 'Cabinets.sg - Carpentry Price List', url: 'https://cabinets.sg/carpentry-price-list-singapore/' },
  { label: 'Nippon Paint Singapore - Professional Painting Services', url: 'https://www.nipponpaint.com.sg/professional-painting-services/' },
  { label: 'MoneySmart - HDB Renovation Cost & Loan Guide Singapore (2026)', url: 'https://www.moneysmart.sg/personal-loan/hdb-renovation-cost-loan-guide-singapore-ms' },
  { label: 'RenoTake - Real Cost of Renovating a 4-Room BTO', url: 'https://renotake.sg/guides/4-room-bto-cost' },
  { label: '99.co - Renovation Cost Breakdown Singapore', url: 'https://www.99.co/singapore/insider/your-must-have-renovation-cost-breakdown/' },
  { label: 'Tiling.sg - Complete Tiling Price List Singapore', url: 'https://tiling.sg' },
];
