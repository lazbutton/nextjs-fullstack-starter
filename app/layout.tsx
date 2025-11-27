import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/cookies";
import { ToastProvider } from "@/components/providers/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return {
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
      locale: locale,
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
