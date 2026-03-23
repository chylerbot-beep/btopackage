'use client';

import { useMemo, useState } from 'react';
import { isValidImageUrl } from '@/lib/image-url';

type PackageHeroImageProps = {
  imageUrl: string | null;
  firmName: string;
};

export default function PackageHeroImage({ imageUrl, firmName }: PackageHeroImageProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = useMemo(() => Boolean(imageUrl) && isValidImageUrl(imageUrl) && !hasImageError, [hasImageError, imageUrl]);

  return (
    <div className={`relative h-[220px] w-full ${shouldShowImage ? '' : 'bg-[#1B4332]'}`}>
      {shouldShowImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl!} alt={firmName} className="h-full w-full object-cover" onError={() => setHasImageError(true)} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        </>
      ) : null}
      <h1 className="absolute bottom-4 left-4 font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold text-white">{firmName}</h1>
    </div>
  );
}
