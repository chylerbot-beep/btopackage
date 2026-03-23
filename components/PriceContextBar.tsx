import { MARKET_PRICE_INDEX } from '@/lib/priceIndex';

type FlatType = '3-room' | '4-room' | '5-room';

type PriceContextBarProps = {
  flatType?: FlatType;
};

export default function PriceContextBar({ flatType }: PriceContextBarProps) {
  if (!flatType) {
    return null;
  }

  const marketRange = MARKET_PRICE_INDEX.flatTypes[flatType]?.bto;

  if (!marketRange) {
    return null;
  }

  const min = marketRange.min.toLocaleString('en-SG', { maximumFractionDigits: 0 });
  const max = marketRange.max.toLocaleString('en-SG', { maximumFractionDigits: 0 });

  return (
    <div
      className="w-full px-4 py-2"
      style={{
        backgroundColor: '#F0F7F4',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '13px',
        color: '#374151',
      }}
    >
      Market average full renovation: ${min}–${max} ({flatType} BTO) · Source: MoneySmart 2026
    </div>
  );
}
