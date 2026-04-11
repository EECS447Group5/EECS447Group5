import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stock Market Simulator",
  description: "Gain experience in the stock market without risking real money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Stock Sim
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/trade" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Trade
            </Link>
            <Link href="/portfolio" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Portfolio
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Login
            </Link>
          </div>
        </div>
      </nav>
        {children}
      </body>
    </html>
  );
}
