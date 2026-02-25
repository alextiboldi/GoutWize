import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2C3E50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gout-wize.vercel.app"),
  title: "GoutWize — You're not alone with gout",
  description:
    "A community of real people sharing what actually works for gout. Track flares, log daily check-ins, discover patterns, and get support from others who truly understand.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GoutWize",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "GoutWize — You're not alone with gout",
    description:
      "A community of real people sharing what actually works for gout. Track flares, log daily check-ins, discover patterns, and get support from others who truly understand.",
    type: "website",
    siteName: "GoutWize",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoutWize — You're not alone with gout",
    description:
      "A community of real people sharing what actually works for gout. Track flares, log daily check-ins, discover patterns, and get support.",
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
        className={`${outfit.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-gw-navy focus:shadow-lg"
        >
          Skip to content
        </a>
        <main id="main-content">{children}</main>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
