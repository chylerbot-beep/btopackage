type TrustBadgeType = 'hdb' | 'casetrust' | 'bca' | 'google' | 'verified';

type TrustBadgeProps = {
  type: TrustBadgeType;
  value?: string;
};

const baseClassName =
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold';

export default function TrustBadge({ type, value }: TrustBadgeProps) {
  if (type === 'hdb') {
    return (
      <span className={`${baseClassName} bg-green-100 text-green-800`}>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="currentColor"
        >
          <path d="M8 1.5 2 4v8l6 2.5L14 12V4L8 1.5Zm0 1.6 4.5 1.9v2.6H3.5V5l4.5-1.9Zm-4.5 8V8.9h9v2.2L8 13l-4.5-1.9Z" />
        </svg>
        HDB Licensed · {value ?? '-'}
      </span>
    );
  }

  if (type === 'casetrust') {
    return (
      <span className={`${baseClassName} bg-blue-100 text-blue-800`}>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="none"
        >
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5.2 8.3 7 10.1l3.8-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        CaseTrust Accredited
      </span>
    );
  }

  if (type === 'bca') {
    return (
      <span className={`${baseClassName} bg-gray-100 text-gray-700`}>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="none"
        >
          <rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        BCA Licensed
      </span>
    );
  }

  if (type === 'google') {
    return (
      <span className={`${baseClassName} bg-amber-100 text-amber-800`}>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="currentColor"
        >
          <path d="m8 1.8 1.9 3.8 4.2.6-3 2.9.7 4.1L8 11.3l-3.8 1.9.8-4.1-3-2.9 4.2-.6L8 1.8Z" />
        </svg>
        Google {value ?? '-'}★
      </span>
    );
  }

  return (
    <span className={`${baseClassName} bg-green-100 text-green-800`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5"
        fill="none"
      >
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path
          d="M4.8 8.3 7 10.5l4.2-4.2"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Verified {value ?? ''}
    </span>
  );
}
