import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import AdminAwareFooter from "@/src/components/AdminAwareFooter";
import { Providers } from "@/src/components/Providers"; 
import { CartProvider } from "@/src/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monito - Pet Shop",
  description: "Find your best friend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Wrap EVERYTHING inside Providers */}
        <Providers>
          <CartProvider>
          <Navbar /> 
          {children}
          <AdminAwareFooter />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}