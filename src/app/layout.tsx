import type { Metadata } from "next";
import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
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
  title: "Tiakaly",
  description: "Les meilleurs plans bouffe de Madagascar",
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
