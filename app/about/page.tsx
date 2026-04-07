import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Btopackage.sg | Verified BTO Renovation Packages Singapore',
    description:
      'Btopackage.sg was built by a Singapore homeowner who got burned by opaque renovation quotes. We make BTO package inclusions transparent so you can compare before you commit.',
  };
}

export default function AboutPage() {
  return (
    <main>
      <section className="w-full bg-[#1B4332] px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h1
            className="text-3xl font-extrabold text-white"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Why Btopackage.sg exists
          </h1>
          <p className="mt-3 text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Built by a Singapore homeowner who nearly paid $12,000 for screeding that should have
            cost $3,000.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-12 text-[#374151]">
        <h2
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          The story
        </h2>
        <div className="mt-4 space-y-4">
          <p>
            My daughter was born in 2024. In the middle of sleepless nights and juggling work, I
            also had to renovate our new BTO flat. I quickly realised there was almost no
            transparent information online about what a renovation package actually includes — or
            whether the price was fair.
          </p>
          <p>
            I sat through Zoom calls and in-person meetings just to get a quote, without knowing if
            the numbers were reasonable. Then one ID quoted me $12,000 for cement screeding on a
            5-room flat. The market rate is $3,000 to $4,000. I had no idea at the time — and that
            is exactly the problem.
          </p>
          <p>
            Btopackage.sg exists so that the next homeowner — especially one with a newborn, a
            toddler, and a full-time job — does not have to go through the same thing. You should
            be able to see what is included, what is not, and what a fair price looks like, before
            you WhatsApp anyone.
          </p>
          <p className="text-sm font-medium text-[#6B7280]">— Brandon, founder</p>
        </div>
      </section>

      <section className="bg-[#F9F7F4] px-4 py-12">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            How we verify the firms on this platform
          </h2>

          <div className="mt-6">
            <div className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-5 text-[#374151]">
              <h3 className="font-semibold text-[#1A1A1A]">HDB Renovation Licence — verified</h3>
              <p className="mt-2">
                Every firm on this platform holds a valid HDB Renovation Contractor licence. We
                check the licence number against HDB&apos;s records before a listing goes live.
                Unlicensed contractors cannot legally carry out renovation works in HDB flats —
                this is the baseline we hold every firm to.
              </p>
            </div>

            <div className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-5 text-[#374151]">
              <h3 className="font-semibold text-[#1A1A1A]">In-house team, not outsourced</h3>
              <p className="mt-2">
                We prioritise firms that use their own full-time workers rather than subcontracting
                the job out. When work is subcontracted, accountability gets murky — if something
                goes wrong, it is harder to know who to call. An in-house team means the firm is
                directly responsible for the quality of every job.
              </p>
            </div>

            <div className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-5 text-[#374151]">
              <h3 className="font-semibold text-[#1A1A1A]">
                CaseTrust accredited — your deposit is protected
              </h3>
              <p className="mt-2">
                CaseTrust-accredited firms are required to place customer deposits in a protected
                escrow account. If anything goes wrong before the renovation is complete, your
                deposit is not lost. We flag which firms carry this accreditation so you can factor
                it into your decision.
              </p>
            </div>

            <div className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-5 text-[#374151]">
              <h3 className="font-semibold text-[#1A1A1A]">
                Google rating — real feedback from real homeowners
              </h3>
              <p className="mt-2">
                Singaporeans are not shy about leaving a bad review. A firm with consistently high
                Google ratings across many reviews is a reliable signal that homeowners were
                satisfied with the outcome. We show each firm&apos;s Google rating and review count
                directly on their listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-10 text-[#374151]">
        <h2
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          What Btopackage.sg is not
        </h2>
        <div className="mt-4 whitespace-pre-line">
          <p>
            We are not a referral agency. We do not earn commissions when you contact a firm or
            sign a contract — there are no hidden fees tied to your outcome.

            Firms pay a flat monthly listing fee to appear on the platform. That fee covers the
            verification process and keeps the directory running. You WhatsApp firms directly. We
            never store your details or pass your details to anyone.
          </p>
        </div>
      </section>

      <section className="bg-[#1B4332] px-4 py-10 text-center text-white">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Are you an HDB-licensed firm?
          </h2>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Submit a free listing and reach homeowners who are actively comparing renovation
            packages.
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-[#1B4332]"
          >
            Submit your firm →
          </Link>
        </div>
      </section>

      <footer className="bg-[#1B4332] px-4 py-8 text-sm text-[rgba(255,255,255,0.7)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <p
            className="font-bold text-white"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            BTOPACKAGE.SG
          </p>
          <nav className="flex flex-wrap gap-3">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/directory">Directory</Link>
          </nav>
          <Link href="/submit">HDB-licensed firm? Submit a free listing →</Link>
        </div>
      </footer>
    </main>
  );
}
