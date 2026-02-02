import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeerTaste v2 - Twoje piwa",
  description: "Osobista aplikacja do katalogowania i recenzowania piw. 129 recenzji z profesjonalnymi ocenami i zdjęciami.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BeerTaste v2",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "BeerTaste v2",
    title: "BeerTaste v2 - Twoje piwa",
    description: "Osobista aplikacja do katalogowania i recenzowania piw",
  },
  twitter: {
    card: "summary",
    title: "BeerTaste v2",
    description: "Osobista aplikacja do katalogowania i recenzowania piw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#9ca3af" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
