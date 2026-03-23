const DEFAULT_MESSAGE_TEMPLATE =
  'Hi {firmName}, I found your {flatType} BTO package at {price} on Btopackage.sg and would like to arrange a preliminary consultation. Could you let me know your availability?';

export function buildWhatsAppHref({
  phoneNumber,
  firmName,
  flatType,
  priceText,
  customMessage,
}: {
  phoneNumber: string;
  firmName: string;
  flatType: string;
  priceText: string;
  customMessage?: string | null;
}) {
  const sanitizedPhone = phoneNumber.replace(/[^\d]/g, '').replace(/^65/, '');
  const templateMessage = customMessage?.trim() || DEFAULT_MESSAGE_TEMPLATE;
  const resolvedMessage = templateMessage
    .replaceAll('{firmName}', firmName)
    .replaceAll('{flatType}', flatType)
    .replaceAll('{price}', priceText);

  return `https://wa.me/65${sanitizedPhone}?text=${encodeURIComponent(resolvedMessage)}`;
}
