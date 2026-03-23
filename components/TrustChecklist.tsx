type TrustChecklistProps = {
  hdbLicenceNumber: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  caseTrustAccredited: boolean;
};

type RowProps = {
  checked: boolean;
  text: string;
};

function ChecklistIcon({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#16A34A]">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none">
          <path
            d="M3.8 8.4 6.6 11l5.6-5.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return <span className="h-4 w-4 rounded-full border border-[#E5E7EB] bg-[#F9FAFB]" />;
}

function ChecklistRow({ checked, text }: RowProps) {
  return (
    <div className="flex items-center gap-2">
      <ChecklistIcon checked={checked} />
      <span
        className={checked ? 'text-sm text-[#1A1A1A] font-medium' : 'text-sm text-[#D1D5DB] font-normal'}
      >
        {text}
      </span>
    </div>
  );
}

export default function TrustChecklist({
  hdbLicenceNumber,
  googleRating,
  googleReviewCount,
  caseTrustAccredited,
}: TrustChecklistProps) {
  const hdbChecked = Boolean(hdbLicenceNumber);
  const googleChecked = typeof googleRating === 'number' && googleRating >= 4.5;
  const googleRatingText = typeof googleRating === 'number' ? googleRating.toFixed(1) : '-';
  const googleReviewText =
    typeof googleReviewCount === 'number' ? googleReviewCount.toLocaleString() : '-';

  return (
    <div className="space-y-2">
      <ChecklistRow
        checked={hdbChecked}
        text={`HDB Licence ${hdbLicenceNumber ?? '-'}`}
      />
      <ChecklistRow
        checked={googleChecked}
        text={`Google ${googleRatingText}★ · ${googleReviewText} reviews`}
      />
      <ChecklistRow checked={caseTrustAccredited} text="CaseTrust Accredited" />
    </div>
  );
}
