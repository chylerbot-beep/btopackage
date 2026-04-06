import type { Metadata } from 'next';
import PriceGuideClient from './PriceGuideClient';

export const metadata: Metadata = {
  title: 'BTO Renovation Price Guide Singapore 2026 | Btopackage.sg',
  description:
    'Current market rates for common BTO renovation items in Singapore - carpentry, flooring, bathroom tiling, painting and more. Based on publicly available prices and real quotations.',
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
        text: 'Average BTO renovation costs are: 3-Room $36,100–$43,700, 4-Room $51,000–$61,800, 5-Room $67,000–$82,400. Costs vary based on scope of work, material choices, and carpentry included.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does per foot run mean in renovation quotes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Per foot run (pfr) refers to the length of a carpentry item measured in feet. A 10ft kitchen bottom cabinet at $150/pfr costs $1,500, regardless of depth or height. Divide millimetres by 304.8 to convert to feet.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a reasonable carpentry rate in Singapore?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kitchen cabinets are typically $150 to $200 per foot run for top and bottom. Wardrobes range from $250 to $360 per foot run for casement doors and $300 to $380 for sliding doors.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does vinyl flooring cost for a BTO flat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vinyl LVT costs $5 to $8 per sqft for supply and installation. For a 4-room BTO with around 800 to 900 sqft, budget $4,000 to $7,200. Cement screeding ($4–$6/sqft) and self-leveling compound ($2–$3/sqft) are usually required separately.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I budget for bathroom tiling in a new BTO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Budget $3,100 to $4,700 per bathroom for hack-and-relay tiling, including labour, materials, waterproofing, and tiles up to $3.50/sqft. Two bathrooms typically run $6,200 to $9,400.',
      },
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'BTO Renovation Price Guide Singapore 2026',
  description:
    'Market rates for carpentry, flooring, bathroom tiling, painting and more for BTO flats in Singapore.',
  datePublished: '2026-03-01',
  dateModified: '2026-03-01',
  author: { '@type': 'Organization', name: 'Btopackage.sg', url: 'https://www.btopackage.sg' },
  publisher: { '@type': 'Organization', name: 'Btopackage.sg', url: 'https://www.btopackage.sg' },
  mainEntityOfPage: 'https://www.btopackage.sg/price-guide',
};

export default function PriceGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <PriceGuideClient />
    </>
  );
}
