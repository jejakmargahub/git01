import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { FontProvider } from "@/components/providers/FontProvider";

// Import regional Noto Sans fonts
import "@fontsource/noto-sans-javanese";
import "@fontsource/noto-sans-sundanese";
import "@fontsource/noto-sans-arabic";
import "@fontsource/noto-sans-sc";
import "@fontsource/noto-sans-tc";
import "@fontsource/noto-sans-batak";
import "@fontsource/noto-sans-balinese";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silsilah Keluarga",
  description:
    "Aplikasi untuk melacak dan mengelola pohon keluarga dengan mudah",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} antialiased`}>
        <FontProvider>{children}</FontProvider>
      </body>
    </html>
  );
}
