import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next15 Slug Tree & Caching Demo",
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
