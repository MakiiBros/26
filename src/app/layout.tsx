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
  title: "MakiBros — El verdadero flow en cada bocado",
  description: "Los mejores makis, rolls especiales, ceviches y banderillas crocantes en Lima. Pide online y recibe en tu puerta o recoge en local.",
  keywords: ["makis", "sushi", "ceviche", "tiradito", "banderillas", "comida japonesa", "fusión peruano japonesa", "delivery lima", "MakiBros"],
  metadataBase: new URL('https://makibros.pe'),
  openGraph: {
    title: "MakiBros — Fusión Peruano-Japonesa",
    description: "Los mejores makis y banderillas de Lima Norte. Pide online con flow.",
    siteName: "MakiBros",
    type: "website",
    locale: "es_PE",
    url: "https://makibros.pe",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&h=630&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "MakiBros Especiales",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakiBros — Fusión Peruano-Japonesa",
    description: "Los mejores makis en banderilla. Pide online y recibe en tu puerta.",
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
  "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&h=630&auto=format&fit=crop",
  "description": "Los mejores makis, rolls especiales, ceviches y banderillas crocantes en Lima.",
  "servesCuisine": ["Sushi", "Japanese", "Peruvian Fusion"],
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Principal 123",
    "addressLocality": "Lima Norte",
    "addressRegion": "LMA",
    "postalCode": "15301",
    "addressCountry": "PE"
  },
  "telephone": "+51970725307",
  "menu": "https://makibros.pe/menu",
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
