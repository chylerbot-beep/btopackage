import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Btopackage.sg',
  description:
    'Btopackage.sg privacy policy. We do not collect personal data, run lead forms, or pass your details to renovation firms. You contact firms directly via WhatsApp.',
  alternates: {
    canonical: 'https://www.btopackage.sg/privacy',
  },
};

const LAST_UPDATED = '1 April 2026';

export default function PrivacyPage() {
  return (
    <main>
      {/* Hero */}
      <section className="w-full bg-[#1B4332] px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h1
            className="text-3xl font-extrabold text-white"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Privacy Policy
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
              1. Who we are
            </h2>
            <p className="mt-3">
              Btopackage.sg is an independent directory that helps Singapore BTO homeowners
              compare renovation packages from HDB-licensed interior design firms. We are not a
              renovation agency and we do not earn referral commissions.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              2. What data we collect
            </h2>
            <p className="mt-3">
              <strong>Visitors:</strong> We do not run account registration, lead forms, or contact
              forms. We do not collect your name, email address, phone number, or any other personal
              information when you browse the site.
            </p>
            <p className="mt-3">
              <strong>WhatsApp:</strong> When you tap the WhatsApp button on a firm listing, you
              are redirected directly to WhatsApp. Btopackage.sg does not see, store, or intercept
              that conversation. The firm you contact receives your WhatsApp number, which is
              subject to their own privacy practices.
            </p>
            <p className="mt-3">
              <strong>Firm submissions:</strong> If an interior design firm submits a listing
              request via our submission form, we collect the firm name, HDB licence number, and
              WhatsApp number provided. This information is used solely to verify and publish the
              listing. We do not sell or share this with third parties.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              3. Cookies and analytics
            </h2>
            <p className="mt-3">
              Btopackage.sg may use privacy-respecting analytics (such as Vercel Analytics or
              Plausible) to understand aggregate page traffic — for example, which flat types are
              most searched. These tools do not use cookies that track you across websites and do
              not build individual user profiles.
            </p>
            <p className="mt-3">
              We do not use advertising cookies, third-party tracking pixels, or retargeting
              scripts.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              4. Third-party services
            </h2>
            <p className="mt-3">
              The site is hosted on Vercel (United States). Firm data is stored in Supabase. Both
              services comply with standard data protection practices. For details, see the{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Vercel Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Supabase Privacy Policy
              </a>
              .
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              5. Data retention
            </h2>
            <p className="mt-3">
              Firm submission data is retained for as long as the listing is active on the platform.
              If a firm requests removal of its listing, all associated data is deleted within 30
              days.
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              6. Your rights
            </h2>
            <p className="mt-3">
              Under Singapore's Personal Data Protection Act (PDPA), you have the right to request
              access to or correction of personal data we hold about you. Since we collect no
              personal data from visitors, this primarily applies to firms that have submitted a
              listing.
            </p>
            <p className="mt-3">
              To make a data request, contact us via the WhatsApp number listed on the{' '}
              <Link href="/about" className="underline">
                About page
              </Link>
              .
            </p>
          </div>

          <div>
            <h2
              className="text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              7. Changes to this policy
            </h2>
            <p className="mt-3">
              We may update this policy from time to time. The "last updated" date at the top of
              this page reflects the most recent revision. Continued use of Btopackage.sg after a
              policy change constitutes acceptance of the updated terms.
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
