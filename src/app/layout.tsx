import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#FF385C",
};

const defaultTitle = "Work Adda - Find Local Workers in Sircilla";
const defaultDescription =
  "Your trusted platform to find electricians, plumbers, carpenters, and more in Sircilla. Quickly browse profiles and contact workers directly with zero commission.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: defaultTitle,
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: SITE_URL,
    siteName: "Work Adda",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 512,
        height: 512,
        alt: "Work Adda - Sircilla Local Services",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
