import type { Metadata } from "next";
import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import TopLoader from 'nextjs-toploader';

import { Providers } from '@/context/providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.tiakaly.com"
  ),
  title: {
    default: "Tiakaly - Une histoire sans faim",
    template: "%s | Tiakaly",
  },
  description:
    "Tiakaly vous fait découvrir les meilleurs restaurants, hôtels et lieux à visiter à Madagascar.",
  keywords: [
    "Madagascar",
    "voyage",
    "tourisme",
    "restaurant",
    "hôtel",
    "lieu",
    "découverte",
    "tiakaly",
  ],
  authors: [
    {
      name: "Tiakaly",
      url: "https://www.tiakaly.com",
    },
  ],
  creator: "Tiakaly",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.tiakaly.com",
    title: "Tiakaly - Une histoire sans faim",
    description:
      "Tiakaly vous fait découvrir les meilleurs restaurants, hôtels et lieux à visiter à Madagascar.",
    siteName: "Tiakaly",
    images: [
      {
        url: "og.jpg",
        width: 1200,
        height: 630,
        alt: "Tiakaly - Découvrez Madagascar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiakaly - Une histoire sans faim",
    description:
      "Tiakaly vous fait découvrir les meilleurs restaurants, hôtels et lieux à visiter à Madagascar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="googlebot" content="notranslate" />
        <meta name="google" content="notranslate" />
      </head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-RS36C2M0ML"
      ></Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-RS36C2M0ML"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RS36C2M0ML');
        `}
      </Script>
      <body
        translate="no"
        suppressHydrationWarning
        className={`min-h-screen overflow-y-scroll scroll-auto bg-background antialiased selection:bg-slate-100 selection:text-slate-500`}
      >
        <TopLoader showSpinner={false} color="#2e3746" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
