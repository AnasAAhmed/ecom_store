import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import Navbar from "@/components/Navbar";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import UserFetcher from "@/components/UserFetch";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Borcelle Store",
  description: "Borcelle Ecommerce Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <ToasterProvider />
          <UserFetcher />

          <Navbar />
          <Suspense fallback={<Loader />}>
          <div className="max-sm:mt-20">

            {children}
          </div>
          </Suspense>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
