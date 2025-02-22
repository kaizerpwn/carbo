import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carbo - Your personal carbon footprint tracker",
  description: "Carbo helps you track your carbon footprint",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
