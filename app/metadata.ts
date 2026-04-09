import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verified BTO Renovation Packages Singapore | Btopackage.sg',
  description:
    'Compare verified BTO renovation packages. Check whats included, HDB licence, CaseTrust accreditation, Google ratings before you Whatsapp',
  alternates: {
    canonical: 'https://www.btopackage.sg',
  },
  openGraph: {
    title: 'Verified BTO Renovation Packages Singapore | Btopackage.sg',
    description:
      'Compare verified BTO renovation packages. Check for full inclusions, HDB licence, CaseTrust accreditation, and real Google ratings before you WhatsApp.',
    url: 'https://www.btopackage.sg',
    siteName: 'Btopackage.sg',
    type: 'website',
    // Note: Generate this 1200x630 image and place it in /public
    images: [{ url: 'https://www.btopackage.sg/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};
