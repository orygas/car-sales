import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Auto Market",
    template: "%s | Auto Market"
  },
  description: "Find your perfect car from our extensive collection of quality vehicles.",
  keywords: ["cars", "auto", "marketplace", "vehicles", "buy cars", "sell cars"],
  authors: [{ name: "Auto Market" }],
  creator: "Auto Market",
  publisher: "Auto Market",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://automarket.example.com",
    siteName: "Auto Market",
    title: "Auto Market - Find Your Perfect Car",
    description: "Find your perfect car from our extensive collection of quality vehicles.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Auto Market"
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-site-verification",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <div className="relative flex min-h-screen flex-col">
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
