import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { env } from "@/lib/env"

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif'
  ],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
}

const baseUrl = env.NEXT_PUBLIC_URL || 'https://automarkets.netlify.app/'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Auto Market",
    template: "%s | Auto Market"
  },
  description: "Find your perfect car from our extensive collection of quality vehicles.",
  keywords: ["cars", "auto", "marketplace", "vehicles", "buy cars", "sell cars", "used cars", "new cars"],
  authors: [{ name: "Auto Market" }],
  creator: "Auto Market",
  publisher: "Auto Market",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Auto Market",
    title: "Auto Market - Find Your Perfect Car",
    description: "Find your perfect car from our extensive collection of quality vehicles.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Auto Market - Car Marketplace"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Market - Find Your Perfect Car",
    description: "Find your perfect car from our extensive collection of quality vehicles.",
    images: ["/og-image.jpg"],
    creator: "@automarket"
  },
  verification: {
    google: "your-google-site-verification",
    other: {
      "norton-safeweb-site-verification": "norton-verification-key",
    }
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl,
    },
  },
  category: 'automotive',
}

// Add response headers for better caching and security
export const headers = {
  'Cache-Control': 'public, max-age=3600, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={inter.className}
    >
      <body className="antialiased">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <div className="relative flex min-h-screen flex-col px-4">
                <Header />
                <main className="flex-1 container mx-auto py-10">{children}</main>
                <Footer />
              </div>
            </ErrorBoundary>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
