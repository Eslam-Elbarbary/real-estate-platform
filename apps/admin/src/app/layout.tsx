import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Real Estate Platform',
  description: 'Admin dashboard placeholder',
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
