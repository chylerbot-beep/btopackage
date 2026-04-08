import type { Metadata } from 'next';
import PriceGuideClient from './PriceGuideClient';

export const metadata: Metadata = {
  title: 'BTO Renovation Price Guide Singapore 2026 | Btopackage.sg',
  description:
    'Current market rates for common BTO renovation items in Singapore - carpentry, flooring, bathroom tiling, painting and more. Based on publicly available prices and real quotations.',
  alternates: {
    canonical: 'https://www.btopackage.sg/price-guide',
  },
  openGraph: {
    title: 'BTO Renovation Price Guide Singapore 2026 | Btopackage.sg',
    description:
      "What's a reasonable price to pay for renovation in Singapore in 2026? Market rates for carpentry, flooring, tiling, painting and more.",
    url: 'https://www.btopackage.sg/price-guide',
    siteName: 'Btopackage.sg',
    locale: 'en_SG',
    type: 'website',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'BTO Renovation Price Guide Singapore 2026',
  description:
    'Market rates for carpentry, flooring, bathroom tiling, painting and more for BTO flats in Singapore.',
  datePublished: '2026-03-01',
  dateModified: '2026-04-07',
  author: { '@type': 'Organization', name: 'Btopackage.sg', url: 'https://www.btopackage.sg' },
  publisher: { '@type': 'Organization', name: 'Btopackage.sg', url: 'https://www.btopackage.sg' },
  mainEntityOfPage: 'https://www.btopackage.sg/price-guide',
};

export default function PriceGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <PriceGuideClient />
    </>
  );
}
