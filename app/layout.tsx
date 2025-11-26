import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { defaultLocale } from "@/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Next.js Template",
    template: "%s | Next.js Template",
  },
  description: "A modern Next.js template with TypeScript, Supabase, and shadcn/ui",
  keywords: ["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: defaultLocale,
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Next.js Template",
    title: "Next.js Template",
    description: "A modern Next.js template with TypeScript, Supabase, and shadcn/ui",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Template",
    description: "A modern Next.js template with TypeScript, Supabase, and shadcn/ui",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
