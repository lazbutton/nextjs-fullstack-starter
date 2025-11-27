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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  return {
    title: {
      default: "Next.js Template",
      template: "%s | Next.js Template",
    },
    description: "A modern Next.js template with TypeScript, Supabase, and shadcn/ui",
    keywords: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "shadcn/ui",
      "Full-stack",
      "Authentication",
      "PostgreSQL",
      "Server Actions",
      "App Router",
    ],
    authors: [{ name: "Your Name", url: baseUrl }],
    creator: "Your Name",
    publisher: "Your Name",
    applicationName: "Next.js Template",
    category: "Technology",
    classification: "Web Application",
    openGraph: {
      type: "website",
      locale: locale,
      url: baseUrl,
      siteName: "Next.js Template",
      title: "Next.js Template",
      description: "A modern Next.js template with TypeScript, Supabase, and shadcn/ui",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Next.js Template - Modern Full-stack Starter",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Next.js Template",
      description: "A modern Next.js template with TypeScript, Supabase, and shadcn/ui",
      images: [`${baseUrl}/og-image.png`],
      creator: "@YourTwitterHandle",
      site: "@YourTwitterHandle",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION && {
      other: {
        'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION,
      },
    }),
    alternates: {
      canonical: baseUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
      },
    },
    metadataBase: new URL(baseUrl),
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Next.js Template',
    description: 'A modern Next.js template with TypeScript, Supabase, and shadcn/ui',
    url: baseUrl,
    inLanguage: [locale, 'en', 'fr'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Next.js Template',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
