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
  metadataBase: new URL("https://fahad-portfolio-roan.vercel.app"),
  title: {
    default: "Fahad Dahish — Senior Data Analyst | Power BI, SQL, Healthcare Analytics | Riyadh",
    template: "%s · Fahad Dahish",
  },
  description:
    "Senior Data Analyst in Riyadh. Power BI, SQL and R dashboards, KPI design and healthcare analytics: 30% faster reporting, 40% fewer data errors, 12 project implementations. Open to new opportunities.",
  keywords: [
    "Senior Data Analyst", "Business Analyst", "Business Analytics", "Strategy Analyst", "Strategic Planning",
    "Performance Management", "KPI Specialist", "Healthcare Analytics", "Business Intelligence", "Power BI",
    "SQL", "Data Visualization", "Saudi Arabia",
  ],
  openGraph: {
    title: "Fahad Dahish — Senior Data Analyst",
    description: "Power BI, SQL and R. 30% faster reporting, 40% fewer data errors, 12 project implementations. Riyadh, Saudi Arabia.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
