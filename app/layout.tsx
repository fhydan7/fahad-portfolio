import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["400", "500", "600"] });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-plex-sans", weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-plex-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Fahad Yahya Dahish — Data & Business Analytics | Strategy & Planning | Performance Management",
    template: "%s · Fahad Yahya Dahish",
  },
  description:
    "Data and Business Analytics professional specializing in Strategy, Performance Management, Healthcare Analytics, KPI Development, Business Intelligence, and Executive Decision Support. Based in Riyadh, Saudi Arabia.",
  keywords: [
    "Senior Data Analyst", "Business Analyst", "Business Analytics", "Strategy Analyst", "Strategic Planning",
    "Performance Management", "KPI Specialist", "Healthcare Analytics", "Business Intelligence", "Power BI",
    "SQL", "Data Visualization", "Saudi Arabia",
  ],
  openGraph: {
    title: "Fahad Yahya Dahish — Turning Data into Business Decisions and Strategy into Measurable Performance.",
    description: "Data & Business Analytics | Strategy & Planning | Performance Management",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}>
        <ThemeProvider>
          <Nav />
          <main style={{ paddingTop: 64 }}>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
