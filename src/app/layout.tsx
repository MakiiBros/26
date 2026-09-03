import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MakiiBros — Fusión Peruano-Japonesa",
  description: "Los mejores makis, rolls especiales, ceviches y tiraditos. Pide online y recibe en tu puerta o recoge en local.",
  keywords: ["makis", "sushi", "ceviche", "tiradito", "comida japonesa", "fusión peruano japonesa", "delivery", "MakiiBros"],
  openGraph: {
    title: "MakiiBros — Fusión Peruano-Japonesa",
    description: "Los mejores makis, rolls especiales, ceviches y tiraditos. Pide online.",
    siteName: "MakiiBros",
    type: "website",
    locale: "es_PE",
    url: "https://makibros.me",
  },
  twitter: {
    card: "summary_large_image",
    title: "MakiiBros — Fusión Peruano-Japonesa",
    description: "Los mejores makis, rolls especiales, ceviches y tiraditos.",
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
    <html lang="es" className="dark">
      <body className={`${inter.variable} antialiased font-sans min-h-screen flex flex-col`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
