import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { CartProvider } from "@/context/cart-context";
import { FloatingCart } from "@/components/public/floating-cart";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MakiBros — Una Vez No Basta",
  description: "Los mejores makis en banderilla de Comas, Lima Norte. Pollo Crispy Hot, Salmón Furai, California Furai y más desde S/10. Pide por WhatsApp.",
  keywords: ["makis", "sushi", "banderillas", "makis en banderilla", "comas", "lima norte", "maki bros", "pollo crispy hot", "salmón furai", "delivery comas"],
  metadataBase: new URL('https://makibros.pe'),
  openGraph: {
    title: "MakiBros — Una Vez No Basta",
    description: "Makis en banderilla desde S/10. Av. El Retablo 115, Comas. Pide por WhatsApp.",
    siteName: "MakiBros",
    type: "website",
    locale: "es_PE",
    url: "https://makibros.pe",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&h=630&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "MakiBros — Makis en Banderilla",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakiBros — Una Vez No Basta",
    description: "Makis en banderilla desde S/10. Comas, Lima Norte.",
    images: ["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "MakiBros",
  "description": "Los mejores makis en banderilla de Comas. Pollo Crispy Hot, Salmón Furai, California Furai y más desde S/10.",
  "slogan": "Una Vez No Basta",
  "servesCuisine": ["Sushi", "Maki", "Fusión Peruano-Japonesa"],
  "priceRange": "S/10",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. El Retablo 115",
    "addressLocality": "Comas",
    "addressRegion": "Lima",
    "addressCountry": "PE"
  },
  "telephone": "+51924336957",
  "openingHours": ["Mo 17:30-22:00", "We 17:30-22:00", "Fr 17:30-22:00", "Sa 17:30-22:00"],
  "menu": "https://makibros.pe/#menu",
  "acceptsReservations": "False"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased font-sans min-h-screen flex flex-col`}>
        <CartProvider>
          <ToastProvider>
            {children}
            <FloatingCart />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
