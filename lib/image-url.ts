function normalizeImgurUrl(url: URL) {
  const host = url.hostname.toLowerCase();

  if (host === 'imgur.com' || host === 'www.imgur.com') {
    const match = url.pathname.match(/^\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)(?:\/)?$/);

    if (match?.[1]) {
      return `https://i.imgur.com/${match[1]}.jpg`;
    }
  }

  if (host === 'i.imgur.com') {
    const match = url.pathname.match(/^\/([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)?$/);

    if (match?.[1] && !match[2]) {
      return `https://i.imgur.com/${match[1]}.jpg`;
    }
  }

  return null;
}

export type ImageUrlValidationResult = {
  normalizedUrl: string | null;
  error?: string;
};

export type ImageUrlsValidationResult = {
  normalizedUrls: string[];
  error?: string;
};

export function normalizeAndValidateImageUrl(value: unknown): ImageUrlValidationResult {
  if (typeof value !== 'string') {
    return { normalizedUrl: null };
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return { normalizedUrl: null };
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedValue);
  } catch {
    return { normalizedUrl: null, error: 'Image URL must be an absolute URL.' };
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { normalizedUrl: null, error: 'Image URL must use http or https.' };
  }

  const normalizedKnownProvider = normalizeImgurUrl(parsedUrl);
  const normalizedUrl = normalizedKnownProvider ?? parsedUrl.toString();

  let normalizedParsedUrl: URL;

  try {
    normalizedParsedUrl = new URL(normalizedUrl);
  } catch {
    return { normalizedUrl: null, error: 'Image URL is invalid.' };
  }

  return { normalizedUrl: normalizedParsedUrl.toString() };
}

export function normalizeAndValidateImageUrls(values: unknown, maxCount: number): ImageUrlsValidationResult {
  if (!Array.isArray(values)) {
    return { normalizedUrls: [] };
  }

  if (values.length > maxCount) {
    return { normalizedUrls: [], error: `You can add up to ${maxCount} additional image URLs.` };
  }

  const normalizedUrls: string[] = [];

  for (let index = 0; index < values.length; index += 1) {
    const result = normalizeAndValidateImageUrl(values[index]);

    if (result.error) {
      return { normalizedUrls: [], error: `Additional image ${index + 1}: ${result.error}` };
    }

    if (result.normalizedUrl) {
      normalizedUrls.push(result.normalizedUrl);
    }
  }

  return { normalizedUrls };
}

export function isValidImageUrl(value: string | null | undefined) {
  return !normalizeAndValidateImageUrl(value).error;
}
