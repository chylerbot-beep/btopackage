import type { Metadata } from 'next';
import PriceGuideClient from './PriceGuideClient';

export const metadata: Metadata = {
  title: 'BTO Renovation Price Guide Singapore 2026 | Btopackage.sg',
  description:
    'Check 2026 market rates for BTO renovation. Compare carpentry, flooring, and tiling costs before you negotiate with ID firms. Don’t overpay.',
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
  dateModified: '2026-04-08',
  author: { '@type': 'Person', name: 'Brandon', url: 'https://www.btopackage.sg/about' },
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
