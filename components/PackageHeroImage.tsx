'use client';

import { useMemo, useState } from 'react';
import { isValidImageUrl } from '@/lib/image-url';

type PackageHeroImageProps = {
  imageUrls: string[];
  firmName: string;
};

export default function PackageHeroImage({ imageUrls, firmName }: PackageHeroImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedIndexes, setFailedIndexes] = useState<number[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const validImages = useMemo(
    () =>
      imageUrls.filter((url, index) => {
        return Boolean(url) && isValidImageUrl(url) && !failedIndexes.includes(index);
      }),
    [failedIndexes, imageUrls]
  );

  const shouldShowImage = validImages.length > 0;
  const currentImage = shouldShowImage ? validImages[activeIndex % validImages.length] : null;

  const goToPrevious = () => {
    if (validImages.length <= 1) return;
    setActiveIndex((current) => (current - 1 + validImages.length) % validImages.length);
  };

  const goToNext = () => {
    if (validImages.length <= 1) return;
    setActiveIndex((current) => (current + 1) % validImages.length);
  };

  return (
    <div className={`relative h-[220px] w-full ${shouldShowImage ? '' : 'bg-[#1B4332]'}`}>
      {shouldShowImage ? (
        <>
          <button
            type="button"
            className="block h-full w-full"
            aria-label="Open image"
            onClick={() => setIsLightboxOpen(true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage!}
              alt={firmName}
              className="h-full w-full object-cover"
              onError={() => {
                const originalIndex = imageUrls.findIndex((url) => url === currentImage);
                if (originalIndex !== -1) {
                  setFailedIndexes((current) => [...current, originalIndex]);
                }
              }}
            />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          {validImages.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 px-2 py-1 text-sm text-white"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={goToNext}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 px-2 py-1 text-sm text-white"
              >
                ›
              </button>
              <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
                {validImages.map((_, index) => (
                  <button
                    key={`image-dot-${index + 1}`}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 w-2 rounded-full ${index === activeIndex ? 'bg-white' : 'bg-white/45'}`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : null}
      <h1 className="absolute bottom-4 left-4 font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold text-white">{firmName}</h1>
      {isLightboxOpen && currentImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Close image"
            className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white"
            onClick={() => setIsLightboxOpen(false)}
          >
            ✕
          </button>
          {validImages.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 rounded-full bg-black/70 px-3 py-2 text-white"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 rounded-full bg-black/70 px-3 py-2 text-white"
              >
                ›
              </button>
            </>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${firmName} full image`}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
