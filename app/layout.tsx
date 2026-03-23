import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Btopackage.sg',
  description: "Singapore's most transparent BTO renovation package comparison directory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
