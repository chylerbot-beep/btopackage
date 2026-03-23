'use client';

import { useEffect, useState } from 'react';

const MAX_ITEMS = 5;

function parseShortlistFromUrl() {
  if (typeof window === 'undefined') {
    return [] as string[];
  }

  const searchParams = new URLSearchParams(window.location.search);
  const raw = searchParams.get('s');

  if (!raw) {
    return [] as string[];
  }

  return raw
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)
    .slice(0, MAX_ITEMS);
}

export default function ShortlistDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setShortlist(parseShortlistFromUrl());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);

    if (shortlist.length > 0) {
      searchParams.set('s', shortlist.join(','));
    } else {
      searchParams.delete('s');
    }

    const nextQuery = searchParams.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  }, [shortlist]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const count = shortlist.length;

  const canShare = count > 0;

  const removeItem = (slug: string) => {
    setShortlist((current) => current.filter((item) => item !== slug));
  };

  const clearAll = () => {
    if (typeof window !== 'undefined' && window.confirm('Clear all shortlisted items?')) {
      setShortlist([]);
    }
  };

  const shareList = async () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      await window.navigator.clipboard.writeText(window.location.href);
      setToast('Link copied!');
    } catch {
      setToast('Unable to copy link');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-6 right-4 z-50 min-h-[44px] px-4 bg-[#1B4332] text-white rounded-full shadow-lg font-medium text-sm"
      >
        My List ({count})
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1A1A1A]">My List ({count}/5)</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-sm text-gray-500"
          >
            Close
          </button>
        </div>

        <div className="space-y-2">
          {shortlist.length === 0 ? (
            <p className="text-sm text-gray-500">No items shortlisted yet.</p>
          ) : (
            shortlist.map((slug) => (
              <div
                key={slug}
                className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2"
              >
                <span className="text-sm text-[#1A1A1A]">{slug}</span>
                <button
                  type="button"
                  onClick={() => removeItem(slug)}
                  className="text-xs font-medium text-[#1B4332]"
                >
                  Remove ×
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={clearAll}
            className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#374151]"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={shareList}
            disabled={!canShare}
            className="rounded-md bg-[#1B4332] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
          >
            Share My List
          </button>
        </div>

        {toast && <p className="mt-3 text-sm text-[#16A34A]">{toast}</p>}
      </aside>
    </>
  );
}
