import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

const SITE_URL = 'https://hotel-sandy-gamma.vercel.app'
const OG_IMAGE = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop&q=80'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GrandStay Hotel & Suites | Luxury Hotel in Lagos, Nigeria',
    template: '%s | GrandStay Hotel',
  },
  description:
    'Experience luxury and comfort at GrandStay Hotel in Victoria Island, Lagos. Book rooms online — Standard, Deluxe, Suite, Family & Penthouse rooms available. Best rates guaranteed.',
  keywords: [
    'hotel Lagos', 'luxury hotel Victoria Island', 'hotel booking Nigeria',
    'GrandStay Hotel', 'best hotel Lagos', 'hotel suite Lagos',
  ],
  authors: [{ name: 'GrandStay Hotel' }],
  creator: 'GrandStay Hotel',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE_URL,
    siteName: 'GrandStay Hotel',
    title: 'GrandStay Hotel & Suites | Luxury Hotel in Lagos',
    description:
      'World-class hospitality in the heart of Victoria Island, Lagos. Book your stay online and enjoy our award-winning service.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'GrandStay Hotel exterior' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GrandStay Hotel & Suites',
    description: 'Luxury hotel in Victoria Island, Lagos, Nigeria.',
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-white">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: '10px', fontSize: '14px', boxShadow: '0 4px 20px rgba(0,0,0,.12)' },
            success: { iconTheme: { primary: '#1a3c5e', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
