'use client';

import { useState } from 'react';
import Link from 'next/link';
import { priceCategories, sources, type PriceCategory } from '@/data/price-guide';

function fmt(n: number): string {
  if (n >= 1000) return '$' + n.toLocaleString('en-SG');
  if (!Number.isInteger(n)) return '$' + n.toFixed(2);
  return '$' + n;
}

function AccordionSection({ category }: { category: PriceCategory }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#F9F7F4] transition-colors"
      >
        <span
          className="text-base font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          {category.title}
        </span>
        <span
          className="text-xl leading-none text-[#1B4332] transition-transform duration-200"
          style={{ display: 'inline-block', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-hidden
        >
          +
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '2000px' : '0px' }}
        aria-hidden={!open}
      >
        <div className="px-5 pb-1">
          {category.unitNote && (
            <p className="border-b border-[#F3EFE8] py-2 text-xs text-[#9CA3AF]">
              {category.unitNote}
            </p>
          )}
          {category.items.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-4 border-b border-[#F3EFE8] py-3 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#1A1A1A]">{item.label}</p>
                {item.note && (
                  <p className="mt-0.5 text-xs text-[#9CA3AF]">{item.note}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p
                  className="text-sm font-bold text-[#1B4332]"
                  style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
                >
                  {fmt(item.low)} - {fmt(item.high)}
                </p>
                <p className="text-xs text-[#9CA3AF]">{item.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type FaqItem = { q: string; a: string };

const faqs: FaqItem[] = [
  {
    q: 'How much does a BTO renovation cost in Singapore in 2026?',
    a: "According to MoneySmart's HDB Renovation Cost & Loan Guide (2026), average BTO renovation costs are: 3-Room $36,100-$43,700 · 4-Room $51,000-$61,800 · 5-Room $67,000-$82,400. Costs vary based on scope of work, material choices, and how much carpentry is included. A lean renovation sits at the lower end - more carpentry, false ceilings, and premium finishes push it higher.",
  },
  {
    q: 'What does "per foot run" mean in renovation quotes?',
    a: "Per foot run (pfr) refers to the length of a carpentry item measured in feet - not its area. A 10ft kitchen bottom cabinet at $150/pfr costs $1,500, regardless of its depth or height. It's the standard unit carpenters in Singapore use to quote cabinets, wardrobes, and countertops. Most quotes show measurements in millimetres - divide by 304.8 to convert to feet.",
  },
  {
    q: 'What is a reasonable carpentry rate in Singapore?',
    a: 'Kitchen cabinets are typically $150 to $200 per foot run for both top and bottom. Wardrobes range from $250 to $360 per foot run for casement doors and $300 to $380 for sliding doors. These rates cover solid plywood construction, laminate finish, soft-closing hinges, and drawer runners as standard inclusions.',
  },
  {
    q: 'How much does vinyl flooring cost for a BTO flat?',
    a: 'Vinyl LVT costs $5 to $8 per sqft for supply and installation. For a 4-room BTO with around 800 to 900 sqft of living and bedroom space, budget $4,000 to $7,200. Cement screeding ($4 to $6/sqft) and self-leveling compound ($2 to $3/sqft) are usually required first and quoted as separate line items.',
  },
  {
    q: 'How much should I budget for bathroom tiling in a new BTO?',
    a: "For a fresh BTO, bathroom tiling is a hack-and-relay job - there are no existing tiles to work around. Budget $3,100 to $4,700 per bathroom, which includes labour, materials, waterproofing, and tiles up to $3.50/sqft. Most 4-room and 5-room BTO flats have two bathrooms, so total tiling typically runs $6,200 to $9,400.",
  },
];

function FaqAccordion({ faq }: { faq: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left hover:bg-[#F9F7F4] transition-colors"
      >
        <span className="flex-1 text-sm font-semibold leading-snug text-[#1A1A1A]">
          {faq.q}
        </span>
        <span
          className="mt-0.5 shrink-0 text-xl leading-none text-[#1B4332] transition-transform duration-200"
          style={{ display: 'inline-block', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '500px' : '0px' }}
        aria-hidden={!open}
      >
        <p className="px-5 pb-4 text-sm leading-relaxed text-[#6B7280]">{faq.a}</p>
      </div>
    </div>
  );
}

export default function PriceGuideClient() {
  return (
    <main className="min-h-screen bg-[#F9F7F4]">
      {/* Header */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-4 pt-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1B4332]">
          BTO Price Guide
        </p>
        <h1
          className="mb-2 text-3xl font-bold leading-tight text-[#1A1A1A]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          BTO Price Guide: What&apos;s a reasonable price to pay for renovation in Singapore in
          2026?
        </h1>
        <p className="mb-2 text-sm leading-relaxed text-[#6B7280]">
          Current market rates for common renovation items, based on publicly available prices
          found online and real quotations from interior designers.
        </p>
        <p className="mb-2 text-sm leading-relaxed text-[#6B7280]">
          A lot of homeowners get shocked by VOs (Variation Orders) because they
          don&apos;t know the market rate for individual items. So here, we break down the
          standard BTO renovation costs for you <strong>line by line</strong>. This way, when you
          compare packages on Btopackage.sg, you know exactly what you are paying for.
        </p>
        <p className="text-xs text-[#9CA3AF]">
          All prices exclude GST unless otherwise stated. · Last updated March 2026.
        </p>
      </div>

      {/* CTA */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-4">
        <div className="flex flex-col gap-3 rounded-2xl bg-[#1B4332] px-5 py-5">
          <div>
            <p
              className="text-sm font-bold text-white"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              Compare BTO renovation packages.
            </p>
            <p className="mt-0.5 text-xs text-white/65">
              See what&apos;s included - and what&apos;s not - before you WhatsApp.
            </p>
          </div>
          <Link
            href="/"
            className="w-full rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#1B4332] hover:bg-[#F9F7F4] transition-colors"
          >
            View BTO Packages →
          </Link>
        </div>
      </div>

      {/* Price accordions */}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 pb-3">
        {priceCategories.map((cat) => (
          <AccordionSection key={cat.id} category={cat} />
        ))}
      </div>

      {/* Not on this list notice */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-6">
        <div className="rounded-2xl border border-[#E5E0D8] bg-white px-5 py-4">
          <p className="text-sm leading-relaxed text-[#6B7280]">
            <span className="font-medium text-[#1A1A1A]">Not on this list:</span> Electrical
            works, hacking and demolition, and aircon are excluded - costs vary too much by scope
            to give a reliable range. Aircon installation and servicing is also typically handled
            by aircon specialists, not interior designers.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-6">
        <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
          Frequently asked questions
        </p>
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <FaqAccordion key={faq.q} faq={faq} />
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-12">
        <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
          Sources
        </p>
        <ul className="flex flex-col gap-1.5">
          {sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1B4332] underline underline-offset-2 hover:text-[#F59E0B] transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-[#9CA3AF]">
          Prices are indicative and subject to market changes.
        </p>
      </div>
    </main>
  );
}
