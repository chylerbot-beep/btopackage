import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use | Btopackage.sg',
  description:
    'Terms of use for Btopackage.sg — an independent BTO renovation package directory. Covers listing accuracy, no-commission model, and user responsibilities.',
  alternates: {
    canonical: 'https://www.btopackage.sg/terms',
  },
};

const LAST_UPDATED = '1 April 2026';

export default function TermsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="w-full bg-[#1B4332] px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h1
            className="text-3xl font-extrabold text-white"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Terms of Use
          </h1>
          <p className="mt-3 text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto w-full max-w-3xl px-4 py-12 text-[#374151]">
        <div className="space-y-10 text-sm leading-relaxed">

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              1. About Btopackage.sg
            </h2>
            <p className="mt-3">
              Btopackage.sg is an independent online directory that lists renovation packages from
              HDB-licensed interior design firms in Singapore. By using this website you agree to
              these terms. If you do not agree, please do not use the site.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              2. No referral fees or commissions
            </h2>
            <p className="mt-3">
              Btopackage.sg does not earn referral fees, lead commissions, or any payment tied to
              whether you sign a contract with a listed firm. Firms pay a flat monthly listing fee
              to appear on the platform. This fee covers the verification process and directory
              maintenance. Your renovation decision is entirely your own.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              3. Accuracy of listings
            </h2>
            <p className="mt-3">
              Package details — including price, inclusions, exclusions, and carpentry footage —
              are submitted by the interior design firms themselves and verified by Btopackage.sg at
              the time of listing. We make reasonable efforts to keep information current, but we
              cannot guarantee that all pricing or scope details remain accurate at the time you
              view them.
            </p>
            <p className="mt-3">
              Always confirm final package details, pricing, and scope directly with the firm before
              signing any contract. Btopackage.sg is not a party to any agreement between you and a
              renovation firm.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              4. HDB licence and accreditation verification
            </h2>
            <p className="mt-3">
              We verify HDB licence numbers against the public HDB Licensed Renovation Contractors
              registry and CaseTrust accreditation against the CASE registry at the time of listing.
              Licences and accreditations can lapse, be suspended, or be revoked after a firm's
              listing is published. Always verify the current status of a firm's licence directly
              with HDB before engaging their services.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              5. Price Guide
            </h2>
            <p className="mt-3">
              The{' '}
              <Link href="/price-guide" className="underline">
                Price Guide
              </Link>{' '}
              on Btopackage.sg provides indicative market rates for common renovation works in
              Singapore. These figures are sourced from publicly available contractor price lists
              and industry guides, cited on the Price Guide page. They are provided for reference
              only and do not constitute a quote or guarantee of any specific price.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              6. Limitation of liability
            </h2>
            <p className="mt-3">
              To the maximum extent permitted by Singapore law, Btopackage.sg and its operators
              are not liable for any loss or damage arising from your use of this website or
              reliance on any listing, price data, or firm information published here. This includes
              but is not limited to disputes with renovation firms, incomplete renovation work,
              deposit losses, or decisions made based on package details that have since changed.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              7. Firm listings and content
            </h2>
            <p className="mt-3">
              Firms listed on Btopackage.sg are responsible for the accuracy of information they
              submit. By submitting a listing, firms represent that the details provided are true
              and not misleading. Btopackage.sg reserves the right to remove or suspend any listing
              that we determine to be inaccurate, misleading, or in breach of these terms, at our
              sole discretion.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              8. Intellectual property
            </h2>
            <p className="mt-3">
              All content on Btopackage.sg — including text, design, data compilations, and the
              price guide — is the property of Btopackage.sg unless otherwise stated. You may not
              reproduce, scrape, or republish content from this site for commercial purposes without
              written permission.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              9. Governing law
            </h2>
            <p className="mt-3">
              These terms are governed by the laws of Singapore. Any disputes arising from your use
              of Btopackage.sg are subject to the exclusive jurisdiction of the Singapore courts.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              10. Changes to these terms
            </h2>
            <p className="mt-3">
              We may update these terms from time to time. The "last updated" date at the top of
              this page reflects the most recent revision. Continued use of the site after a change
              constitutes acceptance of the updated terms.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B4332] px-4 py-10 text-sm">
        <div className="mx-auto w-full max-w-3xl">
          <p
            className="mb-5 text-base font-bold text-white"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            BTOPACKAGE.SG
          </p>
          <nav className="mb-5 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/about" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              About
            </Link>
            <Link href="/price-guide" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              Price Guide
            </Link>
            <Link href="/directory" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              Directory
            </Link>
            <Link href="/privacy" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              Terms
            </Link>
          </nav>
          <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.15)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[rgba(255,255,255,0.5)]">
              © 2026 Btopackage.sg · Independent directory · No referral fees
            </p>
            <Link
              href="/submit"
              className="text-xs font-medium text-[rgba(255,255,255,0.85)] hover:text-white"
            >
              HDB-licensed firm? Submit a free listing →
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
