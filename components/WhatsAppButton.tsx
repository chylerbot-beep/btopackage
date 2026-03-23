'use client';

type WhatsAppButtonProps = {
  phoneNumber: string;
  packageName: string;
  firmName: string;
  price: number;
  flatType: string;
  customMessage?: string;
};

type GtagWindow = Window & {
  gtag?: (command: 'event', eventName: string, params: Record<string, unknown>) => void;
};

export default function WhatsAppButton({
  phoneNumber,
  packageName,
  firmName,
  price,
  flatType,
  customMessage,
}: WhatsAppButtonProps) {
  const formattedPrice = `$${price.toLocaleString()}`;
  const templateMessage =
    customMessage?.trim() ||
    'Hi {firmName}, I found your {flatType} BTO package at {price} on Btopackage.sg and would like to arrange a preliminary consultation. Could you let me know your availability?';
  const resolvedMessage = templateMessage
    .replaceAll('{firmName}', firmName)
    .replaceAll('{flatType}', flatType)
    .replaceAll('{price}', formattedPrice);
  const message = encodeURIComponent(
    resolvedMessage
  );

  const sanitizedPhone = phoneNumber.replace(/[^\d]/g, '').replace(/^65/, '');
  const href = `https://wa.me/65${sanitizedPhone}?text=${message}`;

  const handleClick = () => {
    if (typeof window !== 'undefined' && typeof (window as GtagWindow).gtag === 'function') {
      (window as GtagWindow).gtag?.('event', 'whatsapp_click', {
        firm_name: firmName,
        package_name: packageName,
        price,
        flat_type: flatType,
      });
    }
  };

  return (
    <div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={handleClick}
        className="min-h-[44px] px-4 py-2 bg-[#25D366] text-white rounded-lg font-medium flex items-center gap-2"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <circle cx="12" cy="12" r="10" fill="#128C7E" />
          <path
            d="M8 19 8.8 15.9a6.8 6.8 0 1 1 2.7 1.1L8 19Z"
            fill="white"
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <path
            d="M10.2 9.6c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .5.4l.5 1.2c.1.3 0 .5-.1.6l-.3.3c-.1.1-.2.3 0 .5.2.4.7 1 1.3 1.3.2.1.4.1.5 0l.4-.3c.1-.1.3-.2.6-.1l1.1.5c.3.1.4.3.4.5v.5c0 .2 0 .5-.4.7-.4.2-1.3.4-2.4 0-1-.4-2.3-1.3-3.2-2.3-.9-.9-1.7-2.1-2-3.1-.3-1 .1-1.9.3-2.3Z"
            fill="#25D366"
          />
        </svg>
        WhatsApp
      </a>
      <p className="text-xs text-gray-500 mt-1">
        By tapping WhatsApp, you agree to be contacted by {firmName}.
      </p>
    </div>
  );
}
