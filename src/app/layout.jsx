import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import MetaPixelProvider from "@/components/MetaPixelProvider";
import TestPurchaseModal from "@/components/TestPurchaseModal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Curso Básico de Diabetes",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <MetaPixelProvider />
          {children}
          <TestPurchaseModal />
        </body>
      </html>
    </ClerkProvider>
  );
}
