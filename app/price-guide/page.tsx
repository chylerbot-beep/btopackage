import type { Metadata } from 'next';
import PriceGuideClient from './PriceGuideClient';

export const metadata: Metadata = {
  title: 'BTO Renovation Price Guide Singapore 2026 | Btopackage.sg',
  description:
    'Current market rates for common BTO renovation items in Singapore â€” carpentry, flooring, bathroom tiling, painting and more. Based on publicly available prices and real quotations.',
  alternates: {
    canonical: 'https://btopackage.sg/price-guide',
  },
  openGraph: {
    title: 'BTO Renovation Price Guide Singapore 2026 | Btopackage.sg',
    description:
      "What's a reasonable price to pay for renovation in Singapore in 2026? Market rates for carpentry, flooring, tiling, painting and more.",
    url: 'https://btopackage.sg/price-guide',
    siteName: 'Btopackage.sg',
    locale: 'en_SG',
    type: 'website',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a BTO renovation cost in Singapore in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "According to MoneySmart's HDB Renovation Cost & Loan Guide (2026), average BTO renovation costs are: 3-Room $36,100 to $43,700, 4-Room $51,000 to $61,800, 5-Room $67,000 to $82,400. Costs vary based on scope of work, material choices, and how much carpentry is included.",
      },
    },
    {
      '@type': 'Question',
      name: 'What does "per foot run" mean in renovation quotes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Per foot run (pfr) refers to the length of a carpentry item measured in feet, not its area. A 10ft kitchen bottom cabinet at $150/pfr costs $1,500, regardless of depth or height. It is the standard unit carpenters in Singapore use to quote cabinets, wardrobes, and countertops. Most quotes show measurements in millimetres divided by 304.8 to convert to feet then rounded up.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is a reasonable carpentry rate in Singapore?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kitchen cabinets are typically $150 to $200 per foot run for both top and bottom. Wardrobes range from $250 to $360 per foot run for casement doors and $300 to $380 for sliding doors. These rates cover solid plywood construction, laminate finish, soft-closing hinges, and drawer runners as standard inclusions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does vinyl flooring cost for a BTO flat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vinyl LVT costs $5 to $8 per sqft for supply and installation. For a 4-room BTO with around 800 to 900 sqft of living and bedroom space, budget $4,000 to $7,200. Cement screeding ($4 to $6/sqft) and self-leveling compound ($2 to $3/sqft) are usually required first and quoted as separate line items.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I budget for bathroom tiling in a new BTO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a fresh BTO, bathroom tiling is a hack-and-relay job. Budget $3,100 to $4,700 per bathroom, which includes labour, materials, waterproofing, and tiles up to $3.50/sqft. Most 4-room and 5-room BTO flats have two bathrooms, so total tiling typically runs $6,200 to $9,400.',
      },
    },
  ],
};

export default function PriceGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PriceGuideClient />
    </>
  );
}
