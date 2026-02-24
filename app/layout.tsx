import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://gout-wize.vercel.app"),
  title: "GoutWize — You're not alone with gout",
  description:
    "A community of real people sharing what actually works for gout. Track flares, log daily check-ins, discover patterns, and get support from others who truly understand.",
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
      </body>
    </html>
  );
}
