import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import GoogleSchema from "@/components/GoogleSchema";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: 'swap', // SEO Fix: ensures text is visible during font load
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: 'swap',
});

// Separate Viewport export (Next.js 14+ requirement)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allows accessibility zooming but keeps UI stable
  themeColor: "#0D0D0D", // Matches your luxury black theme
};

export const metadata: Metadata = {
  metadataBase: new URL('https://3pplemcontinentalhotel.ng'),
  title: {
    default: "3PPLE M | Luxury Boutique Hotel & Rooftop Bar Osapa London, Lekki",
    template: "%s | 3PPLEM"
  },
  description: "Experience timeless luxury at 3PPLE M. Exclusive suites, premium rooftop bar, and 24/7 sanctuary in the heart of Osapa London, Lekki.",
  keywords: ["Hotels in Lekki", "Rooftop bar Osapa London", "Luxury shortlet Lagos", "Boutique hotel Lekki", "3PPLEM"],
  alternates: {
    canonical: '/', // Tells Google this is the original source
  },
  openGraph: {
    title: "3PPLE M | Luxury Boutique Hotel",
    description: "Securing your sanctuary in Osapa London.",
    images: [{
      url: '/3ppleM_exterior.webp',
      width: 1200,
      height: 630,
      alt: '3PPLE M Continental Hotel Exterior',
    }],
    type: 'website',
    siteName: '3PPLE M Continental Hotel',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3PPLE M | Luxury Boutique Hotel',
    description: 'Securing your sanctuary in Osapa London.',
    images: ['/3ppleM_exterior.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <GoogleSchema />
      </head>
      <body
        className={`${cormorant.variable} ${jakarta.variable} font-sans antialiased bg-[#0D0D0D] text-white`}
      >
        {/* main tag helps SEO 'spiders' identify your primary content */}
        <main className="relative min-h-screen">
          {children}
        </main>
        
        <Footer/>
      </body>
    </html>
  );
}